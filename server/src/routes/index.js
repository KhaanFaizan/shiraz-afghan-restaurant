import { Router } from 'express'
import healthRouter from './health.routes.js'
import tableRouter  from './table.routes.js'

// Future routers registered here as they are built:
// import bookingRouter from './booking.routes.js'
// import adminRouter   from './admin.routes.js'

const router = Router()

router.use('/health',  healthRouter)
router.use('/tables',  tableRouter)
// router.use('/bookings', bookingRouter)
// router.use('/admin',    adminRouter)

export default router
