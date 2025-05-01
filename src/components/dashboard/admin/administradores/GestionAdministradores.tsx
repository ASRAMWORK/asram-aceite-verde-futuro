import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, UserCog } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { DetalleAdministrador } from './DetalleAdministrador';
import { Usuario } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const GestionAdministradores = () => {
  const { usuarios, loading } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrar solo los administradores
  const administradores = Array.isArray(usuarios) ? usuarios.filter(
    usuario => {
      // Verificamos que el usuario.role exista antes de comparar
      const userRole = usuario?.role?.toLowerCase?.() || '';
      return userRole === 'administrador';
    }
  ).filter(
    admin => 
      searchTerm === '' || 
      (admin.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.nombreAdministracion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  const handleVerDetalles = (admin: Usuario) => {
    setSelectedAdmin(admin);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Gestión de Administradores de Fincas</CardTitle>
              <CardDescription>
                Gestiona los perfiles de administradores de fincas registrados en el sistema
              </CardDescription>
            </div>
            <UserCog className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar administrador..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nombre Administración</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {administradores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No se encontraron administradores
                        </TableCell>
                      </TableRow>
                    ) : (
                      administradores.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.nombre} {admin.apellidos}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.nombreAdministracion || "—"}</TableCell>
                          <TableCell>{admin.telefono || "—"}</TableCell>
                          <TableCell>
                            {admin.fechaRegistro ? new Date(admin.fechaRegistro).toLocaleDateString() : 
                             admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              admin.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleVerDetalles(admin)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">Ver detalles</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Administrador</DialogTitle>
          </DialogHeader>
          {selectedAdmin && <DetalleAdministrador admin={selectedAdmin} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionAdministradores;
