import { Router } from 'express'
import { getAllTables, toggleOutOfService } from '../controllers/tableController.js'

const router = Router()

// GET   /api/tables                       — list all tables
router.get('/',                    getAllTables)

// PATCH /api/tables/:id/out-of-service   — toggle out-of-service flag
router.patch('/:id/out-of-service', toggleOutOfService)

export default router
