import React, { useState } from 'react';

const List = ({ elementosIniciales }) => {
  const [elementos, setElementos] = useState(elementosIniciales);
  const [nuevoElemento, setNuevoElemento] = useState('');

  const agregarElemento = () => {
    if (nuevoElemento.trim() !== '') {
      setElementos([...elementos, nuevoElemento]);
      setNuevoElemento('');
    }
  };

  return (
    <div>
      <ul>
        {elementos.map((el, index) => (
          <li key={index}>{el}</li>
        ))}
      </ul>
      <input 
        type="text" 
        value={nuevoElemento} 
        onChange={(e) => setNuevoElemento(e.target.value)} 
        placeholder="Agregar nuevo elemento" 
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={agregarElemento}>Agregar</button>
    </div>
  );
};

export default List;
