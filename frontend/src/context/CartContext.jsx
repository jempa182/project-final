// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Main cart state - stores array of items with quantities
  const [cart, setCart] = useState([]);

  // Add item to cart - handles new items and quantity
  const addToCart = (print) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(item => item._id === print._id);
      if (existingItem) {
        // If exists, increase quantity by 1
        return prevCart.map(item =>
          item._id === print._id 
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      // If new item, add with quantity 1
      return [...prevCart, { ...print, quantity: 1 }];
    });
  };

  // Remove item completely from cart
  const removeFromCart = (printId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== printId));
  };

  // Update quantity of existing item
  const updateQuantity = (printId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item._id === printId 
          ? {...item, quantity: newQuantity}
          : item
      )
    );
  };

  // Provide cart functionality to all child components
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      // Calculate total items in cart for display in header
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy cart access
export const useCart = () => useContext(CartContext);