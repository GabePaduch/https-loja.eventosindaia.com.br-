
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './products.css'; // Importando o novo CSS
import MainImage from '../../images/Espaço Kids/01.jpg';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Modal from 'react-modal';
import { CartContext } from '../../CartContext'; // Importando o contexto do carrinho

Modal.setAppElement('#root');

const Kids = () => {
  const { addToCart } = useContext(CartContext); // Usando o contexto do carrinho
  const [images, setImages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const navigate = useNavigate();
  const productName = 'Espaço Kids';

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
    addToCart({ id: 'kids', name: productName, image: MainImage });
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
            <p>O Espaço Kids foi criado, pensando na comodidade e tranquilidade que esse tipo de ambiente proporciona tanto para os pais, quanto para os convidados, que podem relaxar e aproveitar a refeição, o papo entre os amigos e a festa, sabendo que seus filhos estarão se divertindo e em segurança! Além do espaço, que é composto por cama de elástico, piscina de bolinhas, mesa de desenho, balanços de plástico, quadro de pintura, tv para recreação, tapete de borracha, também contamos com monitores (em caso de contratação) que ficam disponíveis exclusivamente, para cuidar das crianças no espaço!</p>
            <h4>Ambientes Disponíveis:</h4>
            <ul>
              <li>Mezanino (Itapema)</li><li> Espaço Panorâmico (Itapema)</li><li> Salão de Eventos (Itapema)</li><li> Lounge (Itapema)</li><li> Canto da Lagoa (Florianópolis)</li><li> Mirante da Lagoa (Florianópolis)</li><li> Espaço Joinville (Joinville)</li><li> Castelo Blumenau (Blumenau)</li>
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

export default Kids;
