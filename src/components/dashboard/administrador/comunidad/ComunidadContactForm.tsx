
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComunidadContactFormProps {
  formData: {
    nombreAdministracion: string;
    correoContacto: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComunidadContactForm = ({ formData, onChange }: ComunidadContactFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="nombreAdministracion">Nombre de Administración</Label>
        <Input 
          id="nombreAdministracion"
          name="nombreAdministracion"
          value={formData.nombreAdministracion}
          onChange={onChange}
          placeholder="Nombre de administración"
        />
      </div>
      
      <div>
        <Label htmlFor="correoContacto">Correo de Contacto</Label>
        <Input 
          id="correoContacto"
          name="correoContacto"
          type="email"
          value={formData.correoContacto}
          onChange={onChange}
          placeholder="Correo de contacto"
        />
      </div>
    </div>
  );
};
