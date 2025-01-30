// config/jwt.js

// JWT configuration
const config = {
  // Added comment to remind about moving to .env
  secretKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
  options: {
    expiresIn: '24h'
  }
};

export const jwtConfig = config;