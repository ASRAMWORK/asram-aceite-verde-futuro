import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Phone, MapPin } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";

const AdministradoresFincas = () => {
  const { usuarios, loading } = useUsuarios();
  
  // Filter users with role 'administrador'
  const administradores = usuarios.filter(user => user.role === 'administrador');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión Administradores de Fincas</h2>
          <p className="text-muted-foreground">
            Control y gestión de administradores de fincas registrados
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administradores Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Administración</TableHead>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {administradores.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          {admin.nombreAdministracion || "Sin nombre"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.nombre} {admin.apellidos}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {admin.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {admin.telefono}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {admin.distrito ? `${admin.distrito}, ${admin.ciudad || "Madrid"}` : "No especificado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.activo ? "secondary" : "destructive"}>
                          {admin.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradoresFincas;
