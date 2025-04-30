
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
  AlertTriangle,
  Calendar, 
  Check, 
  Clock, 
  Eye,
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

const RutasPersonalizadas = () => {
  const { rutas, addRuta, deleteRuta, loading: rutasLoading, getRutasByTipo } = useRutas();
  const { clientes, loading: clientesLoading, getDistritosUnicos, getBarriosUnicos } = useClientes();
  const { voluntarios, loading: voluntariosLoading } = useVoluntarios();
  
  // UI states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<any>(null);
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
  
  const handleVerDetalles = (ruta: any) => {
    setSelectedRuta(ruta);
    setIsDetailDialogOpen(true);
  };
  
  const handleEliminarClick = (ruta: any) => {
    setSelectedRuta(ruta);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmarEliminar = async () => {
    if (selectedRuta) {
      const success = await deleteRuta(selectedRuta.id);
      if (success) {
        toast.success(`Ruta "${selectedRuta.nombre}" eliminada correctamente`);
      }
      setIsDeleteDialogOpen(false);
      setSelectedRuta(null);
    }
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
        <Button className="bg-[#EE970D] hover:bg-[#d88a0c] text-white" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Ruta Personalizada
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar rutas..."
            className="pl-8 border-[#EE970D]/20 focus-visible:ring-[#EE970D]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-[#EE970D]/10 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#EE970D]/5 to-transparent">
          <CardTitle>Listado de Rutas Personalizadas</CardTitle>
          <CardDescription>
            {rutasPersonalizadas.length} rutas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rutasPersonalizadas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
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
                  <TableRow key={ruta.id} className="hover:bg-[#EE970D]/5">
                    <TableCell className="font-medium">{ruta.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#EE970D]" />
                        <span className="truncate max-w-[150px]" title={ruta.distrito}>
                          {ruta.distrito}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{ruta.clientes?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-[#EE970D]" />
                          {ruta.fecha ? format(new Date(ruta.fecha), 'dd/MM/yyyy') : 'Sin programar'}
                        </span>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {ruta.hora}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ruta.completada ? "secondary" : "outline"} className={
                        ruta.completada ? "bg-green-100 text-green-800" : ""
                      }>
                        {ruta.completada ? "Completada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#EE970D]/30 text-[#EE970D] hover:bg-[#EE970D]/10 hover:text-[#EE970D] hover:border-[#EE970D]"
                          onClick={() => handleVerDetalles(ruta)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                          onClick={() => handleEliminarClick(ruta)}
                        >
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
              <Route className="h-12 w-12 mx-auto text-[#EE970D]/40 opacity-20" />
              <h3 className="mt-2 text-lg font-medium">No hay rutas personalizadas</h3>
              <p className="mt-1 text-muted-foreground">
                Crea una nueva ruta personalizada para empezar.
              </p>
              <Button className="mt-4 bg-[#EE970D] hover:bg-[#d88a0c]" onClick={() => setIsDialogOpen(true)}>
                Crear primera ruta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center gap-2">
              <Route className="h-5 w-5" />
              Crear Ruta Personalizada
            </DialogTitle>
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
                  className="border-[#EE970D]/20 focus-visible:ring-[#EE970D]/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frecuencia">Frecuencia</Label>
                <Select value={frecuenciaSeleccionada} onValueChange={setFrecuenciaSeleccionada}>
                  <SelectTrigger className="border-[#EE970D]/20 focus:ring-[#EE970D]/20">
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
                  <Calendar className="mr-2 h-4 w-4 mt-3 text-[#EE970D]" />
                  <Input
                    id="fecha"
                    type="date"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                    className="border-[#EE970D]/20 focus-visible:ring-[#EE970D]/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 mt-3 text-[#EE970D]" />
                  <Input
                    id="hora"
                    type="time"
                    value={horaSeleccionada}
                    onChange={(e) => setHoraSeleccionada(e.target.value)}
                    className="border-[#EE970D]/20 focus-visible:ring-[#EE970D]/20"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recogedor">Recogedor</Label>
              <div className="flex">
                <User className="mr-2 h-4 w-4 mt-3 text-[#EE970D]" />
                <Select value={recogedorSeleccionado} onValueChange={setRecogedorSeleccionado}>
                  <SelectTrigger className="w-full border-[#EE970D]/20 focus:ring-[#EE970D]/20">
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
              <h3 className="font-medium mb-4 text-[#EE970D]">Selecciona los clientes para la ruta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column: Client selection */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Filtrar clientes</Label>
                    <div className="flex gap-2">
                      <Select value={distritoFiltro} onValueChange={setDistritoFiltro}>
                        <SelectTrigger className="w-full border-[#EE970D]/20 focus:ring-[#EE970D]/20">
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
                        <SelectTrigger className="w-full border-[#EE970D]/20 focus:ring-[#EE970D]/20">
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
                        className="pl-8 border-[#EE970D]/20 focus-visible:ring-[#EE970D]/20"
                        value={busquedaCliente}
                        onChange={(e) => setBusquedaCliente(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-md border-[#EE970D]/20">
                    <div className="p-2 bg-[#EE970D]/5 border-b border-[#EE970D]/20 flex justify-between items-center">
                      <span className="font-medium text-sm">Clientes disponibles</span>
                      <Badge variant="outline" className="bg-[#EE970D]/10 text-[#EE970D] border-[#EE970D]/30">{clientesFiltrados.length}</Badge>
                    </div>
                    <ScrollArea className="h-[300px]">
                      {clientesFiltrados.length > 0 ? (
                        <ul className="divide-y divide-[#EE970D]/10">
                          {clientesFiltrados.map(cliente => {
                            const isSelected = clientesSeleccionados.some(c => c.id === cliente.id);
                            return (
                              <li 
                                key={cliente.id} 
                                className={`p-2 flex items-center gap-2 hover:bg-[#EE970D]/10 cursor-pointer ${
                                  isSelected ? 'bg-[#EE970D]/5' : ''
                                }`}
                                onClick={() => handleSeleccionarCliente(cliente)}
                              >
                                <Checkbox 
                                  checked={isSelected} 
                                  className="border-[#EE970D]/30 data-[state=checked]:bg-[#EE970D] data-[state=checked]:border-[#EE970D]"
                                />
                                <div>
                                  <p className="font-medium">{cliente.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                                  <div className="flex gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs border-[#EE970D]/20">{cliente.distrito}</Badge>
                                    {cliente.barrio && (
                                      <Badge variant="outline" className="text-xs border-[#EE970D]/20">{cliente.barrio}</Badge>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <ListFilter className="h-8 w-8 text-[#EE970D]/40 mb-2 opacity-40" />
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
                    <Badge variant="outline" className="bg-[#EE970D]/10 text-[#EE970D] border-[#EE970D]/30">{clientesSeleccionados.length}</Badge>
                  </div>
                  
                  <div className="border rounded-md border-[#EE970D]/20">
                    <div className="p-2 bg-[#EE970D]/5 border-b border-[#EE970D]/20 flex justify-between items-center">
                      <span className="font-medium text-sm">Orden de recogida</span>
                      {clientesSeleccionados.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-[#EE970D] hover:text-[#d88a0c] hover:bg-[#EE970D]/10"
                          onClick={() => setClientesSeleccionados([])}
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                    
                    <ScrollArea className="h-[300px]">
                      {clientesSeleccionados.length > 0 ? (
                        <ul className="divide-y divide-[#EE970D]/10">
                          {clientesSeleccionados.map((cliente, index) => (
                            <li key={cliente.id} className="p-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#EE970D] hover:bg-[#d88a0c]">{cliente.orden}</Badge>
                                <div>
                                  <p className="font-medium">{cliente.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-[#EE970D] hover:text-[#d88a0c] hover:bg-[#EE970D]/10"
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
                                  className="h-8 w-8 text-[#EE970D] hover:text-[#d88a0c] hover:bg-[#EE970D]/10"
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
                          <Route className="h-8 w-8 text-[#EE970D]/40 mb-2 opacity-40" />
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
              className="bg-[#EE970D] hover:bg-[#d88a0c]"
            >
              Crear Ruta Personalizada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedRuta && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#EE970D] flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  {selectedRuta.nombre}
                </DialogTitle>
                <DialogDescription>
                  Detalles de la ruta personalizada
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Distritos</h3>
                    <p className="text-[#EE970D] font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedRuta.distrito}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Barrios</h3>
                    <p>{selectedRuta.barrios?.join(', ') || 'No especificados'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Fecha</h3>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#EE970D]" />
                      {selectedRuta.fecha ? format(new Date(selectedRuta.fecha), 'dd/MM/yyyy') : 'Sin programar'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Hora</h3>
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#EE970D]" />
                      {selectedRuta.hora}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Frecuencia</h3>
                    <p className="capitalize">{selectedRuta.frecuencia}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Estado</h3>
                    <Badge variant={selectedRuta.completada ? "secondary" : "outline"} className={
                      selectedRuta.completada ? "bg-green-100 text-green-800" : ""
                    }>
                      {selectedRuta.completada ? "Completada" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-[#EE970D]">Clientes en la ruta ({selectedRuta.clientes?.length || 0})</h3>
                  
                  <div className="border rounded-md border-[#EE970D]/20">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#EE970D]/5">
                          <TableHead>Orden</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Distrito</TableHead>
                          <TableHead className="text-right">Litros Est.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRuta.clientes?.map((cliente: any) => (
                          <TableRow key={cliente.id} className="hover:bg-[#EE970D]/5">
                            <TableCell className="font-medium">{cliente.orden}</TableCell>
                            <TableCell>{cliente.nombre}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{cliente.direccion}</TableCell>
                            <TableCell>{cliente.distrito}</TableCell>
                            <TableCell className="text-right">{cliente.litrosEstimados || 0} L</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea eliminar la ruta "{selectedRuta?.nombre}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarEliminar}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RutasPersonalizadas;
