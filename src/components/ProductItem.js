import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => (
  <div className="product-item" data-category={product.category}>
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <Link to={`/products/${product.id}`}>Veja detalhes</Link>
  </div>
);

export default ProductItem;
