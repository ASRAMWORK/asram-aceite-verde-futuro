
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Filter } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ClientesListProps {
  searchTerm: string;
  filter: 'todos' | 'activos' | 'inactivos';
}

const ClientesList: React.FC<ClientesListProps> = ({ searchTerm, filter }) => {
  const { usuarios, loading } = useUsuarios();
  const [distritoFilter, setDistritoFilter] = useState<string>('todos');
  const [barrioFilter, setBarrioFilter] = useState<string>('todos');

  // Get unique districts and neighborhoods
  const distritos = ['todos', ...new Set(usuarios.map(u => u.distrito).filter(Boolean))];
  const barrios = ['todos', ...new Set(usuarios.map(u => u.barrio).filter(Boolean))];

  // Filter usuarios based on search term, active state, district and neighborhood
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      usuario.direccion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActiveFilter = 
      filter === 'todos' || 
      (filter === 'activos' && usuario.activo === true) || 
      (filter === 'inactivos' && usuario.activo === false);

    const matchesDistrito = 
      distritoFilter === 'todos' || 
      usuario.distrito === distritoFilter;

    const matchesBarrio = 
      barrioFilter === 'todos' || 
      usuario.barrio === barrioFilter;
    
    return matchesSearch && matchesActiveFilter && matchesDistrito && matchesBarrio;
  });

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Filtrar por:</span>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          <Select value={distritoFilter} onValueChange={setDistritoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritos.map(distrito => (
                <SelectItem key={distrito} value={distrito}>
                  {distrito === 'todos' ? 'Todos los distritos' : distrito}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={barrioFilter} onValueChange={setBarrioFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Barrio" />
            </SelectTrigger>
            <SelectContent>
              {barrios.map(barrio => (
                <SelectItem key={barrio} value={barrio}>
                  {barrio === 'todos' ? 'Todos los barrios' : barrio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsuarios.length === 0 ? (
        <p className="text-center py-4">No se encontraron clientes que coincidan con la búsqueda.</p>
      ) : (
        <Table>
          <TableCaption>Lista de clientes registrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Distrito</TableHead>
              <TableHead>Barrio</TableHead>
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
                <TableCell>{cliente.barrio}</TableCell>
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
      )}
    </div>
  );
};

export default ClientesList;
