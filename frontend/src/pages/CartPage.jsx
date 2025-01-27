// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calculates totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 49 : 0; // Example shipping cost
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto text-center py-16">
        <h1 className="text-2xl mb-4">Your cart is empty</h1>
        <Link to="/" className="text-gray-600 hover:text-black underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-2xl mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 border">
              <img 
                src={item.mainImage}
                alt={item.name}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2>{item.name}</h2>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-500 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-gray-600">{item.price} kr</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                    className="px-2 border hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 border hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 h-fit">
          <h2 className="text-xl mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping} kr</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>{total} kr</span>
            </div>
          </div>
          <Link 
            to="/checkout"
            className="block w-full bg-black text-white py-3 hover:bg-gray-800 text-center transition-colors duration-200"
          >
            PROCEED TO CHECKOUT
          </Link>
          <Link 
            to="/" 
            className="block text-center mt-4 text-gray-600 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;