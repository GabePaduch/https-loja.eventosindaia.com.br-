import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import { FilterContext } from '../FilterContext';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
  const { filter, contractedProducts, setContractedProducts } = useContext(FilterContext);
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios.get('https://loja.eventosindaia.com.br/api/products')
      .then(response => {
        setProducts(response.data.filter(product => product.active));
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const cliente = query.get('cliente');
    if (cliente) {
      axios.get(`https://loja.eventosindaia.com.br/data`)
        .then(response => {
          const contracted = response.data.find(event => event['Cód'] === cliente);
          if (contracted) {
            const contractedItems = Object.keys(contracted).filter(key => contracted[key] === 1);
            setContractedProducts(contractedItems);
            console.log('Contratados:', contractedItems); // Log para verificação
          } else {
            console.log('Nenhum evento encontrado para o código:', cliente);
          }
        })
        .catch(error => {
          console.error('Error fetching contracted data:', error);
        });
    }
  }, [location.search, setContractedProducts]);

  const filteredProducts = filter === 'todos' 
    ? products 
    : filter === 'contratados' 
      ? products.filter(product => contractedProducts.includes(product.name)) 
      : products.filter(product => product.category === filter);

  return (
    <section className="product-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </section>
  );
};

export default ProductList;
