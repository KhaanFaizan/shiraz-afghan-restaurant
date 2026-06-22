import RestaurantTable from '../models/RestaurantTable.js'
import { sendSuccess, sendError } from '../utils/response.js'

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
