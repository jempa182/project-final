// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  // When quantity is updated to 0, remove the item
  useEffect(() => {
    cart.forEach(item => {
      if (item.quantity === 0) {
        removeFromCart(item._id);
      }
    });
  }, [cart, removeFromCart]);

  // Filter out items with quantity 0
  const validCartItems = cart.filter(item => item.quantity > 0);
  
  // Calculates totals based on valid items only
  const subtotal = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = validCartItems.length > 0 ? 49 : 0; // No shipping if no items
  const total = subtotal + shipping;
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      // If new quantity is 0, immediately remove the item
      removeFromCart(itemId);
    } else {
      // Otherwise update quantity normally
      updateQuantity(itemId, newQuantity);
    }
  };

  if (validCartItems.length === 0) {
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
          {validCartItems.map((item) => (
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
                    onClick={() => handleQuantityChange(item._id, Math.max(0, item.quantity - 1))}
                    className="px-2 border hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
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
          {validCartItems.length > 0 ? (
            <Link 
              to="/checkout"
              className="block w-full bg-black text-white py-3 hover:bg-gray-800 text-center transition-colors duration-200"
            >
              PROCEED TO CHECKOUT
            </Link>
          ) : (
            <button 
              disabled
              className="block w-full bg-gray-400 text-white py-3 cursor-not-allowed"
            >
              CART EMPTY
            </button>
          )}
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