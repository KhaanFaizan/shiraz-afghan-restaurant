import './config/env.js'   // load .env before anything else
import app from './app.js'
import { config } from './config/env.js'
import { logger } from './utils/logger.js'

const PORT = config.port

app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`)
  logger.info(`Root health:  http://localhost:${PORT}/`)
  logger.info(`API health:   http://localhost:${PORT}/api/health`)
  logger.info(`CORS origin:  ${config.clientUrl}`)
})
