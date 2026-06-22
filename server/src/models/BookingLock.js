import mongoose from 'mongoose'

// Short-lived lock documents used to prevent double-booking
// under near-simultaneous requests. TTL index auto-expires them.
const bookingLockSchema = new mongoose.Schema(
  {
    // Unique key: "tableId:date:slotTime"
    lockKey: {
      type: String,
      required: [true, 'Lock key is required'],
      unique: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: [true, 'Table reference is required'],
    },
    // Populated once the reservation document is saved
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    slotTime: {
      type: String,
      required: [true, 'Slot time is required'],
    },
    // TTL: auto-delete stale locks after 60 seconds if
    // the booking transaction did not complete
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60_000),
    },
  },
  { timestamps: true }
)

bookingLockSchema.index({ table: 1, date: 1, slotTime: 1 })
// TTL index — MongoDB removes the document when expiresAt is reached
bookingLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const BookingLock = mongoose.model('BookingLock', bookingLockSchema)

export default BookingLock
