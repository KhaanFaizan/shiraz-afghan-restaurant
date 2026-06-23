import { z } from 'zod'

// ── Shared primitives ─────────────────────────────────────────────────────────

const dateString = z
  .string({ required_error: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

const timeString = z
  .string({ required_error: 'Time is required' })
  .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format')

// ── Availability query ────────────────────────────────────────────────────────

export const availabilitySchema = z.object({
  date:      dateString,
  partySize: z.coerce
    .number({ required_error: 'Party size is required' })
    .int('Party size must be a whole number')
    .min(1, 'Party size must be at least 1')
    .max(20, 'Party size cannot exceed 20'),
})

// ── Create reservation body ───────────────────────────────────────────────────

export const createReservationSchema = z.object({
  customerName: z
    .string({ required_error: 'Customer name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('A valid email address is required')
    .trim()
    .toLowerCase(),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Please enter a valid phone number'),

  date: dateString,
  time: timeString,

  partySize: z
    .number({ required_error: 'Party size is required' })
    .int('Party size must be a whole number')
    .min(1, 'Party size must be at least 1')
    .max(20, 'Party size cannot exceed 20'),

  specialRequest: z.string().trim().optional().default(''),
})

// ── Reservations list query ───────────────────────────────────────────────────

export const listReservationsSchema = z.object({
  date: dateString.optional(),
  view: z.enum(['day', 'week']).optional().default('day'),
})

// ── Modify reservation body ───────────────────────────────────────────────────

export const modifyReservationSchema = z.object({
  customerName:   z.string().trim().min(2).optional(),
  phone:          z.string().trim().min(7).optional(),
  specialRequest: z.string().trim().optional(),
  date:           dateString.optional(),
  time:           timeString.optional(),
  partySize:      z.number().int().min(1).max(20).optional(),
  status:         z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

// ── Helper: parse + return formatted Zod errors ──────────────────────────────

export function parseSchema(schema, data) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues.map(i => ({
      field:   i.path.join('.') || 'unknown',
      message: i.message,
    }))
    return { success: false, errors }
  }
  return { success: true, data: result.data }
}
