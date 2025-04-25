
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComunidadStatsFormProps {
  formData: {
    numViviendas: number;
    totalViviendas: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadStatsForm = ({ formData, onChange }: ComunidadStatsFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="numViviendas">Número de Viviendas</Label>
        <Input 
          id="numViviendas"
          name="numViviendas"
          type="number"
          value={formData.numViviendas}
          onChange={onChange}
          placeholder="Número de viviendas"
        />
      </div>
      
      <div>
        <Label htmlFor="totalViviendas">Total de Viviendas</Label>
        <Input 
          id="totalViviendas"
          name="totalViviendas"
          type="number"
          value={formData.totalViviendas}
          onChange={onChange}
          placeholder="Total de viviendas"
        />
      </div>
    </div>
  );
};
