
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
import { Button } from "@/components/ui/button";
import { useUsuarios } from "@/hooks/useUsuarios";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck, UserX } from "lucide-react";

const ComercialView = () => {
  const { usuarios, updateUsuario } = useUsuarios();
  const comerciales = usuarios.filter(user => user.role === 'comercial');

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    await updateUsuario(userId, { activo: !isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Comerciales</h2>
        <Button className="bg-asram hover:bg-asram-700">
          <User className="mr-2 h-4 w-4" />
          Nuevo Comercial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comerciales Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comerciales.map((comercial) => (
                <TableRow key={comercial.id}>
                  <TableCell>{comercial.nombre} {comercial.apellidos}</TableCell>
                  <TableCell>{comercial.email}</TableCell>
                  <TableCell>{comercial.telefono}</TableCell>
                  <TableCell>
                    <Badge variant={comercial.activo ? "default" : "destructive"} className={comercial.activo ? "bg-green-500" : ""}>
                      {comercial.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleStatus(comercial.id, comercial.activo)}
                      >
                        {comercial.activo ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComercialView;
