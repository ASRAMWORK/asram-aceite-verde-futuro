
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComunidadLocationFormProps {
  formData: {
    ciudad: string;
    distrito: string;
    barrio: string;
    numeroPorteria: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadLocationForm = ({ formData, onChange }: ComunidadLocationFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="ciudad">Ciudad</Label>
        <Input 
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={onChange}
          placeholder="Ciudad"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="distrito">Distrito</Label>
        <Input 
          id="distrito"
          name="distrito"
          value={formData.distrito}
          onChange={onChange}
          placeholder="Distrito"
        />
      </div>
      
      <div>
        <Label htmlFor="barrio">Barrio</Label>
        <Input 
          id="barrio"
          name="barrio"
          value={formData.barrio}
          onChange={onChange}
          placeholder="Barrio"
        />
      </div>
      
      <div>
        <Label htmlFor="numeroPorteria">Número de Portería</Label>
        <Input 
          id="numeroPorteria"
          name="numeroPorteria"
          value={formData.numeroPorteria}
          onChange={onChange}
          placeholder="Número de portería"
        />
      </div>
    </div>
  );
};
