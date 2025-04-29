
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRutas } from '@/hooks/useRutas';
import { useClientes } from '@/hooks/useClientes';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { format } from 'date-fns';
import { 
  Calendar, 
  Check, 
  Clock, 
  Filter, 
  ListFilter,
  MapPin, 
  Plus, 
  Route, 
  Search, 
  Trash2, 
  User,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const RutasPersonalizadas = () => {
  const { rutas, addRuta, loading: rutasLoading, getRutasByTipo } = useRutas();
  const { clientes, loading: clientesLoading, getDistritosUnicos, getBarriosUnicos } = useClientes();
  const { voluntarios, loading: voluntariosLoading } = useVoluntarios();
  
  // UI states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [nombreRuta, setNombreRuta] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [horaSeleccionada, setHoraSeleccionada] = useState('08:00');
  const [recogedorSeleccionado, setRecogedorSeleccionado] = useState('');
  const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState('semanal');
  
  // Cliente selection states
  const [clientesSeleccionados, setClientesSeleccionados] = useState<any[]>([]);
  const [distritoFiltro, setDistritoFiltro] = useState('');
  const [barrioFiltro, setBarrioFiltro] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  
  const distritos = getDistritosUnicos();
  const barrios = getBarriosUnicos(distritoFiltro || undefined);
  
  const rutasPersonalizadas = getRutasByTipo('personalizada').filter(ruta => 
    ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter clients for selection
  const clientesFiltrados = clientes.filter(cliente => {
    let matchesDistrito = true;
    let matchesBarrio = true;
    let matchesSearch = true;
    
    if (distritoFiltro) {
      matchesDistrito = cliente.distrito === distritoFiltro;
    }
    
    if (barrioFiltro) {
      matchesBarrio = cliente.barrio === barrioFiltro;
    }
    
    if (busquedaCliente) {
      matchesSearch = 
        (cliente.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase())) || 
        (cliente.direccion?.toLowerCase().includes(busquedaCliente.toLowerCase()));
    }
    
    return matchesDistrito && matchesBarrio && matchesSearch;
  });
  
  const handleSeleccionarCliente = (cliente: any) => {
    if (clientesSeleccionados.some(c => c.id === cliente.id)) {
      // Already selected, remove it
      setClientesSeleccionados(prev => prev.filter(c => c.id !== cliente.id));
    } else {
      // Add to selection with order number
      setClientesSeleccionados(prev => [
        ...prev, 
        { 
          ...cliente, 
          orden: prev.length + 1,
          litrosEstimados: cliente.litrosEstimados || 0
        }
      ]);
    }
  };
  
  const handleRemoveCliente = (id: string) => {
    setClientesSeleccionados(prev => {
      const filtered = prev.filter(c => c.id !== id);
      // Reorder remaining clients
      return filtered.map((cliente, index) => ({
        ...cliente,
        orden: index + 1
      }));
    });
  };
  
  const handleMoveClienteUp = (index: number) => {
    if (index === 0) return; // Already at the top
    
    setClientesSeleccionados(prev => {
      const newArray = [...prev];
      // Swap with previous item
      const temp = { ...newArray[index] };
      newArray[index] = { ...newArray[index - 1], orden: index + 1 };
      newArray[index - 1] = { ...temp, orden: index };
      return newArray;
    });
  };
  
  const handleMoveClienteDown = (index: number) => {
    if (index === clientesSeleccionados.length - 1) return; // Already at the bottom
    
    setClientesSeleccionados(prev => {
      const newArray = [...prev];
      // Swap with next item
      const temp = { ...newArray[index] };
      newArray[index] = { ...newArray[index + 1], orden: index + 1 };
      newArray[index + 1] = { ...temp, orden: index + 2 };
      return newArray;
    });
  };
  
  const handleCrearRuta = async () => {
    if (!nombreRuta) {
      toast.error('Debe asignar un nombre a la ruta');
      return;
    }
    
    if (clientesSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un cliente para la ruta');
      return;
    }
    
    if (!fechaSeleccionada || !horaSeleccionada) {
      toast.error('Seleccione fecha y hora para la ruta');
      return;
    }
    
    const clientesRuta = clientesSeleccionados.map((cliente) => ({
      id: cliente.id,
      nombre: cliente.nombre || '',
      direccion: cliente.direccion || '',
      barrio: cliente.barrio || '',
      distrito: cliente.distrito || '',
      orden: cliente.orden,
      litrosEstimados: cliente.litrosEstimados || 0
    }));
    
    // Get all unique districts in the selected clients
    const distritosRuta = [...new Set(clientesRuta.map(c => c.distrito))];
    
    await addRuta({
      nombre: nombreRuta,
      distrito: distritosRuta.join(', '),
      barrios: [...new Set(clientesRuta.map(c => c.barrio))],
      fecha: new Date(fechaSeleccionada),
      hora: horaSeleccionada,
      recogedores: recogedorSeleccionado,
      clientes: clientesRuta,
      puntosRecogida: clientesRuta.length,
      distanciaTotal: 0, // To be calculated later
      tiempoEstimado: "0",
      frecuencia: frecuenciaSeleccionada,
      completada: false,
      litrosTotales: 0,
      puntos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tipo: 'personalizada'
    });
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNombreRuta('');
    setFechaSeleccionada(new Date().toISOString().slice(0, 10));
    setHoraSeleccionada('08:00');
    setRecogedorSeleccionado('');
    setFrecuenciaSeleccionada('semanal');
    setClientesSeleccionados([]);
    setDistritoFiltro('');
    setBarrioFiltro('');
    setBusquedaCliente('');
  };
  
  if (rutasLoading || clientesLoading || voluntariosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas Personalizadas</h2>
          <p className="text-muted-foreground">
            Crea rutas personalizadas con clientes de diferentes distritos y barrios.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Ruta Personalizada
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar rutas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Rutas Personalizadas</CardTitle>
          <CardDescription>
            {rutasPersonalizadas.length} rutas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rutasPersonalizadas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Distritos</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasPersonalizadas.map((ruta) => (
                  <TableRow key={ruta.id}>
                    <TableCell className="font-medium">{ruta.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]" title={ruta.distrito}>
                          {ruta.distrito}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{ruta.clientes?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {ruta.fecha ? format(new Date(ruta.fecha), 'dd/MM/yyyy') : 'Sin programar'}
                        </span>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {ruta.hora}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ruta.completada ? "success" : "outline"} className={
                        ruta.completada ? "bg-green-100 text-green-800" : ""
                      }>
                        {ruta.completada ? "Completada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:border-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Route className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-2 text-lg font-medium">No hay rutas personalizadas</h3>
              <p className="mt-1 text-muted-foreground">
                Crea una nueva ruta personalizada para empezar.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Crear primera ruta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Ruta Personalizada</DialogTitle>
            <DialogDescription>
              Selecciona múltiples clientes de diferentes distritos para crear una ruta personalizada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Ruta</Label>
                <Input
                  id="nombre"
                  value={nombreRuta}
                  onChange={(e) => setNombreRuta(e.target.value)}
                  placeholder="Ej: Ruta Especial Centro-Norte"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frecuencia">Frecuencia</Label>
                <Select value={frecuenciaSeleccionada} onValueChange={setFrecuenciaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diaria">Diaria</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="bajo-demanda">Bajo demanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <div className="flex">
                  <Calendar className="mr-2 h-4 w-4 mt-3" />
                  <Input
                    id="fecha"
                    type="date"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 mt-3" />
                  <Input
                    id="hora"
                    type="time"
                    value={horaSeleccionada}
                    onChange={(e) => setHoraSeleccionada(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recogedor">Recogedor</Label>
              <div className="flex">
                <User className="mr-2 h-4 w-4 mt-3" />
                <Select value={recogedorSeleccionado} onValueChange={setRecogedorSeleccionado}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Asignar recogedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {voluntarios.map(voluntario => (
                      <SelectItem key={voluntario.id} value={voluntario.id}>
                        {voluntario.nombre} {voluntario.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-4">Selecciona los clientes para la ruta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column: Client selection */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Filtrar clientes</Label>
                    <div className="flex gap-2">
                      <Select value={distritoFiltro} onValueChange={setDistritoFiltro}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los distritos</SelectItem>
                          {distritos.map(distrito => (
                            <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={barrioFiltro} 
                        onValueChange={setBarrioFiltro}
                        disabled={!distritoFiltro}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Barrio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los barrios</SelectItem>
                          {barrios.map(barrio => (
                            <SelectItem key={barrio} value={barrio}>{barrio}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente..."
                        className="pl-8"
                        value={busquedaCliente}
                        onChange={(e) => setBusquedaCliente(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-2 bg-muted/50 border-b flex justify-between items-center">
                      <span className="font-medium text-sm">Clientes disponibles</span>
                      <Badge variant="outline">{clientesFiltrados.length}</Badge>
                    </div>
                    <ScrollArea className="h-[300px]">
                      {clientesFiltrados.length > 0 ? (
                        <ul className="divide-y">
                          {clientesFiltrados.map(cliente => {
                            const isSelected = clientesSeleccionados.some(c => c.id === cliente.id);
                            return (
                              <li 
                                key={cliente.id} 
                                className={`p-2 flex items-center gap-2 hover:bg-muted/50 cursor-pointer ${
                                  isSelected ? 'bg-muted' : ''
                                }`}
                                onClick={() => handleSeleccionarCliente(cliente)}
                              >
                                <Checkbox checked={isSelected} />
                                <div>
                                  <p className="font-medium">{cliente.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                                  <div className="flex gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">{cliente.distrito}</Badge>
                                    {cliente.barrio && (
                                      <Badge variant="outline" className="text-xs">{cliente.barrio}</Badge>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <ListFilter className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                          <p className="text-sm text-muted-foreground text-center">
                            No hay clientes que coincidan con el filtro
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
                
                {/* Right column: Selected clients */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Clientes seleccionados</Label>
                    <Badge>{clientesSeleccionados.length}</Badge>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-2 bg-muted/50 border-b flex justify-between items-center">
                      <span className="font-medium text-sm">Orden de recogida</span>
                      {clientesSeleccionados.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setClientesSeleccionados([])}
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                    
                    <ScrollArea className="h-[300px]">
                      {clientesSeleccionados.length > 0 ? (
                        <ul className="divide-y">
                          {clientesSeleccionados.map((cliente, index) => (
                            <li key={cliente.id} className="p-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge>{cliente.orden}</Badge>
                                <div>
                                  <p className="font-medium">{cliente.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  disabled={index === 0}
                                  onClick={() => handleMoveClienteUp(index)}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  >
                                    <path d="m18 15-6-6-6 6"/>
                                  </svg>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  disabled={index === clientesSeleccionados.length - 1}
                                  onClick={() => handleMoveClienteDown(index)}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  >
                                    <path d="m6 9 6 6 6-6"/>
                                  </svg>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveCliente(cliente.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <Route className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                          <p className="text-sm text-muted-foreground text-center">
                            Selecciona clientes para crear la ruta
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCrearRuta}
              disabled={clientesSeleccionados.length === 0 || !nombreRuta}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Crear Ruta Personalizada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasPersonalizadas;
