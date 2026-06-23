/**
 * Vercel Serverless Entry Point
 *
 * This file is used ONLY in production (Vercel deployment).
 * For local development, src/server.js is used instead.
 *
 * Two problems this file solves compared to src/server.js:
 *
 *   1. Vercel serverless functions must export a handler — they cannot call
 *      app.listen(). The Express `app` itself is a valid handler.
 *
 *   2. Serverless functions are stateless per invocation but may reuse the
 *      same container ("warm start"). Calling mongoose.connect() on every
 *      request would exhaust the MongoDB Atlas connection pool quickly.
 *      We cache the connection promise so warm invocations skip reconnection.
 */

import '../src/config/env.js'
import mongoose from 'mongoose'
import app from '../src/app.js'

let connectionPromise = null

async function ensureConnected() {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState >= 1) return

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      // Do not buffer operations — fail fast if connection is not ready
      bufferCommands: false,
    })
  }

  await connectionPromise
}

export default async function handler(req, res) {
  await ensureConnected()
  return app(req, res)
}
