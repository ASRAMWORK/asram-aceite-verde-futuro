
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
  MapPin, 
  Plus, 
  Route, 
  Search, 
  Trash2, 
  User
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

const RutasDistritos = () => {
  const { rutas, addRuta, loading: rutasLoading, getRutasByTipo, deleteRuta } = useRutas();
  const { clientes, loading: clientesLoading, getDistritosUnicos, getBarriosUnicos } = useClientes();
  const { voluntarios, loading: voluntariosLoading } = useVoluntarios();
  
  // UI states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroDistrito, setFiltroDistrito] = useState('todos');
  
  // Form states
  const [nombreRuta, setNombreRuta] = useState('');
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('');
  const [barrioSeleccionado, setBarrioSeleccionado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [horaSeleccionada, setHoraSeleccionada] = useState('08:00');
  const [recogedorSeleccionado, setRecogedorSeleccionado] = useState('');
  const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState('semanal');
  
  const distritos = getDistritosUnicos();
  const barrios = getBarriosUnicos(distritoSeleccionado || undefined);

  // Filter routes by district and search term
  const rutasDistritos = getRutasByTipo('distrito').filter(ruta => {
    const matchesSearchTerm = ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             ruta.distrito.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistritoFiltro = filtroDistrito === 'todos' || ruta.distrito === filtroDistrito;
    
    return matchesSearchTerm && matchesDistritoFiltro;
  });

  // Filter clients by selected distrito/barrio
  const clientesFiltrados = clientes.filter(cliente => {
    if (!distritoSeleccionado) return false;
    if (cliente.distrito !== distritoSeleccionado) return false;
    if (barrioSeleccionado && cliente.barrio !== barrioSeleccionado) return false;
    return true;
  });

  const handleCrearRuta = async () => {
    if (!nombreRuta) {
      toast.error('Debe asignar un nombre a la ruta');
      return;
    }
    
    if (clientesFiltrados.length === 0) {
      toast.error('No hay clientes en el distrito/barrio seleccionado');
      return;
    }
    
    if (!fechaSeleccionada || !horaSeleccionada) {
      toast.error('Seleccione fecha y hora para la ruta');
      return;
    }
    
    const clientesRuta = clientesFiltrados.map((cliente, index) => ({
      id: cliente.id,
      nombre: cliente.nombre || '',
      direccion: cliente.direccion || '',
      barrio: cliente.barrio || '',
      orden: index + 1,
      litrosEstimados: cliente.litrosEstimados || 0
    }));
    
    await addRuta({
      nombre: nombreRuta,
      distrito: distritoSeleccionado,
      barrios: barrioSeleccionado ? [barrioSeleccionado] : [],
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
      tipo: 'distrito'
    });
    
    setIsDialogOpen(false);
    resetForm();
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
  
  const resetForm = () => {
    setNombreRuta('');
    setDistritoSeleccionado('');
    setBarrioSeleccionado('');
    setFechaSeleccionada(new Date().toISOString().slice(0, 10));
    setHoraSeleccionada('08:00');
    setRecogedorSeleccionado('');
    setFrecuenciaSeleccionada('semanal');
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
          <h2 className="text-3xl font-bold tracking-tight">Rutas por Distrito</h2>
          <p className="text-muted-foreground">
            Gestiona las rutas de recogida por distritos de la ciudad.
          </p>
        </div>
        <Button 
          className="bg-[#EE970D] hover:bg-[#d88a0c] text-white" 
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Ruta por Distrito
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
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
            <SelectTrigger className="w-[180px] border-[#EE970D]/20 focus:ring-[#EE970D]/20">
              <SelectValue placeholder="Filtrar por distrito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los distritos</SelectItem>
              {distritos.map(distrito => (
                <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-[#EE970D]/10 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#EE970D]/5 to-transparent">
          <CardTitle>Listado de Rutas por Distrito</CardTitle>
          <CardDescription>
            {rutasDistritos.length} rutas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rutasDistritos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Distrito</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasDistritos.map((ruta) => (
                  <TableRow key={ruta.id} className="hover:bg-[#EE970D]/5">
                    <TableCell className="font-medium">{ruta.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#EE970D]" />
                        {ruta.distrito}
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
              <h3 className="mt-2 text-lg font-medium">No hay rutas disponibles</h3>
              <p className="mt-1 text-muted-foreground">
                Crea una nueva ruta por distrito para empezar.
              </p>
              <Button className="mt-4 bg-[#EE970D] hover:bg-[#d88a0c]" onClick={() => setIsDialogOpen(true)}>
                Crear primera ruta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Route Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center gap-2">
              <Route className="h-5 w-5" />
              Crear Ruta por Distrito
            </DialogTitle>
            <DialogDescription>
              Completa los detalles para crear una nueva ruta por distrito.
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
                  placeholder="Ej: Ruta Centro - Lunes"
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Select value={distritoSeleccionado} onValueChange={setDistritoSeleccionado}>
                  <SelectTrigger className="border-[#EE970D]/20 focus:ring-[#EE970D]/20">
                    <SelectValue placeholder="Selecciona un distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {distritos.map(distrito => (
                      <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barrio">Barrio (opcional)</Label>
                <Select 
                  value={barrioSeleccionado} 
                  onValueChange={setBarrioSeleccionado}
                  disabled={!distritoSeleccionado}
                >
                  <SelectTrigger className="border-[#EE970D]/20 focus:ring-[#EE970D]/20">
                    <SelectValue placeholder={distritoSeleccionado ? "Selecciona un barrio" : "Primero selecciona distrito"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los barrios</SelectItem>
                    {barrios.map(barrio => (
                      <SelectItem key={barrio} value={barrio}>{barrio}</SelectItem>
                    ))}
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
            
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center">
                <Label>Clientes en la ruta</Label>
                <Badge variant="outline" className="bg-[#EE970D]/10 text-[#EE970D] border-[#EE970D]/30">{clientesFiltrados.length} clientes</Badge>
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-[#EE970D]/20 rounded-md p-2">
                {clientesFiltrados.length > 0 ? (
                  <ul className="divide-y divide-[#EE970D]/10">
                    {clientesFiltrados.map((cliente, index) => (
                      <li key={cliente.id} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cliente.nombre}</p>
                          <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                          <p className="text-xs text-muted-foreground">{cliente.barrio}</p>
                        </div>
                        <Badge variant="outline" className="bg-[#EE970D]/10 text-[#EE970D] border-[#EE970D]/30">{index + 1}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {distritoSeleccionado 
                      ? "No hay clientes en el distrito/barrio seleccionado" 
                      : "Seleccione un distrito para ver los clientes"}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCrearRuta}
              disabled={clientesFiltrados.length === 0 || !nombreRuta || !distritoSeleccionado}
              className="bg-[#EE970D] hover:bg-[#d88a0c] text-white"
            >
              Crear Ruta
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
                  Detalles de la ruta por distrito
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Distrito</h3>
                    <p className="text-[#EE970D] font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedRuta.distrito}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Barrios</h3>
                    <p>{selectedRuta.barrios?.join(', ') || 'Todos'}</p>
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
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#EE970D]/5">
                          <TableHead>Orden</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Barrio</TableHead>
                          <TableHead className="text-right">Litros Est.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRuta.clientes?.map((cliente: any) => (
                          <TableRow key={cliente.id} className="hover:bg-[#EE970D]/5">
                            <TableCell className="font-medium">{cliente.orden}</TableCell>
                            <TableCell>{cliente.nombre}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{cliente.direccion}</TableCell>
                            <TableCell>{cliente.barrio}</TableCell>
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

export default RutasDistritos;
