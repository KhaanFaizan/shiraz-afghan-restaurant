import BookingSetting from '../models/BookingSetting.js'
import OpeningHour from '../models/OpeningHour.js'
import RestaurantTable from '../models/RestaurantTable.js'
import Reservation, { RESERVATION_STATUS } from '../models/Reservation.js'
import BookingLock from '../models/BookingLock.js'

// ── Time helpers ──────────────────────────────────────────────────────────────

/** Convert "HH:mm" to total minutes from midnight. */
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/** Convert total minutes from midnight to "HH:mm" string. */
function toTimeStr(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Build a UTC Date from a YYYY-MM-DD date string and an HH:mm time string.
 * All times are stored as UTC to keep the system timezone-agnostic — the
 * restaurant's local time IS the UTC time stored in the database.
 */
function buildUTCDate(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00.000Z`)
}

/**
 * Return all slot-segment start times covered by a reservation.
 * A 90-min reservation with 30-min slots starting at 19:00 covers:
 *   ["19:00", "19:30", "20:00"]
 * Each segment needs its own BookingLock row to block concurrent requests.
 */
function buildSegmentTimes(startTimeStr, reservationDurationMinutes, slotLengthMinutes) {
  const startMin = toMinutes(startTimeStr)
  const numSegments = Math.ceil(reservationDurationMinutes / slotLengthMinutes)
  const segments = []
  for (let i = 0; i < numSegments; i++) {
    segments.push(toTimeStr(startMin + i * slotLengthMinutes))
  }
  return segments
}

/**
 * Build the unique lockKey for a BookingLock document.
 * Format: "<tableId>_<YYYY-MM-DD>_<HH:mm>"
 * The unique index on lockKey is the concurrency guard — two simultaneous
 * requests trying to insert the same lockKey will cause one to receive a
 * MongoDB duplicate-key error (code 11000), which we use to detect and
 * resolve conflicts without a distributed lock manager.
 */
function buildLockKey(tableId, date, slotTime) {
  return `${tableId.toString()}_${date}_${slotTime}`
}

/**
 * Compute the expiresAt value to set on BookingLock rows once they are
 * linked to a confirmed reservation.
 *
 * WHY: BookingLock rows are created with a 60-second TTL so MongoDB
 * automatically removes abandoned locks (e.g. from a request that crashed
 * mid-way). But once a reservation is confirmed, we need the locks to
 * persist until well after the reservation has ended — otherwise MongoDB
 * would delete them and allow a second booking to overlap.
 *
 * We set expiresAt to 2 hours after the reservation's endTime, giving a
 * generous buffer before the slot opens up again for re-booking.
 */
function confirmedLockExpiry(reservationEndTime) {
  return new Date(reservationEndTime.getTime() + 2 * 60 * 60 * 1000)
}

// ── Core: check if a single table is free for a given window ─────────────────

async function isTableFree(tableId, date, startTime, endTime, slotSegments) {
  // 1. Check for any confirmed reservation that overlaps this window
  const overlap = await Reservation.findOne({
    table:     tableId,
    status:    RESERVATION_STATUS.CONFIRMED,
    startTime: { $lt: endTime },
    endTime:   { $gt: startTime },
  }).lean()

  if (overlap) return false

  // 2. Check for any active BookingLock on any segment
  //    (guards against a concurrent request that hasn't saved its Reservation yet)
  const lockKeys = slotSegments.map(t => buildLockKey(tableId, date, t))
  const existingLock = await BookingLock.findOne({ lockKey: { $in: lockKeys } }).lean()

  return !existingLock
}

// ── Service 1: Generate available time slots ──────────────────────────────────

export async function generateTimeSlots(date, partySize) {
  const settings = await BookingSetting.findOne().lean()
  if (!settings) throw new Error('Booking settings not configured. Run the seed script.')

  const { slotLengthMinutes, reservationDurationMinutes, maxAdvanceBookingDays } = settings

  // ── Validate date window ─────────────────────────────────────────────────────
  const todayUTC = new Date()
  todayUTC.setUTCHours(0, 0, 0, 0)

  const selectedUTC = new Date(`${date}T00:00:00.000Z`)

  if (selectedUTC < todayUTC) {
    throw Object.assign(new Error('Selected date is in the past'), { statusCode: 400 })
  }

  const maxDate = new Date(todayUTC)
  maxDate.setUTCDate(maxDate.getUTCDate() + maxAdvanceBookingDays)

  if (selectedUTC > maxDate) {
    throw Object.assign(
      new Error(`Bookings can only be made up to ${maxAdvanceBookingDays} days in advance`),
      { statusCode: 400 }
    )
  }

  // ── Check opening hours ──────────────────────────────────────────────────────
  const dayOfWeek = selectedUTC.getUTCDay() // 0 = Sun, 6 = Sat
  const openingHour = await OpeningHour.findOne({ dayOfWeek }).lean()

  if (!openingHour) {
    throw Object.assign(new Error('Opening hours not configured for this day'), { statusCode: 500 })
  }
  if (openingHour.isClosed) {
    throw Object.assign(new Error('The restaurant is closed on this day'), { statusCode: 400 })
  }

  // ── Find tables that can seat the party (out-of-service excluded) ────────────
  const suitableTables = await RestaurantTable.find({
    capacity:       { $gte: partySize },
    isOutOfService: false,
  })
    .sort({ capacity: 1, name: 1 })
    .lean()

  if (suitableTables.length === 0) {
    throw Object.assign(
      new Error('No tables available for this party size'),
      { statusCode: 400 }
    )
  }

  // ── Generate slots and filter to only those with at least one free table ─────
  const openMin  = toMinutes(openingHour.openTime)
  const closeMin = toMinutes(openingHour.closeTime)
  const lastSlotStart = closeMin - reservationDurationMinutes
  const nowUTC = new Date()
  const availableSlots = []

  for (let min = openMin; min <= lastSlotStart; min += slotLengthMinutes) {
    const timeStr   = toTimeStr(min)
    const startTime = buildUTCDate(date, timeStr)
    const endTime   = new Date(startTime.getTime() + reservationDurationMinutes * 60_000)

    // Skip slots already in the past
    if (startTime <= nowUTC) continue

    const segments = buildSegmentTimes(timeStr, reservationDurationMinutes, slotLengthMinutes)

    // A slot is available if at least one suitable table is free for the full window
    let hasAvailableTable = false
    for (const table of suitableTables) {
      if (await isTableFree(table._id, date, startTime, endTime, segments)) {
        hasAvailableTable = true
        break
      }
    }

    if (hasAvailableTable) {
      availableSlots.push({ time: timeStr, available: true })
    }
  }

  return availableSlots
}

// ── Service 2: Create a reservation ──────────────────────────────────────────

export async function createReservation(payload) {
  const {
    customerName,
    email,
    phone,
    date,
    time,
    partySize,
    specialRequest = '',
  } = payload

  const settings = await BookingSetting.findOne().lean()
  if (!settings) throw new Error('Booking settings not configured')

  const { slotLengthMinutes, reservationDurationMinutes, maxAdvanceBookingDays } = settings

  // ── Date validation ──────────────────────────────────────────────────────────
  const todayUTC = new Date()
  todayUTC.setUTCHours(0, 0, 0, 0)
  const selectedUTC = new Date(`${date}T00:00:00.000Z`)

  if (selectedUTC < todayUTC) {
    throw Object.assign(new Error('Cannot book a reservation in the past'), { statusCode: 400 })
  }

  const maxDate = new Date(todayUTC)
  maxDate.setUTCDate(maxDate.getUTCDate() + maxAdvanceBookingDays)
  if (selectedUTC > maxDate) {
    throw Object.assign(
      new Error(`Bookings can only be made up to ${maxAdvanceBookingDays} days in advance`),
      { statusCode: 400 }
    )
  }

  // ── Time validation ──────────────────────────────────────────────────────────
  const startTime = buildUTCDate(date, time)
  if (startTime <= new Date()) {
    throw Object.assign(new Error('This time slot is in the past'), { statusCode: 400 })
  }

  const endTime = new Date(startTime.getTime() + reservationDurationMinutes * 60_000)

  // ── Opening hours validation ─────────────────────────────────────────────────
  const dayOfWeek = selectedUTC.getUTCDay()
  const openingHour = await OpeningHour.findOne({ dayOfWeek }).lean()

  if (!openingHour || openingHour.isClosed) {
    throw Object.assign(new Error('The restaurant is closed on this day'), { statusCode: 400 })
  }

  const openMin  = toMinutes(openingHour.openTime)
  const closeMin = toMinutes(openingHour.closeTime)
  const slotMin  = toMinutes(time)

  if (slotMin < openMin || slotMin + reservationDurationMinutes > closeMin) {
    throw Object.assign(
      new Error('The requested time is outside opening hours'),
      { statusCode: 400 }
    )
  }

  // ── Find suitable tables (smallest capacity first) ───────────────────────────
  const suitableTables = await RestaurantTable.find({
    capacity:       { $gte: partySize },
    isOutOfService: false,
  })
    .sort({ capacity: 1, name: 1 })
    .lean()

  if (suitableTables.length === 0) {
    throw Object.assign(
      new Error('No tables are available for this party size'),
      { statusCode: 409 }
    )
  }

  const segments = buildSegmentTimes(time, reservationDurationMinutes, slotLengthMinutes)

  // ── Try each table — acquire locks atomically ────────────────────────────────
  for (const table of suitableTables) {
    // Quick overlap check before attempting to create locks
    const overlap = await Reservation.findOne({
      table:     table._id,
      status:    RESERVATION_STATUS.CONFIRMED,
      startTime: { $lt: endTime },
      endTime:   { $gt: startTime },
    }).lean()

    if (overlap) continue

    // Attempt to atomically claim all slot-segment locks for this table.
    // BookingLock has a unique index on lockKey, so a duplicate-key error
    // (code 11000) means another concurrent request beat us to this slot.
    const lockDocs = segments.map(seg => ({
      lockKey:  buildLockKey(table._id, date, seg),
      table:    table._id,
      date,
      slotTime: seg,
    }))

    const createdLockIds = []
    let lockConflict = false

    for (const lockDoc of lockDocs) {
      try {
        const lock = await BookingLock.create(lockDoc)
        createdLockIds.push(lock._id)
      } catch (err) {
        if (err.code === 11000) {
          // Another request already holds this segment — roll back partial locks
          lockConflict = true
          break
        }
        throw err
      }
    }

    if (lockConflict) {
      if (createdLockIds.length > 0) {
        await BookingLock.deleteMany({ _id: { $in: createdLockIds } })
      }
      continue // Try the next table
    }

    // ── All locks acquired — create the reservation ──────────────────────────
    let reservation
    try {
      reservation = await Reservation.create({
        customerName,
        email,
        phone,
        date,
        startTime,
        endTime,
        partySize,
        status:  RESERVATION_STATUS.CONFIRMED,
        table:   table._id,
        specialRequest,
      })
    } catch (err) {
      // If Reservation.create fails, release locks so the slot stays available
      await BookingLock.deleteMany({ _id: { $in: createdLockIds } })
      throw err
    }

    // Link locks to the reservation AND extend their TTL past the reservation
    // end time. Without this, the 60-second TTL would delete confirmed locks
    // and allow a second booking to overlap the same slot.
    await BookingLock.updateMany(
      { _id: { $in: createdLockIds } },
      {
        reservation: reservation._id,
        expiresAt:   confirmedLockExpiry(endTime),
      }
    )

    return Reservation.findById(reservation._id).populate('table').lean()
  }

  // No table could be locked for this slot
  throw Object.assign(
    new Error('This time slot is no longer available. Please choose a different time.'),
    { statusCode: 409 }
  )
}

// ── Service 3: Cancel a reservation ──────────────────────────────────────────

export async function cancelReservation(reservationId) {
  const reservation = await Reservation.findById(reservationId)

  if (!reservation) {
    throw Object.assign(new Error('Reservation not found'), { statusCode: 404 })
  }
  if (reservation.status === RESERVATION_STATUS.CANCELLED) {
    throw Object.assign(new Error('Reservation is already cancelled'), { statusCode: 400 })
  }
  if (reservation.status === RESERVATION_STATUS.COMPLETED) {
    throw Object.assign(new Error('Completed reservations cannot be cancelled'), { statusCode: 400 })
  }

  reservation.status = RESERVATION_STATUS.CANCELLED
  await reservation.save()

  // Deleting the locks frees the slot immediately for new bookings
  await BookingLock.deleteMany({ reservation: reservation._id })

  return Reservation.findById(reservation._id).populate('table').lean()
}

// ── Service 4: List reservations ──────────────────────────────────────────────

export async function listReservations({ date, view = 'day' } = {}) {
  const filter = {}

  if (date) {
    if (view === 'week') {
      // Build an explicit array of 7 date strings so we can query the
      // date field (stored as YYYY-MM-DD string) without a range scan
      const start = new Date(`${date}T00:00:00.000Z`)
      const dateRange = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setUTCDate(d.getUTCDate() + i)
        dateRange.push(d.toISOString().slice(0, 10))
      }
      filter.date = { $in: dateRange }
    } else {
      filter.date = date
    }
  }

  return Reservation.find(filter)
    .populate('table', 'name capacity zone')
    .sort({ date: 1, startTime: 1 })
    .lean()
}

// ── Service 5: Modify a reservation ──────────────────────────────────────────

export async function modifyReservation(reservationId, changes) {
  const reservation = await Reservation.findById(reservationId)
  if (!reservation) {
    throw Object.assign(new Error('Reservation not found'), { statusCode: 404 })
  }
  if (reservation.status === RESERVATION_STATUS.COMPLETED) {
    throw Object.assign(new Error('Completed reservations cannot be modified'), { statusCode: 400 })
  }

  // Reconstruct the existing time string from the stored UTC Date
  const existingTimeStr = toTimeStr(
    reservation.startTime.getUTCHours() * 60 + reservation.startTime.getUTCMinutes()
  )

  const newDate      = changes.date      ?? reservation.date
  const newTime      = changes.time      ?? existingTimeStr
  const newPartySize = changes.partySize ?? reservation.partySize
  const newStatus    = changes.status    ?? reservation.status

  const scheduleChanged =
    newDate      !== reservation.date  ||
    newTime      !== existingTimeStr   ||
    newPartySize !== reservation.partySize

  const statusBecomingCancelled =
    newStatus === RESERVATION_STATUS.CANCELLED &&
    reservation.status !== RESERVATION_STATUS.CANCELLED

  // ── Status-only cancel (no schedule change needed) ───────────────────────────
  if (statusBecomingCancelled && !scheduleChanged) {
    reservation.status = RESERVATION_STATUS.CANCELLED
    if (changes.customerName   !== undefined) reservation.customerName   = changes.customerName.trim()
    if (changes.phone          !== undefined) reservation.phone          = changes.phone.trim()
    if (changes.specialRequest !== undefined) reservation.specialRequest = changes.specialRequest.trim()
    await reservation.save()
    // Free locks immediately so the slot opens for new bookings
    await BookingLock.deleteMany({ reservation: reservation._id })
    return Reservation.findById(reservation._id).populate('table').lean()
  }

  // ── Non-schedule update (name / phone / notes / status change only) ──────────
  if (!scheduleChanged) {
    if (changes.customerName   !== undefined) reservation.customerName   = changes.customerName.trim()
    if (changes.phone          !== undefined) reservation.phone          = changes.phone.trim()
    if (changes.specialRequest !== undefined) reservation.specialRequest = changes.specialRequest.trim()
    if (changes.status)                       reservation.status         = changes.status
    await reservation.save()
    return Reservation.findById(reservation._id).populate('table').lean()
  }

  // ── Schedule changed — re-validate and re-book with conflict prevention ───────
  const settings = await BookingSetting.findOne().lean()
  if (!settings) throw new Error('Booking settings not configured')

  const { slotLengthMinutes, reservationDurationMinutes } = settings

  const todayUTC    = new Date()
  todayUTC.setUTCHours(0, 0, 0, 0)
  const selectedUTC = new Date(`${newDate}T00:00:00.000Z`)

  if (selectedUTC < todayUTC) {
    throw Object.assign(new Error('Cannot move a reservation to a past date'), { statusCode: 400 })
  }

  const dayOfWeek   = selectedUTC.getUTCDay()
  const openingHour = await OpeningHour.findOne({ dayOfWeek }).lean()

  if (!openingHour || openingHour.isClosed) {
    throw Object.assign(new Error('The restaurant is closed on that day'), { statusCode: 400 })
  }

  const openMin  = toMinutes(openingHour.openTime)
  const closeMin = toMinutes(openingHour.closeTime)
  const slotMin  = toMinutes(newTime)

  if (slotMin < openMin || slotMin + reservationDurationMinutes > closeMin) {
    throw Object.assign(new Error('The requested time is outside opening hours'), { statusCode: 400 })
  }

  const newStartTime = buildUTCDate(newDate, newTime)

  // Guard against moving a reservation to a time slot already in the past
  if (newStartTime <= new Date()) {
    throw Object.assign(new Error('Cannot move a reservation to a past time'), { statusCode: 400 })
  }

  const newEndTime = new Date(newStartTime.getTime() + reservationDurationMinutes * 60_000)
  const segments   = buildSegmentTimes(newTime, reservationDurationMinutes, slotLengthMinutes)

  const suitableTables = await RestaurantTable.find({
    capacity:       { $gte: newPartySize },
    isOutOfService: false,
  }).sort({ capacity: 1, name: 1 }).lean()

  if (suitableTables.length === 0) {
    throw Object.assign(new Error('No tables available for this party size'), { statusCode: 409 })
  }

  // Release existing locks BEFORE attempting new ones to avoid self-conflict
  await BookingLock.deleteMany({ reservation: reservation._id })

  for (const table of suitableTables) {
    // Overlap check — exclude the reservation being modified so it doesn't
    // block itself when re-booking the same or an adjacent slot
    const overlap = await Reservation.findOne({
      _id:       { $ne: reservation._id },
      table:     table._id,
      status:    RESERVATION_STATUS.CONFIRMED,
      startTime: { $lt: newEndTime },
      endTime:   { $gt: newStartTime },
    }).lean()

    if (overlap) continue

    const lockDocs       = segments.map(seg => ({
      lockKey:  buildLockKey(table._id, newDate, seg),
      table:    table._id,
      date:     newDate,
      slotTime: seg,
    }))
    const createdLockIds = []
    let lockConflict     = false

    for (const lockDoc of lockDocs) {
      try {
        const lock = await BookingLock.create(lockDoc)
        createdLockIds.push(lock._id)
      } catch (err) {
        if (err.code === 11000) { lockConflict = true; break }
        throw err
      }
    }

    if (lockConflict) {
      if (createdLockIds.length > 0) {
        await BookingLock.deleteMany({ _id: { $in: createdLockIds } })
      }
      continue
    }

    // Update the reservation with new schedule and any other changes
    reservation.date           = newDate
    reservation.startTime      = newStartTime
    reservation.endTime        = newEndTime
    reservation.partySize      = newPartySize
    reservation.table          = table._id
    reservation.status         = newStatus
    if (changes.customerName   !== undefined) reservation.customerName   = changes.customerName.trim()
    if (changes.phone          !== undefined) reservation.phone          = changes.phone.trim()
    if (changes.specialRequest !== undefined) reservation.specialRequest = changes.specialRequest.trim()

    await reservation.save()

    // Extend lock TTL past the (new) reservation end time
    await BookingLock.updateMany(
      { _id: { $in: createdLockIds } },
      {
        reservation: reservation._id,
        expiresAt:   confirmedLockExpiry(newEndTime),
      }
    )

    return Reservation.findById(reservation._id).populate('table').lean()
  }

  throw Object.assign(
    new Error('No availability for the requested time. Please choose a different slot.'),
    { statusCode: 409 }
  )
}
