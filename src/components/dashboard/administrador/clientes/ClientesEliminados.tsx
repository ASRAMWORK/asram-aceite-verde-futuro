
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Undo, Search, UserPlus, User } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface ClientesEliminadosProps {
  searchTerm: string;
}

const ClientesEliminados: React.FC<ClientesEliminadosProps> = ({ searchTerm }) => {
  const { clientesInactivos, loadingInactivos, loadClientesInactivos, restaurarCliente } = useClientes();
  const [clienteToRestore, setClienteToRestore] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadClientesInactivos();
  }, []);

  const handleRestoreClient = (id: string) => {
    setClienteToRestore(id);
  };

  const confirmRestore = async () => {
    if (clienteToRestore) {
      setIsRestoring(true);
      try {
        await restaurarCliente(clienteToRestore);
        setClienteToRestore(null);
      } catch (error) {
        console.error("Error restaurando cliente:", error);
      } finally {
        setIsRestoring(false);
      }
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Desconocido";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: es });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientesInactivos.filter(cliente => {
    return (
      (cliente.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (cliente.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (cliente.direccion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  if (loadingInactivos) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clientesInactivos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay clientes eliminados</h3>
        <p className="text-muted-foreground">
          Cuando elimines clientes, aparecerán aquí para poder restaurarlos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredClientes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">No se encontraron clientes eliminados que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>Lista de clientes eliminados</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Fecha eliminación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.telefono || '-'}</TableCell>
                  <TableCell>{cliente.direccion || '-'}</TableCell>
                  <TableCell>{cliente.updatedAt ? formatDate(cliente.updatedAt) : 'Desconocido'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleRestoreClient(cliente.id)}
                    >
                      <Undo className="h-4 w-4 mr-2" />
                      Restaurar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!clienteToRestore} onOpenChange={(open) => !open && setClienteToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar este cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              El cliente volverá a estar activo y aparecerá en la lista de clientes disponibles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRestore}
              className="bg-green-600 hover:bg-green-700"
              disabled={isRestoring}
            >
              {isRestoring ? "Restaurando..." : "Restaurar cliente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientesEliminados;
