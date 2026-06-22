import {
  createReservation,
  cancelReservation,
  listReservations,
} from '../services/bookingService.js'
import {
  createReservationSchema,
  listReservationsSchema,
  parseSchema,
} from '../validators/bookingValidator.js'
import { sendSuccess, sendError } from '../utils/response.js'

// POST /api/reservations
export async function postReservation(req, res) {
  const parsed = parseSchema(createReservationSchema, req.body)
  if (!parsed.success) {
    return sendError(res, 'Validation failed', 400, parsed.errors)
  }

  try {
    const reservation = await createReservation(parsed.data)
    sendSuccess(res, reservation, 'Reservation confirmed', 201)
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500)
  }
}

// GET /api/reservations?date=YYYY-MM-DD&view=day|week
export async function getReservations(req, res) {
  const parsed = parseSchema(listReservationsSchema, req.query)
  if (!parsed.success) {
    return sendError(res, 'Invalid query parameters', 400, parsed.errors)
  }

  try {
    const reservations = await listReservations(parsed.data)
    sendSuccess(
      res,
      reservations,
      `${reservations.length} reservation${reservations.length !== 1 ? 's' : ''} found`
    )
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500)
  }
}

// PATCH /api/reservations/:id/cancel
export async function patchCancelReservation(req, res) {
  const { id } = req.params

  if (!id || id.length !== 24) {
    return sendError(res, 'Invalid reservation ID', 400)
  }

  try {
    const reservation = await cancelReservation(id)
    sendSuccess(res, reservation, 'Reservation cancelled successfully')
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500)
  }
}
