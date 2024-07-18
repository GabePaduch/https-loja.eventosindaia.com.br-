const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const https = require('https');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;
const projectRoot = '/var/www/areadocliente/my-ecommerce-app';

// Caminhos dos certificados
const privateKey = fs.readFileSync('/etc/ssl/loja.eventosindaia.com.br/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/loja.eventosindaia.com.br/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/src/images', express.static(path.join(__dirname, '../src/images')));

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const productsPath = path.join(__dirname, '../src/pages/products/products.json');
  console.log(`Adicionando novo produto: ${JSON.stringify(newProduct)}`);

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Erro ao ler o arquivo de produtos: ${err.message}`);
      return res.status(500).json({ error: 'Failed to read products file' });
    }
    const products = JSON.parse(data);
    products.push(newProduct);
    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error(`Erro ao escrever no arquivo de produtos: ${err.message}`);
        return res.status(500).json({ error: 'Failed to write products file' });
      }

      // Criar o novo arquivo de página de produto e executar o build
      const componentName = newProduct.id.charAt(0).toUpperCase() + newProduct.id.slice(1);
      const productPageContent = `
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './products.css'; // Importando o novo CSS
import MainImage from '../../images/${newProduct.name}/${newProduct.imageName}';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Modal from 'react-modal';
import { CartContext } from '../../CartContext'; // Importando o contexto do carrinho

Modal.setAppElement('#root');

const ${componentName} = () => {
  const { addToCart } = useContext(CartContext); // Usando o contexto do carrinho
  const [images, setImages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const navigate = useNavigate();
  const productName = '${newProduct.name}';

  useEffect(() => {
    axios.get(\`https://loja.eventosindaia.com.br/api/images/\${encodeURIComponent(productName)}\`)
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
    addToCart({ id: '${newProduct.id}', name: productName, image: MainImage });
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
            <p>${newProduct.description}</p>
            <h4>Ambientes Disponíveis:</h4>
            <ul>
              ${newProduct.environments.split(',').map(env => `<li>${env}</li>`).join('')}
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

export default ${componentName};
`;

      const productPagePath = path.join(__dirname, `../src/pages/products/${newProduct.id}.js`);
      fs.writeFile(productPagePath, productPageContent, (err) => {
        if (err) {
          console.error(`Erro ao criar o arquivo de página do produto: ${err.message}`);
          return res.status(500).json({ error: 'Failed to create product page' });
        }

        // Executar o build
        exec('npm run build', { cwd: projectRoot }, (err, stdout, stderr) => {
          if (err) {
            console.error(`Erro ao executar build: ${stderr}`);
            return res.status(500).json({ error: 'Erro ao executar build' });
          }
          console.log(`Resultado do build: ${stdout}`);
          res.status(201).json(newProduct);
        });
      });
    });
  });
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

