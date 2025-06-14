import React from 'react';
import ProfileCard from './components/ProfileCard';
import Button from './components/Button';
import List from './components/List';

function App() {
  const elementosIniciales = ['Elemento 1', 'Elemento 2', 'Elemento 3'];

  return (
    <div style={{ padding: '2rem' }}>
      <ProfileCard 
        nombre="Leon el Cazador de Bugs" 
        descripcion="Apasionado por React, la física y la recuperación de datos imposibles." 
      />
      
      <Button mensaje="Haz clic aquí" />

      <h3>Lista de Tareas Dinámica</h3>
      <List elementosIniciales={elementosIniciales} />
    </div>
  );
}

export default App;
