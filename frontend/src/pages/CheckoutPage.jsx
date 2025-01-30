// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

// --- NEW STRIPE INITIALIZATION ---
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- NEW PAYMENT FORM COMPONENT ---
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (paymentError) {
      setError(paymentError.message);
    }
    setProcessing(false);
  };

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
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main CheckoutPage Component
const CheckoutPage = () => {
  const [step, setStep] = useState('initial');
  const [email, setEmail] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    zipCode: '',
    city: '',
    country: '',
    phone: ''
  });
  
  const [clientSecret, setClientSecret] = useState('');
  
  const { user } = useUser();  // Make sure this line exists
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showLoginChoice, setShowLoginChoice] = useState(false);

  // Add this useEffect right after your state declarations
  useEffect(() => {
    if (user) {
      setStep('shipping');
      // Optionally pre-fill shipping info if you have user's details
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 49;
  const total = subtotal + shipping;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.exists) {
        setShowLoginChoice(true);
      } else {
        setStep('shipping');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // --- UPDATED handleShippingSubmit with Stripe Integration ---
  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: shippingInfo,
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="md:col-span-2">
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

          {step === 'initial' && (
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-xl mb-6">How would you like to check out?</h2>
              
              {/* Login/Email section */}
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

              {/* Guest checkout section */}
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

          {step === 'shipping' && (
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-xl mb-4">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {/* --- NEW PAYMENT SECTION --- */}
          {step === 'payment' && clientSecret && (
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
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl mb-4">Order Summary</h2>
          
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