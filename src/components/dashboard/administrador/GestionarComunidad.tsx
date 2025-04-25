
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ComunidadBasicInfoForm } from './comunidad/ComunidadBasicInfoForm';
import { ComunidadLocationForm } from './comunidad/ComunidadLocationForm';
import { ComunidadStatsForm } from './comunidad/ComunidadStatsForm';
import { ComunidadContactForm } from './comunidad/ComunidadContactForm';
import { useComunidadForm } from '@/hooks/useComunidadForm';

const GestionarComunidad = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useComunidadForm();

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
