
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  BadgeCheck,
  Building2, 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User
} from 'lucide-react';
import { Usuario } from '@/types';
import { formatDate } from '@/utils/dates';

interface AdminPerfilTabProps {
  admin: Usuario;
}

const AdminPerfilTab: React.FC<AdminPerfilTabProps> = ({ admin }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Nombre:</span>
            <span className="text-sm">{admin.nombre} {admin.apellidos}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{admin.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Teléfono:</span>
            <span className="text-sm">{admin.telefono || "No especificado"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Fecha de registro:</span>
            <span className="text-sm">
              {admin.createdAt ? formatDate(admin.createdAt) : "No disponible"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Estado cuenta:</span>
            <span className={`text-sm ${admin.activo ? 'text-green-600' : 'text-red-600'}`}>
              {admin.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Datos de la Administración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Nombre de la administración:</span>
            <span className="text-sm">{admin.nombreAdministracion || "No especificado"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Dirección:</span>
            <span className="text-sm">{admin.direccion || "No especificada"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Ciudad:</span>
            <span className="text-sm">{admin.ciudad || "No especificada"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Código Postal:</span>
            <span className="text-sm">{admin.codigoPostal || "No especificado"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerfilTab;
