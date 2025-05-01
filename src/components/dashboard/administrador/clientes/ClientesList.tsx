
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Filter, Building, Store, Hotel, Utensils, School, Users, GraduationCap } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface ClientesListProps {
  searchTerm: string;
  filter: 'todos' | 'activos' | 'inactivos';
}

const ClientesList: React.FC<ClientesListProps> = ({ searchTerm, filter }) => {
  const { usuarios, loading, deleteUsuario } = useUsuarios();
  const [distritoFilter, setDistritoFilter] = useState<string>('todos');
  const [barrioFilter, setBarrioFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);

  // Get unique districts and neighborhoods
  const distritos = ['todos', ...new Set(usuarios.map(u => u.distrito || '').filter(Boolean))];
  
  // Get barrios based on selected distrito
  const barrios = ['todos', ...new Set(usuarios
    .filter(u => distritoFilter === 'todos' || u.distrito === distritoFilter)
    .map(u => u.barrio || '').filter(Boolean))];
  
  // Get unique client types
  const tipos = ['todos', ...new Set(usuarios.map(u => u.tipo || '').filter(Boolean))];

  const handleDeleteUser = (id: string) => {
    setClienteToDelete(id);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      try {
        await deleteUsuario(clienteToDelete);
        toast.success("Cliente eliminado correctamente");
        setClienteToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar cliente");
        console.error("Error deleting user:", error);
      }
    }
  };

  const getTipoIcon = (tipo: string | undefined) => {
    switch(tipo?.toLowerCase()) {
      case 'bar':
      case 'restaurante':
        return <Utensils className="h-4 w-4 text-amber-600" />;
      case 'hotel':
        return <Hotel className="h-4 w-4 text-blue-600" />;
      case 'administración de fincas':
        return <Building className="h-4 w-4 text-purple-600" />;
      case 'centro escolar':
        return <School className="h-4 w-4 text-green-600" />;
      case 'asociación':
        return <Users className="h-4 w-4 text-indigo-600" />;
      default:
        return <Store className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter usuarios based on search term, active state, district, neighborhood and type
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      (usuario.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (usuario.direccion?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesActiveFilter = 
      filter === 'todos' || 
      (filter === 'activos' && usuario.activo === true) || 
      (filter === 'inactivos' && usuario.activo === false);

    // FIX: Properly handle 'todos' case for district filter
    const matchesDistrito = 
      distritoFilter === 'todos' || 
      usuario.distrito === distritoFilter;

    const matchesBarrio = 
      barrioFilter === 'todos' || 
      usuario.barrio === barrioFilter;
      
    const matchesTipo = 
      tipoFilter === 'todos' || 
      usuario.tipo === tipoFilter;
    
    return matchesSearch && matchesActiveFilter && matchesDistrito && matchesBarrio && matchesTipo;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrar por:</span>
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
          
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map(tipo => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo === 'todos' ? 'Todos los tipos' : tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
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
      ) : filteredUsuarios.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-muted-foreground">No se encontraron clientes que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>Lista de clientes registrados</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
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
                <TableRow key={cliente.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>
                    {cliente.tipo ? (
                      <div className="flex items-center gap-1.5">
                        {getTipoIcon(cliente.tipo)}
                        <span>{cliente.tipo}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{cliente.direccion || '-'}</TableCell>
                  <TableCell>{cliente.telefono || '-'}</TableCell>
                  <TableCell>{cliente.distrito || '-'}</TableCell>
                  <TableCell>{cliente.barrio || '-'}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      cliente.activo ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}>
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2 text-gray-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteUser(cliente.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!clienteToDelete} onOpenChange={(open) => !open && setClienteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientesList;
