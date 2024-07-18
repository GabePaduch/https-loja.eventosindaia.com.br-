// src/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const productWithId = { ...product, cartItemId: Date.now() };
    setCartItems((prevItems) => [...prevItems, productWithId]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
