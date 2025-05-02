
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Check, X, User } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Badge } from '@/components/ui/badge';
import { Usuario, VinculacionAuthEstado } from '@/types';
import { toast } from 'sonner';

const AdministradoresVinculacion = () => {
  const { usuarios, loading, reintentarVinculacionAuth, actualizarEstadoVinculacion } = useUsuarios();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Filtrar administradores con problemas de vinculación
  const administradoresPendientes = usuarios.filter(
    (user) => 
      user.role === 'administrador' && 
      (user.estadoVinculacion === 'pendiente' || 
       user.estadoVinculacion === 'falla_password' || 
       user.estadoVinculacion === 'sin_vincular')
  );

  const handleOpenVinculacionDialog = (user: Usuario) => {
    setSelectedUser(user);
    setNewEmail(user.email);
    setNewPassword('');
    setIsDialogOpen(true);
  };

  const handleReintentarVinculacion = async () => {
    if (!selectedUser || !newPassword) {
      toast.error('Por favor, ingrese una contraseña');
      return;
    }

    const result = await reintentarVinculacionAuth(selectedUser.id, newEmail, newPassword);
    
    if (result.success) {
      setIsDialogOpen(false);
    }
  };

  const getEstadoVinculacionBadge = (estado?: VinculacionAuthEstado) => {
    switch (estado) {
      case 'completo':
        return <Badge className="bg-green-500">Vinculado</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'falla_password':
        return <Badge className="bg-red-500">Error de contraseña</Badge>;
      case 'sin_vincular':
        return <Badge className="bg-gray-500">Sin vincular</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconocido</Badge>;
    }
  };

  const getIntentos = (user: Usuario) => {
    if (!user.intentosVinculacion) return 'Ninguno';
    return `${user.intentosVinculacion} ${user.intentosVinculacion === 1 ? 'intento' : 'intentos'}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Administradores Pendientes de Vinculación</CardTitle>
          <CardDescription>
            Administradores que requieren vinculación con Firebase Auth
          </CardDescription>
        </div>
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : administradoresPendientes.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            No hay administradores pendientes de vinculación
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Intentos</TableHead>
                <TableHead>Último intento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {administradoresPendientes.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    {admin.nombre} {admin.apellidos}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getEstadoVinculacionBadge(admin.estadoVinculacion)}</TableCell>
                  <TableCell>{getIntentos(admin)}</TableCell>
                  <TableCell>
                    {admin.ultimoIntentoVinculacion 
                      ? new Date(admin.ultimoIntentoVinculacion).toLocaleString() 
                      : 'Nunca'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenVinculacionDialog(admin)}
                    >
                      <User className="mr-2 h-4 w-4" /> 
                      Vincular
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog para reintento de vinculación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular administrador con Firebase Auth</DialogTitle>
            <DialogDescription>
              Ingrese el email y una nueva contraseña para vincular a {selectedUser?.nombre} {selectedUser?.apellidos}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Nueva Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleReintentarVinculacion}>
              <Check className="mr-2 h-4 w-4" />
              Vincular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdministradoresVinculacion;
