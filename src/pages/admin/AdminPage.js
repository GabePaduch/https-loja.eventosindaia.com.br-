import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../../App.css'; // Corrigido o caminho para o App.css
import './admin.css'; // Corrigido o caminho para o admin.css
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const AdminPage = () => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    category: '', // Alterado para usar select
    imageName: '', // Nome da imagem
    description: '', // Adicionado campo de descrição
    environments: [], // Adicionado campo de ambientes
    active: true, // Adicionado o status de ativo
  });
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [files, setFiles] = useState([]); // Adicionado estado para os arquivos
  const [isLoading, setIsLoading] = useState(false); // Estado para controle do carregamento
  const [selectAll, setSelectAll] = useState(false); // Estado para a checkbox de selecionar todos
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('https://loja.eventosindaia.com.br/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files: selectedFiles } = e.target;
    if (name === 'environments' && type === 'checkbox') {
      setProduct((prevProduct) => ({
        ...prevProduct,
        environments: checked 
          ? [...prevProduct.environments, value] 
          : prevProduct.environments.filter(env => env !== value),
      }));
    } else if (name === 'files') {
      setFiles(selectedFiles); // Armazena os arquivos selecionados
    } else {
      let newValue = value;
      if (name === 'id') {
        newValue = newValue.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: newValue,
      }));
    }
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        environments: [
          "Mezanino (Itapema)", 
          "Espaço Panorâmico (Itapema)", 
          "Salão de Eventos (Itapema)", 
          "Lounge (Itapema)",
          "Canto da Lagoa (Florianópolis)",
          "Mirante da Lagoa (Florianópolis)",
          "Espaço Joinville (Joinville)",
          "Castelo Blumenau (Blumenau)"
        ],
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        environments: [],
      }));
    }
  };

  const validateImageName = (name) => {
    const nameWithoutExtension = name.split('.').slice(0, -1).join('.');
    const invalidChars = /[^0-9]/; // Define caracteres inválidos (apenas números são válidos)
    return !invalidChars.test(nameWithoutExtension);
  };

  const validateFileNames = (files) => {
    for (let i = 0; i < files.length; i++) {
      const fileNameWithoutExtension = files[i].name.split('.').slice(0, -1).join('.');
      const invalidChars = /[^0-9]/; // Define caracteres inválidos (apenas números são válidos)
      if (invalidChars.test(fileNameWithoutExtension)) {
        return false;
      }
    }
    return true;
  };

  const formatForJson = (str) => {
    return str.replace(/\s/g, '%20');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateImageName(product.imageName)) {
      setModalMessage('O nome da imagem principal deve conter apenas números (excluindo a extensão).');
      setModalIsOpen(true);
      return;
    }

    if (!validateFileNames(files)) {
      setModalMessage('Os nomes dos arquivos de imagem devem conter apenas números (excluindo a extensão).');
      setModalIsOpen(true);
      return;
    }

    setIsLoading(true); // Inicia o estado de carregamento

    const formattedImageName = formatForJson(product.imageName);
    const formattedProductName = formatForJson(product.name);

    const newProduct = {
      ...product,
      imageName: formattedImageName,
      image: `https://loja.eventosindaia.com.br/static/images/${formattedProductName}/${formattedImageName}`,
      environments: product.environments.join(', '),
    };

    if (files.length > 0) {
      // Enviar os arquivos primeiro
      const formData = new FormData();
      formData.append('folder', product.name); // Usa o nome do produto como nome da pasta
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      axios.post('https://89.116.74.66:5001/upload-folder', formData)
        .then(uploadResponse => {
          // Depois de enviar os arquivos, envia o produto
          axios.post('https://89.116.74.66:5000/api/products', newProduct)
            .then(response => {
              setModalMessage('Produto e arquivos cadastrados com sucesso!');
              setModalIsOpen(true);
              setProduct({ id: '', name: '', category: '', imageName: '', description: '', environments: [], active: true });
              setFiles([]);
              fetchProducts();
            })
            .catch(error => {
              setModalMessage('Erro ao cadastrar produto: ' + error.message);
              setModalIsOpen(true);
              console.error('Erro ao cadastrar produto:', error);
            })
            .finally(() => setIsLoading(false)); // Finaliza o estado de carregamento
        })
        .catch(uploadError => {
          setModalMessage('Erro ao enviar arquivos: ' + uploadError.message);
          setModalIsOpen(true);
          console.error('Erro ao enviar arquivos:', uploadError);
          setIsLoading(false); // Finaliza o estado de carregamento
        });
    } else {
      // Se não houver arquivos, apenas envia o produto
      axios.post('https://89.116.74.66:5000/api/products', newProduct)
        .then(response => {
          setModalMessage('Produto cadastrado com sucesso!');
          setModalIsOpen(true);
          setProduct({ id: '', name: '', category: '', imageName: '', description: '', environments: [], active: true });
          fetchProducts();
        })
        .catch(error => {
          setModalMessage('Erro ao cadastrar produto: ' + error.message);
          setModalIsOpen(true);
          console.error('Erro ao cadastrar produto:', error);
        })
        .finally(() => setIsLoading(false)); // Finaliza o estado de carregamento
    }
  };

  const handleDelete = (id) => {
    axios.delete(`https://loja.eventosindaia.com.br/api/products/${id}`)
      .then(response => {
        alert('Produto deletado com sucesso!');
        fetchProducts();
      })
      .catch(error => {
        console.error('Erro ao deletar produto:', error);
      });
  };

  const handleInactivate = (id) => {
    const productToUpdate = products.find(product => product.id === id);
    const updatedProduct = { ...productToUpdate, active: !productToUpdate.active };

    axios.put(`https://loja.eventosindaia.com.br/api/products/${id}`, updatedProduct)
      .then(response => {
        alert(`Produto ${updatedProduct.active ? 'ativado' : 'inativado'} com sucesso!`);
        fetchProducts();
      })
      .catch(error => {
        console.error('Erro ao inativar produto:', error);
      });
  };

  const handleViewDetails = (id) => {
    navigate(`/products/${id}`);
  };

  const handleLogin = () => {
    const username = prompt('Login:');
    const password = prompt('Senha:');
    
    const validUsers = [
      { username: 'gabriel.paduch', password: 'Indaia@2024' },
      { username: 'willian.indaia', password: 'Indaia@321' },
      { username: 'aline.indaia', password: 'Indaia@123' },
      { username: 'arles.robalo', password: 'Indaia@2024' }
    ];

    const isValidUser = validUsers.some(user => user.username === username && user.password === password);

    if (isValidUser) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Login ou senha incorretos!');
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      handleLogin();
    }
  }, []);

  if (!isAuthenticated) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Cadastro de Produtos</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" name="id" value={product.id} onChange={handleChange} required />
        </label>
        <label>
          Nome:
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </label>
        <label>
          Categoria:
          <select name="category" value={product.category} onChange={handleChange} required>
            <option value="">Selecione uma categoria</option>
            <option value="cardápio">Cardápio</option>
            <option value="serviços">Serviços</option>
            <option value="cerimonias">Cerimônias</option>
            <option value="decoração">Decoração</option>
            <option value="iluminação">Iluminação</option>
            <option value="contratados">Contratados</option>
          </select>
        </label>
        <label>
          Nome da Imagem Principal (com extensão):
          <input type="text" name="imageName" value={product.imageName} onChange={handleChange} required />
        </label>
        <label>
          Arquivos de Imagem:
          <input type="file" name="files" onChange={handleChange} multiple required />
        </label>
        <label>
          Descrição:
          <textarea name="description" value={product.description} onChange={handleChange} required />
        </label>
        <label>
          Ambientes:
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
              Selecionar Todos
            </label>
            <label>
              <input type="checkbox" name="environments" value="Mezanino (Itapema)" checked={product.environments.includes("Mezanino (Itapema)")} onChange={handleChange} />
              Mezanino (Itapema)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Espaço Panorâmico (Itapema)" checked={product.environments.includes("Espaço Panorâmico (Itapema)")} onChange={handleChange} />
              Espaço Panorâmico (Itapema)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Salão de Eventos (Itapema)" checked={product.environments.includes("Salão de Eventos (Itapema)")} onChange={handleChange} />
              Salão de Eventos (Itapema)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Lounge (Itapema)" checked={product.environments.includes("Lounge (Itapema)")} onChange={handleChange} />
              Lounge (Itapema)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Canto da Lagoa (Florianópolis)" checked={product.environments.includes("Canto da Lagoa (Florianópolis)")} onChange={handleChange} />
              Canto da Lagoa (Florianópolis)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Mirante da Lagoa (Florianópolis)" checked={product.environments.includes("Mirante da Lagoa (Florianópolis)")} onChange={handleChange} />
              Mirante da Lagoa (Florianópolis)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Espaço Joinville (Joinville)" checked={product.environments.includes("Espaço Joinville (Joinville)")} onChange={handleChange} />
              Espaço Joinville (Joinville)
            </label>
            <label>
              <input type="checkbox" name="environments" value="Castelo Blumenau (Blumenau)" checked={product.environments.includes("Castelo Blumenau (Blumenau)")} onChange={handleChange} />
              Castelo Blumenau (Blumenau)
            </label>
          </div>
        </label>
        <button type="submit">Cadastrar Produto</button>
      </form>

      {isLoading && (
        <div className="admin-loading-overlay">
          <div className="admin-loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      )}

      <h2>Produtos Cadastrados</h2>
      <ul className="admin-product-list">
        {products.map((product) => (
          <li key={product.id} className="admin-product-item">
            <img src={product.image} alt={product.name} className="admin-product-image" />
            <div className="admin-product-details">
              <span><strong>Nome:</strong> {product.name}</span>
              <span><strong>Categoria:</strong> {product.category}</span>
              <span><strong>Status:</strong> {product.active ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div className="admin-product-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(product.id)}>Excluir</button>
              <button className="admin-inactivate-btn" onClick={() => handleInactivate(product.id)}>
                {product.active ? 'Inativar' : 'Ativar'}
              </button>
              <button className="admin-view-btn" onClick={() => handleViewDetails(product.id)}>Ver Detalhes</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Retorno do Servidor"
        className="admin-modal"
        overlayClassName="admin-overlay"
      >
        <h2>Mensagem do Servidor</h2>
        <p>{modalMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Fechar</button>
      </Modal>
    </div>
  );
};

export default AdminPage;
