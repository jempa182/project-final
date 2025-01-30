// routes/orders.js
import express from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order.js';
import { authenticateUser } from '../middleware/auth.js';  // We'll create this middleware file next

const router = express.Router();
const stripe = new Stripe('sk_test_51Qjh2QAo9otVE0iMVDhH43JhXiWLjz4fHD1EbAkkccnw0OObDymX92FxnojyB79LlcWEgVJRYGv2Qz2Kr87WFNMt00WNrDetDE');

// POST /orders/create-payment - Create payment intent and order
router.post("/create-payment-intent", authenticateUser, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total with shipping
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 49;
    const finalAmount = totalAmount + shippingCost;

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        print: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalAmount: finalAmount,
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount * 100,
      currency: 'sek',
      metadata: {
        orderId: order._id.toString()
      }
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /orders - Get user's orders
router.get("/", authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.print')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /orders/:orderId - Get specific order
router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    }).populate('items.print');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;