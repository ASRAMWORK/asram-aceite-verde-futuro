
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComunidadBasicInfoFormProps {
  formData: {
    nombre: string;
    cif: string;
    direccion: string;
    codigoPostal: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadBasicInfoForm = ({ formData, onChange }: ComunidadBasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="nombre">Nombre de la Comunidad</Label>
        <Input 
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          placeholder="Nombre de la comunidad"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="cif">CIF</Label>
        <Input 
          id="cif"
          name="cif"
          value={formData.cif}
          onChange={onChange}
          placeholder="CIF"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input 
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          placeholder="Dirección"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="codigoPostal">Código Postal</Label>
        <Input 
          id="codigoPostal"
          name="codigoPostal"
          value={formData.codigoPostal}
          onChange={onChange}
          placeholder="Código Postal"
          required
        />
      </div>
    </div>
  );
};
