import { Router } from 'express'
import {
  postReservation,
  getReservations,
  patchReservation,
  patchCancelReservation,
} from '../controllers/reservationController.js'

const router = Router()

// POST   /api/reservations             — create a new reservation
router.post('/',                postReservation)

// GET    /api/reservations             — list (optional ?date & ?view)
router.get('/',                 getReservations)

// PATCH  /api/reservations/:id/cancel  — cancel a reservation (must be before /:id)
router.patch('/:id/cancel',     patchCancelReservation)

// PATCH  /api/reservations/:id         — modify a reservation
router.patch('/:id',            patchReservation)

export default router
