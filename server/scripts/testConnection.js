/**
 * One-shot script to verify MongoDB Atlas connectivity.
 * Run with:  node scripts/testConnection.js
 */
import '../src/config/env.js'
import mongoose from 'mongoose'
import { config } from '../src/config/env.js'

const line = '─'.repeat(45)

console.log(`\n${line}`)
console.log('  Shiraz Afghan Restaurant — Database Check')
console.log(`${line}`)
console.log('  Connecting to MongoDB Atlas...')
console.log(`${line}\n`)

try {
  const conn = await mongoose.connect(config.mongoUri)
  const { host, name } = conn.connection

  console.log('  ✅  Database connection successful!\n')
  console.log(`  Cluster  : ${host}`)
  console.log(`  Database : ${name}`)
  console.log(`  Status   : Connected & ready\n`)
  console.log(`${line}`)
  console.log('  Your database is live. You\'re good to go!')
  console.log(`${line}\n`)

  await mongoose.disconnect()
  process.exit(0)
} catch (err) {
  console.error('  ❌  Database connection failed!\n')
  console.error(`  Error : ${err.message}\n`)
  console.error(`${line}`)
  console.error('  Check your MONGO_URI in the .env file.')
  console.error(`${line}\n`)
  process.exit(1)
}
