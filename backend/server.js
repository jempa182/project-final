// server.js
import express from "express";
import cors from "cors";
import { Order } from './models/Order.js';

// Import routes
import authRoutes from './routes/auth.js';
import printRoutes from './routes/prints.js';
import orderRoutes from './routes/orders.js';
import favoriteRoutes from './routes/favorites.js';
import userRoutes from './routes/users.js';

// Import configurations
import { 
  serverConfig,
  stripe, 
  stripeConfig,
  connectToDatabase
} from './config/index.js';

const app = express();
const { port } = serverConfig;

// Stripe webhook handler - needs raw body, so must be before express.json middleware
app.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeConfig.webhookSecret
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid'
      });
    } catch (error) {
      console.error('Order Update Error:', error);
      return res.status(500).end();
    }
  }

  res.json({ received: true });
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectToDatabase();

// Mount all routes
app.use('/auth', authRoutes);
app.use('/prints', printRoutes);
app.use('/orders', orderRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/users', userRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});