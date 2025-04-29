
import React from 'react';
import RecogidasList from './RecogidasList';
import { Recogida } from '@/types';

// Fix for line 655 in GestionRecogidas.tsx
const GestionRecogidas = () => {
  // Mock data for the example
  const searchFilteredRecogidas: Recogida[] = [
    {
      id: '1',
      cliente: 'Cliente ejemplo',
      fechaRecogida: new Date(),
      direccionRecogida: 'Calle Ejemplo 123',
      estadoRecogida: 'pendiente',
      completada: false,
      horaRecogida: '10:00',
      cantidadAproximada: 5,
      tipoAceite: 'vegetal',
      nombreContacto: 'Contacto Ejemplo',
      telefonoContacto: '123456789',
      emailContacto: 'ejemplo@mail.com',
      notasAdicionales: '',
      litrosRecogidos: 0,
      direccion: 'Calle Ejemplo 123',
      distrito: 'Centro',
      barrio: 'Sol',
      horaInicio: '10:00',
      hora: '10:00',
      estado: 'pendiente',
      clienteId: '1',
      rutaId: '',
      esRecogidaZona: false,
      fecha: new Date()
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
