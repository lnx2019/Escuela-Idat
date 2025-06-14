import React from 'react';

const ProfileCard = ({ nombre, descripcion }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h2>{nombre}</h2>
      <p>{descripcion}</p>
    </div>
  );
};

export default ProfileCard;
