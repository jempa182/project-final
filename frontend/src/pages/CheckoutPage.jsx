// src/pages/CheckoutPage.jsx

// --- Required Imports ---
import React, { useState, useEffect } from 'react';

// Stripe-related imports for payment processing
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,         // Wrapper component for Stripe elements
  PaymentElement,   // Pre-built Stripe payment form
  useStripe,        // Hook to access Stripe functions
  useElements       // Hook to access Stripe form elements
} from '@stripe/react-stripe-js';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';      // For user authentication state
import { useCart } from '../context/CartContext';      // For shopping cart state

// Initialize Stripe with error handling and fallback
let stripePromise;
try {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  console.log("Raw key value:", key); // Debug the raw value
  
  // Remove any quotes that might be in the key
  const cleanKey = key ? key.replace(/^"|"$/g, '') : null;
  console.log("Clean key available:", Boolean(cleanKey));
  
  if (!cleanKey) {
    console.error("Stripe publishable key is missing!");
    // Fallback for testing only - REMOVE THIS IN PRODUCTION
    const fallbackKey = 'pk_test_51Qjh2QAo9otVE0iMYYmsBgqHaszpuX55rP0dZogLIIGirGc75LOYT3DVx1v65qB6BCS576mJDzpL1csAsCK9DT4b00I4V8s9T3';
    console.log("Using fallback key for testing");
    stripePromise = loadStripe(fallbackKey);
  } else {
    console.log("Initializing Stripe with key:", cleanKey.substring(0, 8) + "...");
    stripePromise = loadStripe(cleanKey);
  }
} catch (error) {
  console.error("Error initializing Stripe:", error);
}
// Check if initialization was successful
console.log("Stripe initialized:", Boolean(stripePromise));

// --- Payment Form Component ---
// Separate component that handles Stripe payment form and submission
const PaymentForm = () => {
  // Initialize Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // Local state for payment processing
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Add debugging logs for Stripe readiness
  useEffect(() => {
    console.log("Stripe available:", Boolean(stripe));
    console.log("Elements available:", Boolean(elements));
  }, [stripe, elements]);

  // Handle payment form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Payment form submitted"); // Add this logging
    
    if (!stripe || !elements) {
      console.error("Stripe or Elements not available"); // Add this logging
      return;
    }

    setProcessing(true);
    setError(null);
    console.log("Processing payment..."); // Add this logging

    try { // Add try/catch block
      // Step 1: Submit the form data to Stripe
      console.log("Submitting form data to Stripe"); // Add this logging
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Form submission error:", submitError); // Add this logging
        setError(submitError.message);
        setProcessing(false);
        return;
      }
      console.log("Form data submitted successfully"); // Add this logging

      // Step 2: Confirm the payment and handle redirect
      console.log("Confirming payment"); // Add this logging
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect to order confirmation page after successful payment
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required', // Add this option
      });
      
      console.log("Payment result:", result); // Add this logging

      if (result.error) {
        console.error("Payment error:", result.error);
        setError(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded! Redirecting to confirmation page...");
        // Try multiple approaches to ensure navigation works
        setProcessing(false); // First, stop the processing state
        
        // Method 1: Use navigate function
        navigate('/order-confirmation');
        
        // Method 2: Direct window location as fallback
        setTimeout(() => {
          console.log("Fallback navigation triggered");
          window.location.href = `${window.location.origin}/order-confirmation`;
        }, 1000);
      }
    } catch (err) {
      console.error("Unexpected error during payment:", err); // Add this logging
      setError("An unexpected error occurred. Please try again.");
    }

    setProcessing(false);
  };

  // Render the Stripe payment form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-black text-white py-3 rounded ${
          processing ? 'opacity-50' : 'hover:bg-gray-800'
        }`}
        onClick={() => console.log("Pay Now button clicked")} // Add this logging
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// --- Main CheckoutPage Component ---
const CheckoutPage = () => {
  // --- State Management ---
  // Control the multi-step checkout process
  const [step, setStep] = useState('initial');         // Track current checkout step
  const [email, setEmail] = useState('');             // Store email for guest checkout
  // Comprehensive shipping information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    zipCode: '',
    city: '',
    country: '',
    phone: ''
  });
  
  // Store Stripe payment intent client secret
  const [clientSecret, setClientSecret] = useState('');
  
  // Get user and cart data from context
  const { user } = useUser();
  const { cart } = useCart();
  const navigate = useNavigate();
  // Track if we should show login option for existing users
  const [showLoginChoice, setShowLoginChoice] = useState(false);

  // --- Auto-fill Effect ---
  // Pre-fill shipping info for logged-in users
  useEffect(() => {
    if (user) {
      setStep('shipping');  // Skip email step for logged-in users
      if (user.firstName) {
        setShippingInfo(prevInfo => ({
          ...prevInfo,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        }));
      }
    }
  }, [user]);

  // --- Calculate Order Totals ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 49;  // Fixed shipping cost
  const total = subtotal + shipping;

  // --- Form Handlers ---
  // Handle email form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if email exists in system
      const response = await fetch(`https://jenny-a-artwork.onrender.com/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.exists) {
        setShowLoginChoice(true);  // Show login option for existing users
      } else {
        setStep('shipping');       // Proceed to shipping for new users
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // Handle shipping form submission
  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine which endpoint to use based on authentication status
      const endpoint = user 
        ? 'https://jenny-a-artwork.onrender.com/orders/create-payment-intent'
        : 'https://jenny-a-artwork.onrender.com/orders/create-guest-payment-intent';
      
      // Set up headers, only include Authorization if user is logged in
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      
      // Create payment intent on backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart,
          shippingAddress: {
            ...shippingInfo,
            email: email || shippingInfo.email, // Include email for guest orders
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);  // Store client secret for Stripe
        setStep('payment');                  // Move to payment step
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  // --- UI Checkout Page ---
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main checkout form section */}
        <div className="md:col-span-2">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <h1 className="text-2xl">Checkout</h1>
            {step !== 'initial' && (
              <button 
                onClick={() => {
                  setStep('initial');
                  setShowLoginChoice(false);
                }}
                className="ml-4 text-sm text-gray-500 hover:text-black"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Step 1: Email/Guest Choice */}
          {step === 'initial' && (
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-xl mb-6">How would you like to check out?</h2>
              
              {/* Email form section */}
              <div className="mb-8">
                <h3 className="text-lg mb-4">Sign in or enter email</h3>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                  >
                    Continue with email
                  </button>
                </form>
              </div>

              {/* Guest checkout option */}
              <div className="pt-6 border-t">
                <h3 className="text-lg mb-4">Guest Checkout</h3>
                <button
                  onClick={() => setStep('shipping')}
                  className="w-full bg-white text-black border border-black py-2 rounded hover:bg-gray-50"
                >
                  Continue as guest
                </button>
              </div>
            </div>
          )}

          {/* Login choice popup for existing users */}
          {showLoginChoice && (
            <div className="bg-white p-6 border rounded-lg mt-4">
              <p className="mb-4">This email is already registered with us.</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login', { 
                    state: { 
                      checkout: true, 
                      email: email 
                    }
                  })}
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Login to Continue
                </button>
                <button
                  onClick={() => setStep('shipping')}
                  className="w-full bg-white text-black border border-black py-2 rounded hover:bg-gray-50"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Information Form */}
          {step === 'shipping' && (
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-xl mb-4">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Email field for guest users */}
                {!user && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                )}

                {/* Address field */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({
                      ...shippingInfo,
                      street: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* ZIP and City fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({
                        ...shippingInfo,
                        city: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Country field */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({
                      ...shippingInfo,
                      country: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Phone field */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({
                      ...shippingInfo,
                      phone: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

        {/* Step 3: Stripe Payment Form */}
        {step === 'payment' && clientSecret && stripePromise && (
          <div className="bg-white p-6 border rounded-lg">
            <h2 className="text-xl mb-4">Payment Information</h2>
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#000000',
                  },
                },
              }}
            >
              <PaymentForm />
            </Elements>
          </div>
        )}
        {step === 'payment' && (!stripePromise || !clientSecret) && (
          <div className="bg-white p-6 border rounded-lg">
            <h2 className="text-xl mb-4">Payment Information</h2>
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
              <p>Unable to initialize payment form. Please try again later.</p>
              <p className="mt-2 text-sm">
                {!stripePromise && "Stripe could not be initialized."}
                {!clientSecret && "Payment intent could not be created."}
              </p>
            </div>
          </div>
        )}
        </div>

        {/* Order Summary Sidebar - Always visible */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl mb-4">Order Summary</h2>
          
          {/* Cart Items List */}
          <div className="space-y-4 mb-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p>{item.price * item.quantity} kr</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping} kr</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>{total} kr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;