
import React from 'react';
import { Input } from '@/components/ui/input';
import { Home, Package } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface ComunidadStatsFormProps {
  formData: {
    numViviendas: number;
    totalViviendas: number;
    numContenedores?: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadStatsForm: React.FC<ComunidadStatsFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Estadísticas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numViviendas" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Número de Viviendas
          </Label>
          <Input
            id="numViviendas"
            type="number"
            name="numViviendas"
            value={formData.numViviendas}
            onChange={onChange}
            min={0}
            className="bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalViviendas" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Total de Viviendas
          </Label>
          <Input
            id="totalViviendas"
            type="number"
            name="totalViviendas"
            value={formData.totalViviendas}
            onChange={onChange}
            min={0}
            className="bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numContenedores" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Número de Contenedores
          </Label>
          <Input
            id="numContenedores"
            type="number"
            name="numContenedores"
            value={formData.numContenedores || 0}
            onChange={onChange}
            min={0}
            className="bg-background"
          />
        </div>
      </div>
    </div>
  );
};
