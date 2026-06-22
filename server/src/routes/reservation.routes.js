import { Router } from 'express'
import {
  postReservation,
  getReservations,
  patchCancelReservation,
} from '../controllers/reservationController.js'

const router = Router()

// POST   /api/reservations          — create a new reservation
router.post('/',                postReservation)

// GET    /api/reservations          — list reservations (optionally filtered by date/view)
router.get('/',                 getReservations)

// PATCH  /api/reservations/:id/cancel — cancel a reservation
router.patch('/:id/cancel',     patchCancelReservation)

export default router
