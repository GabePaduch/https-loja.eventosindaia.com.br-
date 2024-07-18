// src/components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [ProductComponent, setProductComponent] = useState(null);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carregar o componente específico do produto
    import(`../pages/products/${productId}.js`)
      .then(module => setProductComponent(() => module.default))
      .catch(error => {
        console.error(`Erro ao carregar o componente para ${productId}:`, error);
        setError('Erro ao carregar o componente do produto.');
      });

    // Carregar os dados do produto
    axios.get(`https://loja.eventosindaia.com.br/api/products/${productId}`)
      .then(response => {
        if (response.data.active) {
          setProductData(response.data);
        } else {
          console.error('Produto inativo');
          setError('Produto inativo.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do produto:', error);
        setError('Erro ao buscar detalhes do produto.');
      });
  }, [productId]);

  if (error) return <div>{error}</div>;
  if (!ProductComponent || !productData) return <div>Loading...</div>;

  return (
    <div className="p-5">
      <ProductComponent productData={productData} />
    </div>
  );
};

export default ProductDetails;
