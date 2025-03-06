// config/stripe.js
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Stripe configuration
const config = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: 'sek',
  shipping: {
    cost: 49,  // Default shipping cost
  }
};

// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('Warning: STRIPE_WEBHOOK_SECRET not found in environment variables');
}

// Initialize Stripe
export const stripe = new Stripe(config.secretKey);

// Export config for use in other files
export const stripeConfig = config;