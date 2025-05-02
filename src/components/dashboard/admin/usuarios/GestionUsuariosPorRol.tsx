
import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, UserCog } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario, UserRole } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface GestionUsuariosPorRolProps {
  role: UserRole;
  title: string;
  description: string;
  onViewDetails?: (user: Usuario) => void;
}

const GestionUsuariosPorRol: React.FC<GestionUsuariosPorRolProps> = ({ 
  role, 
  title,
  description,
  onViewDetails 
}) => {
  const { loading, getUsuariosByRole } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Obtenemos usuarios por su rol específico
  const usuarios = getUsuariosByRole(role);

  // Filtramos por término de búsqueda
  const filteredUsers = usuarios.filter(
    user => 
      searchTerm === '' || 
      (user.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (user: Usuario) => {
    if (onViewDetails) {
      onViewDetails(user);
    } else {
      setSelectedUser(user);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>
                {description}
              </CardDescription>
            </div>
            <UserCog className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${role}...`}
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
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No se encontraron usuarios con rol {role}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nombre} {user.apellidos}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.telefono || "—"}</TableCell>
                          <TableCell>
                            {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 
                            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewDetails(user)}
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

      {!onViewDetails && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Usuario</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Información Personal</h3>
                    <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellidos}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Teléfono:</strong> {selectedUser.telefono || "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Información de Cuenta</h3>
                    <p><strong>Rol:</strong> {selectedUser.role}</p>
                    <p><strong>Estado:</strong> {selectedUser.activo ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Registrado:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GestionUsuariosPorRol;
