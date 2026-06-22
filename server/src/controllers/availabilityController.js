import { generateTimeSlots } from '../services/bookingService.js'
import { availabilitySchema, parseSchema } from '../validators/bookingValidator.js'
import { sendSuccess, sendError } from '../utils/response.js'

export async function getAvailability(req, res) {
  // Validate query params
  const parsed = parseSchema(availabilitySchema, req.query)
  if (!parsed.success) {
    return sendError(res, 'Invalid request parameters', 400, parsed.errors)
  }

  const { date, partySize } = parsed.data

  try {
    const slots = await generateTimeSlots(date, partySize)

    sendSuccess(res, { date, partySize, slots }, `${slots.length} slot${slots.length !== 1 ? 's' : ''} available`)
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500)
  }
}
