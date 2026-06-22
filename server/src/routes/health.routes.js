import { Router } from 'express'
import { apiHealth } from '../controllers/healthController.js'

const router = Router()

router.get('/', apiHealth)

export default router
