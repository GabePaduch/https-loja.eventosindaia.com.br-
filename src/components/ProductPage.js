

// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://loja.eventosindaia.com.br/api/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Erro ao buscar produto:', error));
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      {/* Renderize outras informações do produto conforme necessário */}
    </div>
  );
};

export default ProductPage;
