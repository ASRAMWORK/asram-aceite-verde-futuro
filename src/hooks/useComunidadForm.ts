
import { useState } from 'react';
import { useComunidades } from '@/hooks/useComunidades';
import { toast } from 'sonner';
import type { ComunidadVecinos } from '@/types';

export const useComunidadForm = () => {
  const { addComunidad, loading } = useComunidades();
  
  const handleSubmit = async (data: ComunidadVecinos) => {
    // Convert string to number for numViviendas
    const numViviendas = typeof data.numViviendas === 'string' 
      ? parseInt(data.numViviendas) 
      : data.numViviendas;
      
    try {
      await addComunidad({
        ...data,
        numViviendas: numViviendas, // Use the converted number
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success('Comunidad creada correctamente');
      return true;
    } catch (error) {
      console.error('Error al crear la comunidad', error);
      toast.error('Error al crear la comunidad');
      return false;
    }
  };

  return {
    handleSubmit,
    loading
  };
};
