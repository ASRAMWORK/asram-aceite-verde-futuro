import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRutas } from "@/hooks/useRutas";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useRecogidas } from "@/hooks/useRecogidas";
import type { Ruta } from "@/types";
import { 
  Calendar, 
  Check, 
  Clock, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  MapPin, 
  PenLine, 
  Plus, 
  Route, 
  Trash2, 
  Users 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distritos } from "@/data/madridDistritos";
import { toast } from 'sonner';
import { ClientesRutaList } from "./ClientesRutaList";
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

type RutaFormData = {
  nombre: string;
  distrito: string;
  fecha: string;
  hora: string;
  recogedores: string;
  barrios: string[];
  clientes: { id: string, nombre: string, direccion: string, litros?: number }[];
  completada: boolean;
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: number;
  frecuencia: string;
};

const RutasDistritos = () => {
  const { rutas, loading, addRuta, updateRuta, deleteRuta, completeRuta, updateRutaRecogida } = useRutas();
  const { usuarios } = useUsuarios();
  const { recogidas, addRecogida: addRecogidaToHistory, getTotalLitrosRecogidos } = useRecogidas();
  const [isAddingRuta, setIsAddingRuta] = useState(false);
  const [isEditingRuta, setIsEditingRuta] = useState(false);
  const [isCompletingRuta, setIsCompletingRuta] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [currentTab, setCurrentTab] = useState("pendientes");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [litrosTotales, setLitrosTotales] = useState<number>(0);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<RutaFormData>({
    nombre: "",
    distrito: "",
    fecha: "",
    hora: "",
    recogedores: "",
    barrios: [],
    clientes: [],
    completada: false,
    puntosRecogida: 0,
    distanciaTotal: 0,
    tiempoEstimado: 0,
    frecuencia: 'semanal'
  });

  const filteredRutas = currentTab === "pendientes"
    ? rutas.filter(r => !r.completada)
    : rutas.filter(r => r.completada);
  
  const displayedRutas = filterDistrito
    ? filteredRutas.filter(r => r.distrito === filterDistrito)
    : filteredRutas;
  
  const clientesPorDistrito = distritos.reduce((acc, distrito) => {
    const count = usuarios.filter(u => u.distrito === distrito).length;
    acc[distrito] = count;
    return acc;
  }, {} as Record<string, number>);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === "distrito") {
      setFormData({
        ...formData,
        distrito: value,
        nombre: `Ruta ${value} - ${new Date().toLocaleDateString()}`
      });
    }
  };
  
  const handleLitrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLitrosTotales(parseInt(e.target.value) || 0);
  };
  
  const handleOpenEditDialog = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setFormData({
      nombre: ruta.nombre || "",
      distrito: ruta.distrito || "",
      fecha: ruta.fecha ? format(new Date(ruta.fecha), "yyyy-MM-dd") : "",
      hora: ruta.hora || "",
      recogedores: ruta.recogedores || "",
      barrios: ruta.barrios || [],
      clientes: ruta.clientes || [],
      completada: ruta.completada || false,
      puntosRecogida: ruta.puntosRecogida || 0,
      distanciaTotal: ruta.distanciaTotal || 0,
      tiempoEstimado: ruta.tiempoEstimado || 0,
      frecuencia: ruta.frecuencia || 'semanal'
    });
    
    setIsEditingRuta(true);
  };
  
  const handleOpenCompleteDialog = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setLitrosTotales(0);
    setIsCompletingRuta(true);
  };
  
  const resetForm = () => {
    setFormData({
      nombre: "",
      distrito: "",
      fecha: "",
      hora: "",
      recogedores: "",
      barrios: [],
      clientes: [],
      completada: false,
      puntosRecogida: 0,
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: 'semanal'
    });
    setSelectedRuta(null);
  };
  
  const handleAddCliente = () => {
    const clientesList = usuarios.filter(u => u.distrito === formData.distrito);
    const clientesFormateados = selectedClientes.map(id => {
      const cliente = clientesList.find(c => c.id === id);
      return {
        id: cliente?.id || '',
        nombre: cliente?.nombre || '',
        direccion: cliente?.direccion || ''
      };
    });

    setFormData({
      ...formData,
      clientes: clientesFormateados
    });
  };

  const handleRemoveCliente = (index: number) => {
    const rutaClientes = [...(formData.clientes || [])];
    rutaClientes.splice(index, 1);
    setFormData({
      ...formData,
      clientes: rutaClientes
    });
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.distrito) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const dataToSubmit: Partial<Ruta> = {
      nombre: formData.nombre,
      distrito: formData.distrito,
      barrios: formData.barrios || [],
      fecha: formData.fecha ? new Date(formData.fecha) : undefined,
      hora: formData.hora || "",
      recogedores: formData.recogedores || "",
      clientes: formData.clientes || [],
      completada: formData.completada || false,
      puntosRecogida: 0,
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: 'semanal',
      createdAt: new Date()
    };
    
    if (isEditingRuta && selectedRuta) {
      await updateRuta(selectedRuta.id, dataToSubmit);
      setIsEditingRuta(false);
    } else {
      await addRuta(dataToSubmit as Omit<Ruta, 'id'>);
      setIsAddingRuta(false);
    }
    
    resetForm();
  };
  
  const handleUpdateClienteLitros = async (rutaId: string, clienteId: string, litros: number) => {
    if (!selectedRuta) return;
    
    await updateRutaRecogida(rutaId, clienteId, litros);
    
    setSelectedRuta(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clientes: prev.clientes?.map(c => 
          c.id === clienteId ? { ...c, litros } : c
        )
      };
    });
    
    const updatedClientes = selectedRuta.clientes?.map(c => 
      c.id === clienteId ? { ...c, litros } : c
    ) || [];
    
    const nuevoTotal = updatedClientes.reduce((total, c) => total + (c.litros || 0), 0);
    setLitrosTotales(nuevoTotal);
  };

  const handleCompleteRuta = async () => {
    if (!selectedRuta) return;
    
    const totalLitros = selectedRuta.clientes?.reduce(
      (sum, cliente) => sum + (cliente.litros || 0), 
      0
    ) || litrosTotales;
    
    if (selectedRuta.clientes) {
      for (const cliente of selectedRuta.clientes) {
        if (cliente.litros && cliente.litros > 0) {
          await addRecogidaToHistory({
            clienteId: cliente.id,
            nombreLugar: cliente.nombre,
            direccion: cliente.direccion,
            distrito: selectedRuta.distrito,
            fecha: selectedRuta.fecha,
            litrosRecogidos: cliente.litros,
            completada: true,
            estado: 'programado'
          });
        }
      }
    }
    
    await completeRuta(selectedRuta.id, totalLitros);
    setIsCompletingRuta(false);
    setLitrosTotales(0);
    setSelectedRuta(null);
    
    toast.success(`Ruta completada correctamente con ${totalLitros}L recogidos`);
  };

  const handleDeleteRuta = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta ruta?")) {
      await deleteRuta(id);
      toast.success("Ruta eliminada correctamente");
    }
  };

  const handleClientsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clientesString = e.target.value;
    const clientNames = clientesString.split(",").map(name => name.trim()).filter(name => name !== "");
    const clientesObjetos = clientNames.map((nombre, index) => ({
      id: `temp-${index}`,
      nombre,
      direccion: ''
    }));
    
    setFormData({
      ...formData,
      clientes: clientesObjetos
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas por Distritos</h2>
          <p className="text-muted-foreground">
            Organiza y gestiona las rutas de recogida por distritos
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingRuta} onOpenChange={setIsAddingRuta}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Crear Ruta
            </Button>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Crear nueva ruta</DialogTitle>
                <DialogDescription>
                  Programa una ruta de recogida para un distrito
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito" className="font-medium">Distrito</Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={(value) => handleSelectChange("distrito", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {distritos.map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito} ({clientesPorDistrito[distrito] || 0} clientes)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fecha" className="font-medium">Fecha de la ruta</Label>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hora" className="font-medium">Hora de inicio</Label>
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      value={formData.hora}
                      onChange={handleInputChange}
                      className="bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="font-medium">Nombre de la ruta</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Ruta Centro - 15/05/2025"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recogedores" className="font-medium">Personal asignado</Label>
                  <Input
                    id="recogedores"
                    name="recogedores"
                    value={formData.recogedores}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez, María López"
                    className="bg-white"
                  />
                </div>
                
                {formData.distrito && (
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold">Clientes en el distrito ({clientesPorDistrito[formData.distrito] || 0})</Label>
                      <Badge className="bg-purple-100 text-purple-800">{selectedClientes.length} seleccionados</Badge>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto border rounded bg-white">
                      <Table>
                        <TableHeader className="bg-slate-50 sticky top-0">
                          <TableRow>
                            <TableHead className="w-[50px]">✓</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Dirección</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usuarios
                            .filter(u => u.distrito === formData.distrito)
                            .map((cliente) => (
                              <TableRow 
                                key={cliente.id}
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => {
                                  const isSelected = selectedClientes.includes(cliente.id);
                                  if (isSelected) {
                                    setSelectedClientes(selectedClientes.filter(id => id !== cliente.id));
                                  } else {
                                    setSelectedClientes([...selectedClientes, cliente.id]);
                                  }
                                }}
                              >
                                <TableCell>
                                  <div className={`h-4 w-4 rounded border ${
                                    selectedClientes.includes(cliente.id) 
                                      ? 'bg-purple-600 border-purple-600' 
                                      : 'border-gray-300'
                                  }`}>
                                    {selectedClientes.includes(cliente.id) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                <TableCell>{cliente.direccion || 'Sin dirección'}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={handleAddCliente}
                        disabled={selectedClientes.length === 0}
                      >
                        Añadir seleccionados
                      </Button>
                    </div>
                  </div>
                )}
                
                {formData.clientes.length > 0 && (
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <Label className="text-lg font-semibold mb-4 block">Clientes seleccionados ({formData.clientes.length})</Label>
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.clientes.map((cliente, index) => (
                          <TableRow key={cliente.id}>
                            <TableCell className="font-medium">{cliente.nombre}</TableCell>
                            <TableCell>{cliente.direccion}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveCliente(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddingRuta(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={formData.clientes.length === 0}
                >
                  Crear Ruta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => alert("Exportando rutas a Excel. Esta función estará disponible próximamente.")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => alert("Exportando rutas a PDF. Esta función estará disponible próximamente.")}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Activas
            </CardTitle>
            <Route className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutas.filter(r => !r.completada).length}</div>
            <p className="text-xs text-muted-foreground">
              rutas pendientes de realizar
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Distritos Cubiertos
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(rutas.map(r => r.distrito)).size} / {distritos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              distritos con rutas programadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Litros Totales Recogidos
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalLitrosRecogidos()}L
            </div>
            <p className="text-xs text-muted-foreground">
              litros recogidos en todas las rutas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Listado de Rutas</CardTitle>
          <CardDescription>
            Gestiona las rutas de recogida por distrito
          </CardDescription>
          
          <div className="flex justify-between items-center mt-4">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="completadas">Completadas</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-medium">Nombre de la ruta</TableHead>
                    <TableHead className="font-medium">Distrito</TableHead>
                    <TableHead className="font-medium">Fecha</TableHead>
                    <TableHead className="font-medium">Hora</TableHead>
                    <TableHead className="font-medium">Personal asignado</TableHead>
                    <TableHead className="font-medium">Nº Clientes</TableHead>
                    {currentTab === "completadas" && <TableHead className="font-medium">Litros recogidos</TableHead>}
                    <TableHead className="font-medium">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRutas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={currentTab === "completadas" ? 8 : 7} className="text-center py-8 text-muted-foreground">
                        No hay rutas {currentTab === "pendientes" ? "pendientes" : "completadas"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedRutas.map((ruta) => (
                      <TableRow key={ruta.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{ruta.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-50">
                            {ruta.distrito}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ruta.fecha 
                            ? format(new Date(ruta.fecha), "dd/MM/yyyy")
                            : "No programada"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {ruta.hora || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{ruta.recogedores}</TableCell>
                        <TableCell className="font-medium">
                          {ruta.clientes?.length || clientesPorDistrito[ruta.distrito] || 0}
                        </TableCell>
                        {currentTab === "completadas" && (
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800">
                              {ruta.litrosTotales || 0}L
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1">
                            {currentTab === "pendientes" ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenEditDialog(ruta)}
                                  className="h-8 px-2"
                                >
                                  <PenLine className="h-3.5 w-3.5" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenCompleteDialog(ruta)}
                                  className="h-8 px-2 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span className="sr-only">Completar</span>
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteRuta(ruta.id)}
                                className="h-8 px-2 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditingRuta} onOpenChange={setIsEditingRuta}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar ruta</DialogTitle>
            <DialogDescription>
              Modifica los datos de la ruta programada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="distrito-edit">Distrito</Label>
              <Select
                value={formData.distrito}
                onValueChange={(value) => handleSelectChange("distrito", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito} ({clientesPorDistrito[distrito] || 0} clientes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nombre-edit">Nombre de la ruta</Label>
              <Input
                id="nombre-edit"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Ruta Centro - 15/05/2025"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-edit">Fecha de la ruta</Label>
                <Input
                  id="fecha-edit"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora-edit">Hora de inicio</Label>
                <Input
                  id="hora-edit"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recogedores-edit">Personal asignado</Label>
              <Input
                id="recogedores-edit"
                name="recogedores"
                value={formData.recogedores}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez, María López"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barrios-edit">Barrios a recoger</Label>
              <Input
                id="barrios-edit"
                name="barrios"
                value={formData.barrios.join(", ")}
                onChange={(e) => {
                  const value = e.target.value.split(", ").map((barrio) => barrio.trim());
                  setFormData({
                    ...formData,
                    barrios: value
                  });
                }}
                placeholder="Ej: Barrio 1, Barrio 2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientes-edit">Clientes a recoger</Label>
              <Input
                id="clientes-edit"
                name="clientes"
                value={formData.clientes.map(c => c.nombre).join(", ")}
                onChange={handleClientsInputChange}
                placeholder="Ej: Cliente 1, Cliente 2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completada-edit">Ruta completada</Label>
              <Input
                id="completada-edit"
                name="completada"
                type="checkbox"
                checked={formData.completada}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    completada: e.target.checked
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="puntosRecogida-edit">Puntos de recogida</Label>
              <Input
                id="puntosRecogida-edit"
                name="puntosRecogida"
                type="number"
                value={formData.puntosRecogida}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    puntosRecogida: parseInt(e.target.value) || 0
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distanciaTotal-edit">Distancia total</Label>
              <Input
                id="distanciaTotal-edit"
                name="distanciaTotal"
                type="number"
                value={formData.distanciaTotal}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    distanciaTotal: parseInt(e.target.value) || 0
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tiempoEstimado-edit">Tiempo estimado</Label>
              <Input
                id="tiempoEstimado-edit"
                name="tiempoEstimado"
                type="number"
                value={formData.tiempoEstimado}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tiempoEstimado: parseInt(e.target.value) || 0
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frecuencia-edit">Frecuencia</Label>
              <Select
                value={formData.frecuencia}
                onValueChange={(value) => setFormData({
                  ...formData,
                  frecuencia: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingRuta(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCompletingRuta} onOpenChange={setIsCompletingRuta}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Completar Ruta</DialogTitle>
            <DialogDescription>
              Registra las cantidades recogidas para cada cliente antes de finalizar la ruta
            </DialogDescription>
          </DialogHeader>
          
          {selectedRuta && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Ruta:</h3>
                  <p className="font-medium">{selectedRuta.nombre}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Distrito:</h3>
                  <p>{selectedRuta.distrito}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Fecha:</h3>
                  <p>{selectedRuta.fecha ? format(new Date(selectedRuta.fecha), "dd/MM/yyyy") : "No programada"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Personal asignado:</h3>
                  <p>{selectedRuta.recogedores || "No asignado"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Clientes en la ruta</h3>
                
                {selectedRuta.clientes && selectedRuta.clientes.length > 0 ? (
                  <ClientesRutaList
                    clientes={selectedRuta.clientes}
                    onUpdateLitros={(clienteId, litros) => 
                      handleUpdateClienteLitros(selectedRuta.id, clienteId, litros)
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No hay clientes asignados a esta ruta</p>
                )}
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-medium">Total litros recogidos:</h3>
                      <p className="text-2xl font-bold">{litrosTotales}L</p>
                    </div>
                    <Button
                      onClick={handleCompleteRuta}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Finalizar Ruta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasDistritos;
