// src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Component that handles the confirmation logic
const OrderConfirmationContent = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [order, setOrder] = useState(null);
  const stripe = useStripe();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      navigate('/');
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setStatus('success');
          clearCart();
          break;
        case "processing":
          setStatus('processing');
          break;
        case "requires_payment_method":
          setStatus('failed');
          break;
        default:
          setStatus('failed');
          break;
      }

      if (paymentIntent.status === "succeeded") {
        fetchOrder(paymentIntent.metadata.orderId);
      }
    });
  }, [stripe, searchParams, navigate, clearCart]);

  const fetchOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = token 
        ? `https://jenny-a-artwork.onrender.com/orders/${orderId}`
        : `https://jenny-a-artwork.onrender.com/orders/guest/${orderId}`;
      
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(endpoint, { headers });
      
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  if (status === 'processing') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl mb-4">Processing your payment...</h1>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            There was an issue processing your payment. Please try again.
          </p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600">
          We'll send you an email confirmation shortly.
        </p>
      </div>

      {order && (
        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-xl mb-6">Order Details</h2>
          
          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.print.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p>{item.price * item.quantity} kr</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{order.totalAmount - 49} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>49 kr</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>{order.totalAmount} kr</span>
            </div>
          </div>

          <div className="border-t mt-8 pt-6">
            <h3 className="font-medium mb-4">Shipping Address</h3>
            <div className="text-gray-600">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.zipCode} {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper component that provides Stripe Elements context
const OrderConfirmationPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <OrderConfirmationContent />
    </Elements>
  );
};

export default OrderConfirmationPage;