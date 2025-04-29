
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ComunidadBasicInfoForm } from './comunidad/ComunidadBasicInfoForm';
import { ComunidadLocationForm } from './comunidad/ComunidadLocationForm';
import { ComunidadStatsForm } from './comunidad/ComunidadStatsForm';
import { ComunidadContactForm } from './comunidad/ComunidadContactForm';
import { useComunidadForm } from '@/hooks/useComunidadForm';
import type { ComunidadVecinos } from '@/types';

const GestionarComunidad = () => {
  const { formData, isLoading, handleChange, handleSubmit, loading } = useComunidadForm();
  
  // Extract only the needed properties for each form component - updated to match interface
  const basicInfoProps = {
    nombre: formData.nombre || '',
    cif: formData.cif || '',
    direccion: formData.direccion || '',
    codigoPostal: formData.codigoPostal || ''
  };

  // Convert numeroPorteria to string explicitly
  const locationProps = {
    ciudad: formData.ciudad || '',
    distrito: formData.distrito || '',
    barrio: formData.barrio || '',
    numeroPorteria: String(formData.numeroPorteria || '') // Explicitly convert to string
  };

  const statsProps = {
    numViviendas: formData.numViviendas || 0,
    totalViviendas: formData.totalViviendas || 0
  };

  const contactProps = {
    nombreAdministracion: formData.nombreAdministracion || '',
    correoContacto: formData.correoContacto || ''
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(formData as ComunidadVecinos);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestionar Comunidad</h2>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <ComunidadBasicInfoForm 
              formData={basicInfoProps} 
              onChange={handleChange} 
            />
            <ComunidadLocationForm 
              formData={locationProps} 
              onChange={handleChange} 
            />
            <ComunidadStatsForm 
              formData={statsProps} 
              onChange={handleChange} 
            />
            <ComunidadContactForm 
              formData={contactProps} 
              onChange={handleChange} 
            />
            
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
