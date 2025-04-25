
import React, { useState } from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ComunidadVecinos } from '@/types';
import { Loader2 } from 'lucide-react';
import { ComunidadBasicInfoForm } from './comunidad/ComunidadBasicInfoForm';
import { ComunidadLocationForm } from './comunidad/ComunidadLocationForm';
import { ComunidadStatsForm } from './comunidad/ComunidadStatsForm';
import { ComunidadContactForm } from './comunidad/ComunidadContactForm';

const GestionarComunidad = () => {
  const { createComunidad, isLoading } = useComunidadesVecinos();
  const [formData, setFormData] = useState<Partial<ComunidadVecinos>>({
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestionar Comunidad</h2>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ComunidadBasicInfoForm formData={formData} onChange={handleChange} />
            <ComunidadLocationForm formData={formData} onChange={handleChange} />
            <ComunidadStatsForm formData={formData} onChange={handleChange} />
            <ComunidadContactForm formData={formData} onChange={handleChange} />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Comunidad'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionarComunidad;
