import mongoose from 'mongoose'

export const RESERVATION_STATUS = {
  CONFIRMED:  'CONFIRMED',
  CANCELLED:  'CANCELLED',
  COMPLETED:  'COMPLETED',
  NO_SHOW:    'NO_SHOW',
}

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    // Stored as "YYYY-MM-DD" string for easy day-based querying
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1'],
    },
    status: {
      type: String,
      enum: Object.values(RESERVATION_STATUS),
      default: RESERVATION_STATUS.CONFIRMED,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: [true, 'Table reference is required'],
    },
    specialRequest: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
)

reservationSchema.index({ date: 1 })
reservationSchema.index({ status: 1 })
// Compound index for overlap detection queries
reservationSchema.index({ table: 1, startTime: 1, endTime: 1 })

const Reservation = mongoose.model('Reservation', reservationSchema)

export default Reservation
