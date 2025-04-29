
import React from 'react';
import RecogidasList from './RecogidasList';

// Fix for line 655 in GestionRecogidas.tsx
const GestionRecogidas = () => {
  // Mock data for the example
  const searchFilteredRecogidas = [
    {
      id: '1',
      cliente: 'Cliente ejemplo',
      fechaRecogida: new Date(),
      direccionRecogida: 'Calle Ejemplo 123',
      estadoRecogida: 'pendiente',
      completada: false
    }
  ];

  const handleCompleteRecogida = async (id: string) => {
    console.log('Recogida completada:', id);
  };

  const setSelectedRecogida = (id: string) => {
    console.log('Seleccionada recogida:', id);
  };

  return (
    <RecogidasList 
      recogidas={searchFilteredRecogidas.filter(r => !r.completada)}
      onComplete={handleCompleteRecogida}
      onViewDetails={(id) => setSelectedRecogida(id)}
    />
  );
};

export default GestionRecogidas;
