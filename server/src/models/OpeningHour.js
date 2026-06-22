import mongoose from 'mongoose'

// dayOfWeek follows JS Date convention: 0 = Sunday, 6 = Saturday
const openingHourSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: [true, 'Day of week is required'],
      min: [0, 'dayOfWeek must be 0 (Sunday) to 6 (Saturday)'],
      max: [6, 'dayOfWeek must be 0 (Sunday) to 6 (Saturday)'],
    },
    openTime: {
      type: String,
      required: [true, 'Open time is required'],
      match: [/^\d{2}:\d{2}$/, 'openTime must be in HH:mm format'],
    },
    closeTime: {
      type: String,
      required: [true, 'Close time is required'],
      match: [/^\d{2}:\d{2}$/, 'closeTime must be in HH:mm format'],
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

openingHourSchema.index({ dayOfWeek: 1 }, { unique: true })

const OpeningHour = mongoose.model('OpeningHour', openingHourSchema)

export default OpeningHour
