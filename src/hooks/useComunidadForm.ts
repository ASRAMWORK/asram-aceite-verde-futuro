
import { useState } from 'react';
import { ComunidadVecinos } from '@/types';
import { useComunidadesVecinos } from './useComunidadesVecinos';

export const useComunidadForm = () => {
  const { createComunidad, isLoading } = useComunidadesVecinos();
  const [formData, setFormData] = useState<ComunidadVecinos>({
    nombre: '',
    direccion: '',
    cif: '',
    codigoPostal: '',
    ciudad: '',
    distrito: '',
    barrio: '',
    numViviendas: 0,
    totalViviendas: 0,
    numeroPorteria: '',
    nombreAdministracion: '',
    correoContacto: '',
    litrosRecogidos: 0,
    administradorId: null,
    beneficiosMedioambientales: {
      co2: 0,
      agua: 0,
      energia: 0
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['numViviendas', 'totalViviendas', 'litrosRecogidos'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createComunidad(formData);
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};
