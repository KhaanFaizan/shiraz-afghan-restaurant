import mongoose from 'mongoose'
import { config } from './env.js'

export async function connectDB() {
  if (!config.mongoUri) {
    console.error('  ❌  MONGO_URI is not set in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(config.mongoUri)
    console.log('\n  ✅  Database connection successful!')
    console.log(`  Cluster  : ${mongoose.connection.host}`)
    console.log(`  Database : ${mongoose.connection.name}`)
    console.log(`  Status   : Connected & ready`)
  } catch (err) {
    console.error('\n  ❌  Database connection failed!')
    console.error(`  Error    : ${err.message}`)
    console.error('  Check your MONGO_URI in the .env file.\n')
    process.exit(1)
  }
}
