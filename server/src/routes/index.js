import { Router } from 'express'
import healthRouter       from './health.routes.js'
import tableRouter        from './table.routes.js'
import availabilityRouter from './availability.routes.js'
import reservationRouter  from './reservation.routes.js'

// Future routers registered here as they are built:
// import adminRouter from './admin.routes.js'

const router = Router()

router.use('/health',       healthRouter)
router.use('/tables',       tableRouter)
router.use('/availability', availabilityRouter)
router.use('/reservations', reservationRouter)
// router.use('/admin',     adminRouter)

export default router
