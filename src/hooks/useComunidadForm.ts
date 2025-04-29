
import { useState } from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { toast } from 'sonner';
import type { ComunidadVecinos } from '@/types';

export const useComunidadForm = () => {
  const { addComunidad, loading } = useComunidadesVecinos();
  const [formData, setFormData] = useState<Partial<ComunidadVecinos>>({
    nombre: '',
    cif: '',
    direccion: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    numViviendas: 0,
    distrito: '',
    barrio: '',
    numeroPorteria: 0,
    totalViviendas: 0,
    numContenedores: 0,  // Added default for numContenedores
    nombreAdministracion: '',
    correoContacto: '',
    telefono: '',
    email: '',
    administradorId: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numViviendas' || name === 'numeroPorteria' || name === 'totalViviendas' || name === 'numContenedores'
        ? parseInt(value) || 0 
        : value
    }));
  };
  
  const handleSubmit = async (data: ComunidadVecinos) => {
    // Convert string to number for numViviendas
    const numViviendas = typeof data.numViviendas === 'string' 
      ? parseInt(data.numViviendas) 
      : data.numViviendas;
    
    const numContenedores = typeof data.numContenedores === 'string'
      ? parseInt(data.numContenedores)
      : data.numContenedores || 0;
      
    try {
      await addComunidad({
        ...data,
        numViviendas: numViviendas,
        numContenedores: numContenedores,
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
    formData,
    isLoading: loading,
    handleChange,
    handleSubmit,
    loading
  };
};
