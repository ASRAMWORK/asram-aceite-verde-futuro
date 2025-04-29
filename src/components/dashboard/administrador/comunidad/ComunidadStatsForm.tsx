
import React from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Home, Package } from 'lucide-react';

interface ComunidadStatsFormProps {
  formData: {
    numViviendas: number;
    totalViviendas: number;
    numContenedores?: number;  // Added numContenedores field
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadStatsForm: React.FC<ComunidadStatsFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Estadísticas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="numViviendas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Número de Viviendas
              </FormLabel>
              <Input
                type="number"
                name="numViviendas"
                value={formData.numViviendas}
                onChange={onChange}
                min={0}
                className="bg-background"
              />
            </FormItem>
          )}
        />
        <FormField
          name="totalViviendas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Total de Viviendas
              </FormLabel>
              <Input
                type="number"
                name="totalViviendas"
                value={formData.totalViviendas}
                onChange={onChange}
                min={0}
                className="bg-background"
              />
            </FormItem>
          )}
        />
        <FormField
          name="numContenedores"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Número de Contenedores
              </FormLabel>
              <Input
                type="number"
                name="numContenedores"
                value={formData.numContenedores || 0}
                onChange={onChange}
                min={0}
                className="bg-background"
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
