import mongoose from 'mongoose'
import RestaurantTable from '../models/RestaurantTable.js'
import { sendSuccess, sendError } from '../utils/response.js'

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

export async function getAllTables(req, res) {
  try {
    const tables = await RestaurantTable.find()
      .sort({ capacity: 1, name: 1 })
      .lean()

    sendSuccess(res, tables, `${tables.length} table${tables.length !== 1 ? 's' : ''} found`)
  } catch (err) {
    sendError(res, 'Failed to fetch tables', 500)
  }
}

export async function toggleOutOfService(req, res) {
  const { id } = req.params
  if (!isValidObjectId(id)) return sendError(res, 'Invalid table ID', 400)

  try {
    const table = await RestaurantTable.findById(id)
    if (!table) return sendError(res, 'Table not found', 404)

    table.isOutOfService = !table.isOutOfService
    await table.save()

    const msg = table.isOutOfService
      ? `Table ${table.name} marked as out of service`
      : `Table ${table.name} is back in service`

    sendSuccess(res, table.toObject(), msg)
  } catch (err) {
    sendError(res, 'Failed to update table status', 500)
  }
}
