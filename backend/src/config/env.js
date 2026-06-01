require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'taskflow_local_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || '*',
};

if (!env.mongoUri) {
  throw new Error('MONGO_URI is missing. Copy .env.example to .env and update it.');
}

module.exports = env;
