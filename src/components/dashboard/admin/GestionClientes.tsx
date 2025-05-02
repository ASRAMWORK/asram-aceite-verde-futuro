import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, User, Edit, Trash2, RefreshCcw, Filter } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import RecogidaClienteButton from './clientes/RecogidaClienteButton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from '@/hooks/useDebounce';
import { Usuario } from '@/types';
import DetalleCliente from './DetalleCliente';

const GestionClientes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Usuario | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [distritoFilter, setDistritoFilter] = useState('');
  const [barrioFilter, setBarrioFilter] = useState('');
  const [viewingClient, setViewingClient] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    distrito: '',
    barrio: '',
  });
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {
    clientes,
    loading,
    error,
    loadClientesData,
    addCliente,
    updateCliente,
    deleteCliente,
    getDistritosUnicos,
    getBarriosUnicos,
  } = useClientes();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        id: selectedClient.id,
        nombre: selectedClient.nombre,
        email: selectedClient.email,
        telefono: selectedClient.telefono,
        direccion: selectedClient.direccion,
        distrito: selectedClient.distrito,
        barrio: selectedClient.barrio,
      });
    }
  }, [selectedClient]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Sin fecha";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddClient = async () => {
    try {
      await addCliente(formData);
      setIsAddingClient(false);
      setFormData({
        id: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        distrito: '',
        barrio: '',
      });
      toast({
        title: "Cliente añadido",
        description: "El cliente se ha añadido correctamente.",
      })
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha podido añadir el cliente.",
      })
    }
  };

  const handleEditClient = (cliente: Usuario) => {
    setSelectedClient(cliente);
    setIsEditingClient(true);
  };

  const handleViewClient = (cliente: Usuario) => {
    setViewingClient(cliente);
  };

  const handleUpdateClient = async () => {
    try {
      if (!selectedClient) {
        console.warn("No client selected for update.");
        return;
      }

      await updateCliente(selectedClient.id, formData);
      setIsEditingClient(false);
      setSelectedClient(null);
      setFormData({
        id: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        distrito: '',
        barrio: '',
      });
      toast({
        title: "Cliente actualizado",
        description: "El cliente se ha actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha podido actualizar el cliente.",
      })
    }
  };

  const handleDeleteClient = (id: string) => {
    setClientToDelete(id);
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      try {
        await deleteCliente(clientToDelete);
        setClientToDelete(null);
        toast({
          title: "Cliente eliminado",
          description: "El cliente se ha eliminado correctamente.",
        })
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se ha podido eliminar el cliente.",
        })
      }
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch =
      (cliente.nombre?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase()) ||
      (cliente.email?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase()) ||
      (cliente.telefono?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase()) ||
      (cliente.direccion?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase());

    const matchesDistrito = !distritoFilter || cliente.distrito === distritoFilter;
    const matchesBarrio = !barrioFilter || cliente.barrio === barrioFilter;

    return matchesSearch && matchesDistrito && matchesBarrio;
  });

  // If we're viewing a client, show the client detail view
  if (viewingClient) {
    return (
      <DetalleCliente
        cliente={viewingClient}
        onBack={() => setViewingClient(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">
            Administra los clientes registrados en el sistema
          </p>
        </div>
        <Button onClick={() => setIsAddingClient(true)} className="bg-[#ee970d] hover:bg-[#e08500]">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
          <CardDescription>
            Busca clientes por nombre, email, teléfono o dirección
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distritoFilter">Filtrar por Distrito</Label>
              <Select value={distritoFilter} onValueChange={setDistritoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los distritos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {getDistritosUnicos().map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="barrioFilter">Filtrar por Barrio</Label>
              <Select value={barrioFilter} onValueChange={setBarrioFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los barrios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los barrios</SelectItem>
                  {getBarriosUnicos(distritoFilter).map((barrio) => (
                    <SelectItem key={barrio} value={barrio}>{barrio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => {
              setDistritoFilter('');
              setBarrioFilter('');
              setSearchQuery('');
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Clientes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Cargando clientes...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button onClick={loadClientesData}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                No se encontraron clientes con los filtros aplicados.
              </p>
            </div>
          ) : (
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.telefono}</TableCell>
                      <TableCell>{cliente.direccion}</TableCell>
                      <TableCell>{cliente.distrito}</TableCell>
                      <TableCell>{cliente.barrio}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewClient(cliente)}
                          >
                            Ver detalle
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditClient(cliente)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClient(cliente.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Dialog para añadir cliente */}
      <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Añadir Cliente</DialogTitle>
            <DialogDescription>
              Añade un nuevo cliente al sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="barrio">Barrio</Label>
                <Input
                  id="barrio"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsAddingClient(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleAddClient} className="bg-[#ee970d] hover:bg-[#e08500]">
              Añadir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar cliente */}
      <Dialog open={isEditingClient} onOpenChange={setIsEditingClient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Edita la información del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="barrio">Barrio</Label>
                <Input
                  id="barrio"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditingClient(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleUpdateClient} className="bg-[#ee970d] hover:bg-[#e08500]">
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmar la eliminación */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el cliente permanentemente. No podrás recuperarlo después.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClient} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionClientes;
