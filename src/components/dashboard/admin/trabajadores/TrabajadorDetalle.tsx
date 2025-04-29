import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, Truck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Trabajador } from "@/types";

interface TrabajadorDetalleProps {
  trabajador: Trabajador;
  onEdit: () => void;
}

const TrabajadorDetalle = ({ trabajador, onEdit }: TrabajadorDetalleProps) => {
  // Helper functions to safely access potentially undefined properties
  const getRutasAsignadas = () => {
    if (!trabajador.rutasAsignadas) return [];
    if (Array.isArray(trabajador.rutasAsignadas)) return trabajador.rutasAsignadas;
    return [trabajador.rutasAsignadas];
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No especificada';
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={trabajador.foto} alt={`${trabajador.nombre} ${trabajador.apellidos}`} />
          <AvatarFallback className="text-lg">
            {trabajador.nombre.charAt(0)}{trabajador.apellidos?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{trabajador.nombre} {trabajador.apellidos}</h2>
          <p className="text-gray-500">{trabajador.email}</p>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">DNI/NIE:</span>
              <span>{trabajador.dni || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Fecha de Nacimiento:</span>
              <span>{formatDate(trabajador.fechaNacimiento)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Teléfono:</span>
              <span>{trabajador.telefono}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Dirección:</span>
              <span>{trabajador.direccion || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ciudad:</span>
              <span>{trabajador.ciudad || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Provincia:</span>
              <span>{trabajador.provincia || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Código Postal:</span>
              <span>{trabajador.codigoPostal || 'No especificado'}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Información Laboral</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Tipo de Contrato:</span>
              <span>{trabajador.tipoContrato || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tipo de Jornada:</span>
              <span>{trabajador.tipoJornada || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Fecha de Alta:</span>
              <span>{formatDate(trabajador.fechaAlta)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Departamento:</span>
              <span>{trabajador.departamento}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Cargo:</span>
              <span>{trabajador.cargo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Salario Base:</span>
              <span>{trabajador.salarioBase ? `${trabajador.salarioBase} €` : 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estado:</span>
              <Badge variant={trabajador.activo ? "default" : "secondary"}>
                {trabajador.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Roles</h3>
        <div className="flex flex-wrap gap-2">
          {trabajador.roles?.map((rol) => (
            <Badge key={rol} variant="secondary">
              {rol}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Asignaciones</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Rutas Asignadas:</span>
            {getRutasAsignadas().length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {getRutasAsignadas().map((ruta, index) => (
                  <Badge key={index} variant="outline">
                    {ruta}
                  </Badge>
                ))}
              </div>
            ) : (
              <span>Ninguna</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Fecha de Contratación:</span>
            <span>{formatDate(trabajador.fechaContratacion)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Email:</span>
            <span>{trabajador.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Teléfono:</span>
            <span>{trabajador.telefono}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajadorDetalle;
