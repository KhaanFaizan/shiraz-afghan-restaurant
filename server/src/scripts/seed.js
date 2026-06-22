/**
 * Seed script — populates RestaurantTable, OpeningHour, and BookingSetting.
 * Clears all existing data in those collections first.
 * Run with:  npm run seed
 */
import '../config/env.js'
import mongoose from 'mongoose'
import { config } from '../config/env.js'
import RestaurantTable from '../models/RestaurantTable.js'
import OpeningHour from '../models/OpeningHour.js'
import BookingSetting from '../models/BookingSetting.js'
import Reservation from '../models/Reservation.js'
import BookingLock from '../models/BookingLock.js'

const line = '─'.repeat(50)

// ── Tables ────────────────────────────────────────────────────────────────────
const tables = [
  // Window zone — intimate 2-person seats
  { name: 'W1', capacity: 2, zone: 'Window' },
  { name: 'W2', capacity: 2, zone: 'Window' },
  { name: 'W3', capacity: 2, zone: 'Window' },

  // Main Hall — standard 4-person tables
  { name: 'M1', capacity: 4, zone: 'Main Hall' },
  { name: 'M2', capacity: 4, zone: 'Main Hall' },
  { name: 'M3', capacity: 4, zone: 'Main Hall' },
  { name: 'M4', capacity: 4, zone: 'Main Hall' },
  { name: 'M5', capacity: 4, zone: 'Main Hall' },

  // Family Area — 6-person tables
  { name: 'F1', capacity: 6, zone: 'Family Area' },
  { name: 'F2', capacity: 6, zone: 'Family Area' },
  { name: 'F3', capacity: 6, zone: 'Family Area' },

  // Private Dining — large group tables
  { name: 'P1', capacity: 8,  zone: 'Private Dining' },
  { name: 'P2', capacity: 10, zone: 'Private Dining' },
]

// ── Opening hours ─────────────────────────────────────────────────────────────
// dayOfWeek: 0 = Sunday … 6 = Saturday
const openingHours = [
  { dayOfWeek: 0, openTime: '12:00', closeTime: '22:00', isClosed: false }, // Sun
  { dayOfWeek: 1, openTime: '12:00', closeTime: '22:30', isClosed: false }, // Mon
  { dayOfWeek: 2, openTime: '12:00', closeTime: '22:30', isClosed: false }, // Tue
  { dayOfWeek: 3, openTime: '12:00', closeTime: '22:30', isClosed: false }, // Wed
  { dayOfWeek: 4, openTime: '12:00', closeTime: '23:00', isClosed: false }, // Thu
  { dayOfWeek: 5, openTime: '12:00', closeTime: '23:00', isClosed: false }, // Fri
  { dayOfWeek: 6, openTime: '12:00', closeTime: '23:00', isClosed: false }, // Sat
]

// ── Booking settings ──────────────────────────────────────────────────────────
const bookingSetting = {
  slotLengthMinutes:          30,
  reservationDurationMinutes: 90,
  maxAdvanceBookingDays:      30,
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n${line}`)
  console.log('  Shiraz Afghan Restaurant — Database Seed')
  console.log(`${line}\n`)

  console.log('  Connecting to MongoDB Atlas...')
  await mongoose.connect(config.mongoUri)
  console.log('  ✅  Connected\n')

  // Clear existing data
  console.log('  Clearing existing collections...')
  await Promise.all([
    RestaurantTable.deleteMany({}),
    OpeningHour.deleteMany({}),
    BookingSetting.deleteMany({}),
    Reservation.deleteMany({}),
    BookingLock.deleteMany({}),
  ])
  console.log('  ✅  Collections cleared\n')

  // Seed tables
  const insertedTables = await RestaurantTable.insertMany(tables)
  console.log(`  ✅  Tables inserted        : ${insertedTables.length}`)

  // Summary by zone
  const zones = [...new Set(tables.map(t => t.zone))]
  zones.forEach(zone => {
    const count = tables.filter(t => t.zone === zone).length
    console.log(`       ${zone.padEnd(18)}: ${count} table${count > 1 ? 's' : ''}`)
  })

  // Seed opening hours
  await OpeningHour.insertMany(openingHours)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  console.log(`\n  ✅  Opening hours inserted : ${openingHours.length} days`)
  openingHours.forEach(h => {
    const status = h.isClosed ? 'Closed' : `${h.openTime} – ${h.closeTime}`
    console.log(`       ${dayNames[h.dayOfWeek].padEnd(6)}: ${status}`)
  })

  // Seed booking settings
  await BookingSetting.create(bookingSetting)
  console.log(`\n  ✅  Booking settings inserted`)
  console.log(`       Slot length           : ${bookingSetting.slotLengthMinutes} min`)
  console.log(`       Reservation duration  : ${bookingSetting.reservationDurationMinutes} min`)
  console.log(`       Max advance booking   : ${bookingSetting.maxAdvanceBookingDays} days`)

  console.log(`\n${line}`)
  console.log('  Seed complete. Database is ready.')
  console.log(`${line}\n`)

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('\n  ❌  Seed failed:', err.message)
  process.exit(1)
})
