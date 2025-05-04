
import React, { useState } from 'react';
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
import { Search, Eye, UserX } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Usuario } from '@/types';
import { toast } from 'sonner';
import { useUsuarios } from '@/hooks/useUsuarios';
import DetalleAdministrador from './DetalleAdministrador';
import { formatDate } from '@/utils/dates';

interface AdministradoresListProps {
  administradores: Usuario[];
}

const AdministradoresList: React.FC<AdministradoresListProps> = ({ administradores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Usuario | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteUsuario } = useUsuarios();

  const handleVerDetalles = (admin: Usuario) => {
    setSelectedAdmin(admin);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete?.id) {
      try {
        await deleteUsuario(adminToDelete.id);
        toast.success(`Administrador ${adminToDelete.nombre} eliminado correctamente`);
        setIsDeleteDialogOpen(false);
        setAdminToDelete(null);
      } catch (error) {
        toast.error('Error al eliminar el administrador');
        console.error('Error:', error);
      }
    }
  };

  // Filtrar administradores por término de búsqueda
  const filteredAdmins = administradores.filter(admin => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      admin.nombre?.toLowerCase().includes(searchTermLower) ||
      admin.email?.toLowerCase().includes(searchTermLower) ||
      admin.nombreAdministracion?.toLowerCase().includes(searchTermLower) ||
      admin.direccion?.toLowerCase().includes(searchTermLower) ||
      admin.telefono?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 my-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar administrador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {administradores.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay administradores registrados
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Administración</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No se encontraron resultados para "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.nombre} {admin.apellidos}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.nombreAdministracion || "—"}</TableCell>
                    <TableCell>{admin.telefono || "—"}</TableCell>
                    <TableCell>
                      {admin.createdAt ? formatDate(admin.createdAt) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={admin.activo ? "default" : "destructive"}
                        className={`${admin.activo ? 'bg-green-100 hover:bg-green-200 text-green-800' : 'bg-red-100 hover:bg-red-200 text-red-800'}`}
                      >
                        {admin.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleVerDetalles(admin)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setAdminToDelete(admin);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo para ver detalles */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Administrador</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <DetalleAdministrador admin={selectedAdmin} />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar al administrador {adminToDelete?.nombre} {adminToDelete?.apellidos}?
            Esta acción no se puede deshacer.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdministradoresList;
