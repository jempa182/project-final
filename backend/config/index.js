// config/index.js

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
};

// Export all configurations from a single file
export * from './database.js';
export * from './stripe.js';
export * from './jwt.js';