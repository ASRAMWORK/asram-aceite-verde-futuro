
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader 
} from '@/components/ui/table';

interface ClientesListProps {
  searchTerm: string;
  filter: 'todos' | 'activos' | 'inactivos';
}

const ClientesList: React.FC<ClientesListProps> = ({ searchTerm, filter }) => {
  const { usuarios, loading } = useUsuarios();

  // Filter usuarios based on search term and active state
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      usuario.direccion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'todos') return matchesSearch;
    if (filter === 'activos') return matchesSearch && usuario.activo === true;
    if (filter === 'inactivos') return matchesSearch && usuario.activo === false;
    return matchesSearch;
  });

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  if (filteredUsuarios.length === 0) {
    return <p className="text-center py-4">No se encontraron clientes que coincidan con la búsqueda.</p>;
  }

  return (
    <Table>
      <TableCaption>Lista de clientes registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Distrito</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsuarios.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nombre}</TableCell>
            <TableCell>{cliente.direccion}</TableCell>
            <TableCell>{cliente.telefono}</TableCell>
            <TableCell>{cliente.distrito}</TableCell>
            <TableCell>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientesList;
