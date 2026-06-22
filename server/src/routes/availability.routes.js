import { Router } from 'express'
import { getAvailability } from '../controllers/availabilityController.js'

const router = Router()

// GET /api/availability?date=YYYY-MM-DD&partySize=4
router.get('/', getAvailability)

export default router
