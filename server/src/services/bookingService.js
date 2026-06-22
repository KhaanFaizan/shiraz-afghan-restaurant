import BookingSetting from '../models/BookingSetting.js'
import OpeningHour from '../models/OpeningHour.js'
import RestaurantTable from '../models/RestaurantTable.js'
import Reservation, { RESERVATION_STATUS } from '../models/Reservation.js'
import BookingLock from '../models/BookingLock.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert "HH:mm" to total minutes from midnight.
 */
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Convert total minutes to "HH:mm" string.
 */
function toTimeStr(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Build a UTC Date from a date string ("YYYY-MM-DD") and a time string ("HH:mm").
 * Times are treated as UTC to keep the system timezone-agnostic.
 */
function buildUTCDate(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00.000Z`)
}

/**
 * Generate all slot-segment times covered by a reservation starting at
 * `startTimeStr` with `reservationDurationMinutes`, using `slotLengthMinutes`.
 *
 * Example: start=19:00, duration=90, slot=30 → ["19:00", "19:30", "20:00"]
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
 * Build the lockKey string used as the unique identifier for a BookingLock.
 * Format: "<tableId>_<YYYY-MM-DD>_<HH:mm>"
 */
function buildLockKey(tableId, date, slotTime) {
  return `${tableId.toString()}_${date}_${slotTime}`
}

// ── Core: check if a single table is free for a given window ─────────────────

async function isTableFree(tableId, date, startTime, endTime, slotSegments) {
  // 1. Check for any overlapping confirmed reservation
  const overlap = await Reservation.findOne({
    table:     tableId,
    status:    RESERVATION_STATUS.CONFIRMED,
    startTime: { $lt: endTime },
    endTime:   { $gt: startTime },
  }).lean()

  if (overlap) return false

  // 2. Check for existing booking locks on any segment
  const lockKeys = slotSegments.map(t => buildLockKey(tableId, date, t))
  const existingLock = await BookingLock.findOne({ lockKey: { $in: lockKeys } }).lean()

  return !existingLock
}

// ── Service 1: Generate available time slots ──────────────────────────────────

export async function generateTimeSlots(date, partySize) {
  // ── Load settings ───────────────────────────────────────────────────────────
  const settings = await BookingSetting.findOne().lean()
  if (!settings) throw new Error('Booking settings not configured. Run the seed script.')

  const { slotLengthMinutes, reservationDurationMinutes, maxAdvanceBookingDays } = settings

  // ── Validate date window ────────────────────────────────────────────────────
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

  // ── Check opening hours ─────────────────────────────────────────────────────
  const dayOfWeek = selectedUTC.getUTCDay() // 0=Sun … 6=Sat
  const openingHour = await OpeningHour.findOne({ dayOfWeek }).lean()

  if (!openingHour) {
    throw Object.assign(new Error('Opening hours not configured for this day'), { statusCode: 500 })
  }
  if (openingHour.isClosed) {
    throw Object.assign(new Error('The restaurant is closed on this day'), { statusCode: 400 })
  }

  // ── Get suitable tables ─────────────────────────────────────────────────────
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

  // ── Generate and filter slots ───────────────────────────────────────────────
  const openMin  = toMinutes(openingHour.openTime)
  const closeMin = toMinutes(openingHour.closeTime)
  const lastSlotStart = closeMin - reservationDurationMinutes
  const nowUTC = new Date()
  const availableSlots = []

  for (let min = openMin; min <= lastSlotStart; min += slotLengthMinutes) {
    const timeStr  = toTimeStr(min)
    const startTime = buildUTCDate(date, timeStr)
    const endTime   = new Date(startTime.getTime() + reservationDurationMinutes * 60_000)

    // Skip slots that have already passed today
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

  // ── Load settings ───────────────────────────────────────────────────────────
  const settings = await BookingSetting.findOne().lean()
  if (!settings) throw new Error('Booking settings not configured')

  const { slotLengthMinutes, reservationDurationMinutes, maxAdvanceBookingDays } = settings

  // ── Date/time validation ────────────────────────────────────────────────────
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

  const startTime = buildUTCDate(date, time)
  if (startTime <= new Date()) {
    throw Object.assign(new Error('This time slot is in the past'), { statusCode: 400 })
  }

  const endTime = new Date(startTime.getTime() + reservationDurationMinutes * 60_000)

  // ── Check opening hours ─────────────────────────────────────────────────────
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

  // ── Find suitable tables (smallest capacity first) ──────────────────────────
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

  // ── Slot segment times this reservation covers ──────────────────────────────
  const segments = buildSegmentTimes(time, reservationDurationMinutes, slotLengthMinutes)

  // ── Try each table — smallest first ─────────────────────────────────────────
  for (const table of suitableTables) {
    // Quick reservation overlap check before attempting locks
    const overlap = await Reservation.findOne({
      table:     table._id,
      status:    RESERVATION_STATUS.CONFIRMED,
      startTime: { $lt: endTime },
      endTime:   { $gt: startTime },
    }).lean()

    if (overlap) continue

    // Attempt to atomically claim all segment locks
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
          // Duplicate key — another request beat us to this slot on this table
          lockConflict = true
          break
        }
        throw err // Unexpected error — re-throw
      }
    }

    if (lockConflict) {
      // Release any partial locks we managed to create for this table
      if (createdLockIds.length > 0) {
        await BookingLock.deleteMany({ _id: { $in: createdLockIds } })
      }
      continue // Try next table
    }

    // ── All locks acquired — create the reservation ─────────────────────────
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
        status:         RESERVATION_STATUS.CONFIRMED,
        table:          table._id,
        specialRequest,
      })
    } catch (err) {
      // If reservation creation fails, release locks so slot stays available
      await BookingLock.deleteMany({ _id: { $in: createdLockIds } })
      throw err
    }

    // Link locks to the new reservation
    await BookingLock.updateMany(
      { _id: { $in: createdLockIds } },
      { reservation: reservation._id }
    )

    // Return fully populated reservation
    return Reservation.findById(reservation._id).populate('table').lean()
  }

  // ── No table could be locked ─────────────────────────────────────────────
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

  // Free the slots by deleting associated locks
  await BookingLock.deleteMany({ reservation: reservation._id })

  return Reservation.findById(reservation._id).populate('table').lean()
}

// ── Service 4: List reservations ──────────────────────────────────────────────

export async function listReservations({ date, view = 'day' } = {}) {
  const filter = {}

  if (date) {
    if (view === 'week') {
      // Return 7 days starting from the given date
      const start = new Date(`${date}T00:00:00.000Z`)
      const end   = new Date(start)
      end.setUTCDate(end.getUTCDate() + 7)

      // date field is stored as YYYY-MM-DD string — build the range
      const dateRange = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setUTCDate(d.getUTCDate() + i)
        dateRange.push(d.toISOString().slice(0, 10))
      }
      filter.date = { $in: dateRange }
    } else {
      // Default: day view
      filter.date = date
    }
  }

  return Reservation.find(filter)
    .populate('table', 'name capacity zone')
    .sort({ date: 1, startTime: 1 })
    .lean()
}
