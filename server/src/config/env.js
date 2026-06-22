import 'dotenv/config'

export const config = {
  port:      process.env.PORT      || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv:   process.env.NODE_ENV  || 'development',

  // Placeholders — populated once MongoDB is configured
  mongoUri:  process.env.MONGO_URI  || '',
  jwtSecret: process.env.JWT_SECRET || '',
}
