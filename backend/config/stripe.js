// config/stripe.js
import Stripe from 'stripe';

// Stripe configuration
const config = {
  // Added comment to remind about moving to .env
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51Qjh2QAo9otVE0iMVDhH43JhXiWLjz4fHD1EbAkkccnw0OObDymX92FxnojyB79LlcWEgVJRYGv2Qz2Kr87WFNMt00WNrDetDE',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_edf4e79bb58330085a6aefab4154850f9ead6ef724a21e78f3cae338488b58c8',
  currency: 'sek',
  shipping: {
    cost: 49,  // Default shipping cost
  }
};

// Initialize Stripe
export const stripe = new Stripe(config.secretKey);

// Export config for use in other files
export const stripeConfig = config;