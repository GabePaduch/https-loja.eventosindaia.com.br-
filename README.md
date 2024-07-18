# https-loja.eventosindaia.com.br

Este é um projeto completo de e-commerce desenvolvido com uma stack moderna, utilizando React.js para o frontend, Node.js e Python para o backend, e Docker para facilitar a implantação e a execução do ambiente de desenvolvimento. A aplicação permite a gestão de produtos, incluindo cadastro, edição, exclusão e visualização de detalhes, além de oferecer funcionalidades como carrinho de compras e filtro de produtos.

## Tecnologias Utilizadas

- **Frontend**: React.js
- **Backend**: Node.js e Python (Flask)
- **Banco de Dados**: Google Sheets (para pós-vendas)
- **Conteinerização**: Docker e Docker Compose
- **Serviços Adicionais**: Flask para APIs, Google Sheets API para gestão de dados

## Funcionalidades

- **Frontend**:
  - Exibição de lista de produtos com filtro por categorias
  - Visualização detalhada de produtos com galeria de imagens
  - Carrinho de compras com opção de contato via WhatsApp
  - Página de administração para gestão de produtos

- **Backend**:
  - API RESTful para gestão de produtos e imagens
  - Upload de imagens com Flask e armazenamento seguro
  - Integração com Google Sheets para gestão de pós-vendas
  - Atualização periódica de dados utilizando APScheduler

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/GabePaduch/https-loja.eventosindaia.com.br-.git
   cd https-loja.eventosindaia.com.br-

2. Instale as dependências do frontend:
   ```bash
   cd frontend
   npm install

3. Instale as dependências do backend:
   ```bash
   cd backend
   npm install
   
4. Construa e inicie os contêineres Docker:
   ```bash
   docker-compose up --build


## Estrutura do Projeto

## React.js:

App.js: Configuração das rotas e componentes principais
Home.js: Página inicial com filtros de produtos
Cart.js: Página do carrinho de compras
Opencoffee.js: Página detalhada do produto "Open Coffee"
AdminPage.js: Página de administração para cadastro e edição de produtos
CartContext.js e FilterContext.js: Contextos para gerenciamento de estado

## Python (Flask):

imageapi.py: API para gestão de imagens
images.py: API para upload de imagens
posvendas.py: API para integração com Google Sheets e atualização de dados

## Docker:

Dockerfile-python: Configuração do contêiner para o backend Python
Dockerfile-node: Configuração do contêiner para o backend Node.js
docker-compose.yml: Configuração do Docker Compose para orquestração dos contêineres
