// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (print) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === print._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === print._id 
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      return [...prevCart, { ...print, quantity: 1 }];
    });
  };

  const removeFromCart = (printId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== printId));
  };

  const updateQuantity = (printId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item._id === printId 
          ? {...item, quantity: newQuantity}
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);