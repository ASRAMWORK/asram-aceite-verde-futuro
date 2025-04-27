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
  TableFooter,
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
import type { Ruta, Recogida } from "@/types";
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
  Users,
  Eye
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
  clientes: { 
    id: string; 
    nombre: string; 
    direccion: string; 
    litros?: number;
    numViviendas?: number;
    numContenedores?: number;
  }[];
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
        direccion: cliente?.direccion || '',
        numViviendas: cliente?.numViviendas || 0,
        numContenedores: cliente?.numContenedores || 0
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
    
    const nuevaRuta: Omit<Ruta, "id"> = {
      nombre: formData.nombre,
      distrito: formData.distrito,
      barrios: formData.barrios || [],
      fecha: formData.fecha ? new Date(formData.fecha) : new Date(),
      hora: formData.hora || "",
      recogedores: formData.recogedores || "",
      clientes: formData.clientes || [],
      completada: formData.completada || false,
      puntosRecogida: 0,
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: 'semanal',
      puntos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (isEditingRuta && selectedRuta) {
      await updateRuta(selectedRuta.id, nuevaRuta);
      setIsEditingRuta(false);
    } else {
      await addRuta(nuevaRuta as Omit<Ruta, 'id'>);
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
    
    const nuevoTotal = selectedRuta.clientes?.reduce(
      (total, c) => total + (c.id === clienteId ? litros : (c.litros || 0)), 
      0
    ) || 0;
    
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
          const nuevaRecogida: Partial<Omit<Recogida, "id">> = {
            cliente: cliente.id,
            direccionRecogida: cliente.direccion,
            fechaRecogida: selectedRuta.fecha,
            horaRecogida: selectedRuta.hora || "",
            cantidadAproximada: cliente.litros,
            tipoAceite: "usado",
            nombreContacto: cliente.nombre,
            telefonoContacto: cliente.telefono || "",
            emailContacto: cliente.email || "",
            notasAdicionales: "",
            estadoRecogida: "pendiente",
            distrito: selectedRuta.distrito,
            barrio: selectedRuta.barrios ? selectedRuta.barrios[0] : "",
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await addRecogidaToHistory(nuevaRecogida);
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

  const handleCrearRuta = async () => {
    if (!nombreRuta) {
      toast.error('Debe asignar un nombre a la ruta');
      return;
    }
    
    if (puntosSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un punto verde');
      return;
    }
    
    const nuevaRuta: Omit<Ruta, "id"> = {
      nombre: nombreRuta,
      distrito: puntosSeleccionados[0]?.distrito || 'Varios',
      barrios: Array.from(new Set(puntosSeleccionados.map(p => p.barrio))),
      fecha: new Date(fechaRecogida),
      clientes: puntosSeleccionados.map(p => ({
        id: p.id,
        nombre: `${p.direccion} (${p.barrio})`,
        direccion: p.direccion,
        litros: 0
      })),
      puntosRecogida: puntosSeleccionados.length,
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: 'unica',
      puntos: [],
      completada: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await addRuta(nuevaRuta);
    setIsOpen(false);
    setNombreRuta("");
    setFechaRecogida(format(new Date(), "yyyy-MM-dd"));
    setPuntosSeleccionados([]);
    toast.success('Ruta creada correctamente');
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
        <Button 
          onClick={() => setIsAddingRuta(true)}
          className="bg-[#ee970d] hover:bg-[#e08500] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Crear Ruta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Activas
            </CardTitle>
            <Route className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutas.filter(r => !r.completada).length}</div>
            <p className="text-xs text-muted-foreground">
              rutas pendientes de realizar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Distritos Cubiertos
            </CardTitle>
            <MapPin className="h-4 w-4 text-[#ee970d]" />
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
        <Card className="bg-white shadow-sm border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Litros Totales Recogidos
            </CardTitle>
            <Users className="h-4 w-4 text-[#ee970d]" />
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
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-medium">Nombre de la ruta</TableHead>
                <TableHead className="font-medium">Distrito</TableHead>
                <TableHead className="font-medium">Fecha</TableHead>
                <TableHead className="font-medium">Total Viviendas</TableHead>
                <TableHead className="font-medium">Total Contenedores</TableHead>
                <TableHead className="font-medium">Nº Clientes</TableHead>
                {currentTab === "completadas" && (
                  <TableHead className="font-medium">Litros recogidos</TableHead>
                )}
                <TableHead className="font-medium">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRutas.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={currentTab === "completadas" ? 8 : 7} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay rutas {currentTab === "pendientes" ? "pendientes" : "completadas"}
                  </TableCell>
                </TableRow>
              ) : (
                displayedRutas.map((ruta) => (
                  <TableRow key={ruta.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{ruta.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#ee970d]/10 text-[#ee970d] border-[#ee970d]">
                        {ruta.distrito}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(ruta.fecha), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-medium">
                      {ruta.clientes?.reduce((sum, c) => sum + (c.numViviendas || 0), 0)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {ruta.clientes?.reduce((sum, c) => sum + (c.numContenedores || 0), 0)}
                    </TableCell>
                    <TableCell>{ruta.clientes?.length || 0}</TableCell>
                    {currentTab === "completadas" && (
                      <TableCell>
                        <Badge className="bg-[#ee970d]">
                          {ruta.litrosTotales || 0}L
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenEditDialog(ruta)}
                          className="h-8 px-2 text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="ml-2">Ver detalles</span>
                        </Button>
                        {currentTab === "pendientes" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenCompleteDialog(ruta)}
                            className="h-8 px-2 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span className="ml-2">Completar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddingRuta} onOpenChange={setIsAddingRuta}>
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
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => alert("Exportando rutas a Excel. Esta función estará disponible próximamente.")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </Button>
        <Button variant="outline" onClick={() => alert("Exportando rutas a PDF. Esta función estará disponible próximamente.")}>
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>
      
      <Dialog open={isCompletingRuta} onOpenChange={setIsCompletingRuta}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Completar Ruta</DialogTitle>
            <DialogDescription>
              Registra las cantidades recogidas para cada cliente
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
                  <p>{format(new Date(selectedRuta.fecha), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Personal asignado:</h3>
                  <p>{selectedRuta.recogedores || "No asignado"}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Clientes en la ruta</h3>
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Viviendas</TableHead>
                      <TableHead>Contenedores</TableHead>
                      <TableHead className="text-right">Litros Recogidos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRuta.clientes?.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                        <TableCell>{cliente.direccion}</TableCell>
                        <TableCell>{cliente.numViviendas || 0}</TableCell>
                        <TableCell>{cliente.numContenedores || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              value={cliente.litros || 0}
                              onChange={(e) => handleUpdateClienteLitros(
                                selectedRuta.id,
                                cliente.id,
                                Number(e.target.value)
                              )}
                              className="w-24 text-right"
                              min={0}
                            />
                            <span className="text-sm font-medium">L</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total litros recogidos:
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-bold text-[#ee970d]">
                          {litrosTotales}L
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCompletingRuta(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCompleteRuta}
                  className="bg-[#ee970d] hover:bg-[#e08500] text-white"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Finalizar Ruta
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasDistritos;
