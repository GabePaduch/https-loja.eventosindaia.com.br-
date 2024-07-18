import React, { useContext } from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import { FilterContext } from '../FilterContext';

const Home = () => {
  const { filter, setFilter } = useContext(FilterContext);

  return (
    <div>
      <Header setFilter={setFilter} />
      <main className="p-4">
        <section className="filter-title-container flex justify-between items-center">
          <div className="filters-container flex space-x-4">
            {['todos', 'cardapio', 'servicos', 'cerimonias', 'decoracao', 'iluminacao', 'contratados'].map(category => (
              <button
                key={category}
                className="filter-btn bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="product-title">
            <h2>Banco de Produtos</h2>
            <h3 id="product-category-title">{filter.charAt(0).toUpperCase() + filter.slice(1)}</h3>
          </div>
        </section>
        <section className="product-list">
          <ProductList filter={filter} />
        </section>
      </main>
    </div>
  );
};

export default Home;
