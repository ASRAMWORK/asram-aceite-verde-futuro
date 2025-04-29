
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Phone, MapPin, Users, Droplet, Search } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useComunidades } from "@/hooks/useComunidades";
import { useComunidadesVecinos } from "@/hooks/useComunidadesVecinos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdministradoresFincas = () => {
  const { usuarios, loading } = useUsuarios();
  const { comunidades } = useComunidades();
  const { comunidades: comunidadesVecinos } = useComunidadesVecinos();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users with role 'administrador'
  const administradores = usuarios
    .filter(user => user.role === 'administrador')
    .filter(admin => 
      searchTerm === '' || 
      admin.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.nombreAdministracion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.distrito?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get comunidades count for each administrador
  const getComunidadesCount = (adminId) => {
    return comunidadesVecinos.filter(comunidad => comunidad.administradorId === adminId).length;
  };
  
  // Get total litros recogidos for each administrador
  const getLitrosRecogidos = (adminId) => {
    return comunidadesVecinos
      .filter(comunidad => comunidad.administradorId === adminId)
      .reduce((total, comunidad) => total + (comunidad.litrosRecogidos || 0), 0);
  };

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
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar administrador..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm('')}>Limpiar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administradores Registrados</CardTitle>
          <CardDescription>
            {administradores.length} administradores encontrados
          </CardDescription>
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
                    <TableHead>Comunidades</TableHead>
                    <TableHead>Litros Recogidos</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {administradores.map((admin) => (
                    <TableRow key={admin.id} className="group hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          {admin.nombreAdministracion || "No especificado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.nombre} {admin.apellido}
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
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{getComunidadesCount(admin.id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-green-500" />
                          <span>{getLitrosRecogidos(admin.id)}L</span>
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
