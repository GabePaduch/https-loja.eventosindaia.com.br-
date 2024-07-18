// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.webp';
import cartIcon from '../images/cart-icon.png';
import headlineImage from '../images/headline.jpeg';
import { FilterContext } from '../FilterContext';
import { CartContext } from '../CartContext';

const Header = () => {
  const { setFilter } = useContext(FilterContext);
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const handleFilterClick = (category) => {
    setFilter(category);
    navigate('/');
  };

  return (
    <div>
      <header className="relative text-white flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${headlineImage})`, height: '280px' }}>
        <div className="absolute top-0 w-full h-20 bg-black bg-opacity-50"></div>
        <div className="absolute left-5 top-3">
          <img src={logo} alt="Indaia Eventos" className="w-36" />
        </div>
        <div className="font-bold absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl">Área do Cliente</h1>
        </div>
        <div className="absolute right-5 top-5 flex flex-row items-center space-x-2">
          <button className="voltar-btn bg-white bg-opacity-20 text-white border border-white py-2 px-4 hover:bg-green-600 transition duration-300">
            Voltar à Área do Cliente
          </button>
          <button className="bg-white bg-opacity-20 text-white border border-white py-2 px-4 hover:bg-green-600 transition duration-300">
            Sair
          </button>
          <Link to="/cart" className="bg-white bg-opacity-20 text-white border border-white py-2 px-4 hover:bg-green-600 transition duration-300 flex items-center">
            <img src={cartIcon} alt="Carrinho de Compras" className="w-6 mr-2" />
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 text-xs">
            {cartItems.length}
          </span>
          </Link>
        </div>
      </header>
      <section className="filter-title-container flex justify-center items-center py-4 bg-white shadow-md">
        <div className="filters-container flex flex-wrap justify-center space-x-2 sm:space-x-4">
          {['todos', 'cardápio', 'serviços', 'cerimonias', 'decoração', 'iluminação', 'contratados'].map(category => (
            <button
              key={category}
              className="filter-btn bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full my-1"
              onClick={() => handleFilterClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Header;
