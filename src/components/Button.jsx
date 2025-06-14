import React, { useState } from 'react';

const Button = ({ mensaje }) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + 1);
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        {mensaje}
      </button>
      <p>Has hecho clic {clicks} {clicks === 1 ? 'vez' : 'veces'}</p>
    </div>
  );
};

export default Button;
