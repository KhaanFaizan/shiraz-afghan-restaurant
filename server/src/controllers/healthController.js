import { sendSuccess } from '../utils/response.js'
import { config } from '../config/env.js'

export function rootHealth(req, res) {
  sendSuccess(res, null, 'Shiraz API is running')
}

export function apiHealth(req, res) {
  sendSuccess(res, {
    status:    'healthy',
    env:       config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  }, 'API health check passed')
}
