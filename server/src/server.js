import './config/env.js'
import app from './app.js'
import { config } from './config/env.js'
import { connectDB } from './config/db.js'

const PORT = config.port
const line = '─'.repeat(45)

await connectDB()

app.listen(PORT, () => {
  console.log(`\n${line}`)
  console.log('  Shiraz Afghan Restaurant — Server Started')
  console.log(`${line}`)
  console.log(`  Mode     : ${config.nodeEnv}`)
  console.log(`  Port     : ${PORT}`)
  console.log(`  Database : Connected & ready`)
  console.log(`  CORS     : ${config.clientUrl}`)
  console.log(`${line}`)
  console.log(`  Root     : http://localhost:${PORT}/`)
  console.log(`  API      : http://localhost:${PORT}/api/health`)
  console.log(`${line}\n`)
})
