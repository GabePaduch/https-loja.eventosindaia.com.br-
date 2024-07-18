// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails'; // Use ProductDetails se você precisa de componentes dinâmicos
import Cart from './pages/cart';
import AdminPage from './pages/admin/AdminPage'; // Adicionado
import { CartProvider } from './CartContext';
import { FilterProvider } from './FilterContext';
import './styles.css';

const App = () => {
  return (
    <CartProvider>
      <FilterProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:productId" element={<ProductDetails />} /> {/* Use ProductDetails */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminPage />} /> {/* Adicionado */}
          </Routes>
        </Router>
      </FilterProvider>
    </CartProvider>
  );
};

export default App;
