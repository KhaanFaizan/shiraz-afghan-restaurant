import mongoose from 'mongoose'

const restaurantTableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    zone: {
      type: String,
      required: [true, 'Zone is required'],
      trim: true,
    },
    isOutOfService: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

restaurantTableSchema.index({ capacity: 1 })
restaurantTableSchema.index({ isOutOfService: 1 })
restaurantTableSchema.index({ zone: 1 })

const RestaurantTable = mongoose.model('RestaurantTable', restaurantTableSchema)

export default RestaurantTable
