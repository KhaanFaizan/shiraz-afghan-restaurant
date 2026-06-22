import { Router } from 'express'
import { getAllTables } from '../controllers/tableController.js'

const router = Router()

router.get('/', getAllTables)

export default router
