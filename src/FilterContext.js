// src/FilterContext.js
import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState('todos');
  const [contractedProducts, setContractedProducts] = useState([]);

  return (
    <FilterContext.Provider value={{ filter, setFilter, contractedProducts, setContractedProducts }}>
      {children}
    </FilterContext.Provider>
  );
};
