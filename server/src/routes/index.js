import { Router } from 'express'
import healthRouter from './health.routes.js'

// Future routers imported here as they are created:
// import bookingRouter from './booking.routes.js'
// import adminRouter   from './admin.routes.js'

const router = Router()

router.use('/health',  healthRouter)
// router.use('/bookings', bookingRouter)
// router.use('/admin',    adminRouter)

export default router
