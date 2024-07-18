// src/pages/cart.js
import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import './cart.css'; // Importando o novo CSS

const Cart = () => {
  const { cartItems, clearCart, removeFromCart } = useContext(CartContext);

  // Lógica para redirecionar para um link externo de finalização de compra
  /* const handleFinalizePurchase = () => {
    window.location.href = 'https://link-externo-de-finalizacao.com';
  }; */

  const handleContactSupport = () => {
    const whatsappNumber = '+5547988544227';
    const cartItemsMessage = cartItems.map(item => item.name).join(', ');
    const message = `Olá, gostaria de falar sobre os seguintes itens no meu carrinho: ${cartItemsMessage}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappLink;
  };

  return (
    <div>
      <main className="p-4">
        <section className="cart-details">
          <h2>Carrinho de Compras</h2>
          {cartItems.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    {item.name}
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.cartItemId)}>Remover</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>Esvaziar Carrinho</button>
              {/* <button className="finalize-purchase-btn" onClick={handleFinalizePurchase}>Finalizar Compra</button> */}
              <button className="contact-support-btn" onClick={handleContactSupport}>Falar com Atendente</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Cart;
