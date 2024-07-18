
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './products.css'; // Importando o novo CSS
import MainImage from '../../images/Love Luminoso de Madeira/01.jpg';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Modal from 'react-modal';
import { CartContext } from '../../CartContext'; // Importando o contexto do carrinho

Modal.setAppElement('#root');

const Lovemadeira = () => {
  const { addToCart } = useContext(CartContext); // Usando o contexto do carrinho
  const [images, setImages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const navigate = useNavigate();
  const productName = 'Love Luminoso de Madeira';

  useEffect(() => {
    axios.get(`https://loja.eventosindaia.com.br/api/images/${encodeURIComponent(productName)}`)
      .then(response => {
        const imageUrls = response.data.map(file => ({
          original: file,
          thumbnail: file
        }));

        console.log('Imagens carregadas:', imageUrls); // Adicione este log para verificar as imagens
        setImages(imageUrls);
        setGalleryItems(imageUrls);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, [productName]);

  const openGallery = (startIndex = 0) => {
    setGalleryItems(images);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleAddToCart = () => {
    addToCart({ id: 'lovemadeira', name: productName, image: MainImage });
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleContinueShopping = () => {
    setIsCartModalOpen(false);
    navigate('/');
  };

  const handleCheckout = () => {
    setIsCartModalOpen(false);
    navigate('/cart');
  };

  return (
    <div>
      <main>
        <section className="product-details">
          <div className="product-image-container">
            <img id="product-image" src={MainImage} alt={productName} />
          </div>
          <div id="product-description">
            <p>O letreiro Love Luminoso, é ideal para transformar qualquer ambiente, em um local super romântico! A palavra love significa amor, e garante lindos registros deste momento tão único e especial. A madeira em contraste com as lâmpadas, cria um cenário encantador e apaixonante para as fotos. Se o estilo de decoração do seu evento é rústico, ou se sua cerimônia for na praia, este letreiro vai combinar perfeitamente!</p>
            <h4>Ambientes Disponíveis:</h4>
            <ul>
              <li>Mezanino (Itapema)</li><li> Espaço Panorâmico (Itapema)</li><li> Salão de Eventos (Itapema)</li><li> Lounge (Itapema)</li>
            </ul>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Adicionar produto ao carrinho</button>
            <h4>Veja mais fotos do produto</h4>
            <div className="product-gallery">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="gallery-item" onClick={() => openGallery(index)}>
                  <img src={image.original} alt={'Foto adicional ' + (index + 1)} className="gallery-image" />
                </div>
              ))}
              {images.length > 4 && (
                <div className="gallery-item">
                  <button className="view-more-btn" onClick={() => openGallery(4)}>Ver mais</button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isGalleryOpen}
        onRequestClose={closeGallery}
        contentLabel="Galeria de Imagens"
        className="image-gallery-modal"
        overlayClassName="image-gallery-overlay"
      >
        <ImageGallery
          items={galleryItems}
          showThumbnails={true}
          showPlayButton={false}
          showFullscreenButton={false}
          startIndex={0}
        />
        <button className="close-gallery-btn" onClick={closeGallery}>Fechar</button>
      </Modal>

      <Modal
        isOpen={isCartModalOpen}
        onRequestClose={closeCartModal}
        contentLabel="Carrinho"
        className="cart-modal"
        overlayClassName="cart-overlay"
      >
        <div className="cart-modal-content">
          <h2>Produto adicionado ao carrinho</h2>
          <button className="close-cart-btn" onClick={handleContinueShopping}>Continuar comprando</button>
          <button className="close-cart-btn" onClick={handleCheckout}>Finalizar compra</button>
        </div>
      </Modal>
    </div>
  );
};

export default Lovemadeira;
