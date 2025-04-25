
import React, { useState } from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComunidadVecinos } from '@/types';
import { Loader2 } from 'lucide-react';

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
    
    // Handle numeric fields specially
    if (name === 'numViviendas' || name === 'totalViviendas') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Comunidad</Label>
                <Input 
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Código Postal"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input 
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Distrito"
                />
              </div>
              
              <div>
                <Label htmlFor="barrio">Barrio</Label>
                <Input 
                  id="barrio"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleChange}
                  placeholder="Barrio"
                />
              </div>
              
              <div>
                <Label htmlFor="numViviendas">Número de Viviendas</Label>
                <Input 
                  id="numViviendas"
                  name="numViviendas"
                  type="number"
                  value={formData.numViviendas || ''}
                  onChange={handleChange}
                  placeholder="Número de viviendas"
                />
              </div>
              
              <div>
                <Label htmlFor="totalViviendas">Total de Viviendas</Label>
                <Input 
                  id="totalViviendas"
                  name="totalViviendas"
                  type="number"
                  value={formData.totalViviendas || ''}
                  onChange={handleChange}
                  placeholder="Total de viviendas"
                />
              </div>
              
              <div>
                <Label htmlFor="numeroPorteria">Número de Portería</Label>
                <Input 
                  id="numeroPorteria"
                  name="numeroPorteria"
                  value={formData.numeroPorteria || ''}
                  onChange={handleChange}
                  placeholder="Número de portería"
                />
              </div>
              
              <div>
                <Label htmlFor="nombreAdministracion">Nombre de Administración</Label>
                <Input 
                  id="nombreAdministracion"
                  name="nombreAdministracion"
                  value={formData.nombreAdministracion || ''}
                  onChange={handleChange}
                  placeholder="Nombre de administración"
                />
              </div>
              
              <div>
                <Label htmlFor="correoContacto">Correo de Contacto</Label>
                <Input 
                  id="correoContacto"
                  name="correoContacto"
                  type="email"
                  value={formData.correoContacto || ''}
                  onChange={handleChange}
                  placeholder="Correo de contacto"
                />
              </div>
            </div>
            
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
