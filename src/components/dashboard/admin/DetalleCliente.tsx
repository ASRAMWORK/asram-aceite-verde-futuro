import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Mail, Phone, MapPin, Building } from 'lucide-react';
import type { Usuario } from '@/types';
import { Badge } from '@/components/ui/badge';
import ClienteHistorialRecogidas from './historial/ClienteHistorialRecogidas';
import ClienteLitrosHistory from './clientes/ClienteLitrosHistory';

interface DetalleClienteProps {
  cliente: Usuario;
  onBack: () => void;
}

const DetalleCliente: React.FC<DetalleClienteProps> = ({ cliente, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-3xl font-bold">{cliente.nombre}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos de contacto y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{cliente.email || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{cliente.telefono || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">{cliente.direccion || 'No especificada'}</p>
                  {cliente.distrito && (
                    <p className="text-sm text-muted-foreground">
                      Distrito: {cliente.distrito} {cliente.barrio ? `- Barrio: ${cliente.barrio}` : ''}
                    </p>
                  )}
                  {cliente.ciudad && (
                    <p className="text-sm text-muted-foreground">
                      {cliente.ciudad}, {cliente.provincia} {cliente.codigoPostal || ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                <Building className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tipo de Cliente</p>
                  <p className="flex mt-1">
                    <Badge variant="secondary">
                      {cliente.tipo === 'particular' && 'Particular'}
                      {cliente.tipo === 'negocio' && 'Negocio/Restaurante'}
                      {cliente.tipo === 'administrador' && 'Administrador de Fincas'}
                      {cliente.tipo === 'punto_verde' && 'Punto Verde'}
                      {!cliente.tipo && 'No especificado'}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
            
            {cliente.tipo === 'punto_verde' && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Detalles del Punto Verde</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Viviendas</p>
                    <p className="text-sm text-muted-foreground">{cliente.numViviendas || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contenedores</p>
                    <p className="text-sm text-muted-foreground">{cliente.numContenedores || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {(cliente.tipo === 'negocio' || cliente.tipo === 'administrador') && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Información Fiscal</h3>
                {cliente.cif && (
                  <div>
                    <p className="text-sm font-medium">CIF</p>
                    <p className="text-sm text-muted-foreground">{cliente.cif}</p>
                  </div>
                )}
                {cliente.nombreAdministracion && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Nombre Administración</p>
                    <p className="text-sm text-muted-foreground">{cliente.nombreAdministracion}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Estado</h3>
              <Badge variant={cliente.activo ? "default" : "destructive"}>
                {cliente.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-6">
          <ClienteLitrosHistory cliente={cliente} />
          <ClienteHistorialRecogidas cliente={cliente} />
        </div>
      </div>
    </div>
  );
};

export default DetalleCliente;
