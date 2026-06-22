import mongoose from 'mongoose'

// Singleton-style collection — only one document should exist.
// Use BookingSetting.findOne() to read, and upsert to update.
const bookingSettingSchema = new mongoose.Schema(
  {
    slotLengthMinutes: {
      type: Number,
      default: 30,
      min: [15, 'Slot length must be at least 15 minutes'],
    },
    reservationDurationMinutes: {
      type: Number,
      default: 90,
      min: [30, 'Reservation duration must be at least 30 minutes'],
    },
    maxAdvanceBookingDays: {
      type: Number,
      default: 30,
      min: [1, 'Must allow at least 1 day advance booking'],
    },
  },
  { timestamps: true }
)

const BookingSetting = mongoose.model('BookingSetting', bookingSettingSchema)

export default BookingSetting
