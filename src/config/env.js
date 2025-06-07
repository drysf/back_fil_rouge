// src/config/env.js
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/playgreenkids',
  JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt_super_securise',
  PORT: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development'
};