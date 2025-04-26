import React, { useState } from "react";
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
  DialogTrigger,
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
import type { Ruta } from "@/types";
import { 
  Calendar, 
  Check, 
  Clock, 
  FilePlus2, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  MapPin, 
  PenLine, 
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

type RutaFormData = {
  nombre: string;
  distrito: string;
  fecha: string;
  hora: string;
  recogedores: string;
  barrios: string[];
  clientes: { id: string, nombre: string, direccion: string }[];
  completada: boolean;
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: number;
  frecuencia: string;
};

const RutasDistritos = () => {
  const { rutas, loading, addRuta, updateRuta, deleteRuta, completeRuta, updateRutaRecogida } = useRutas();
  const { usuarios } = useUsuarios();
  const [isAddingRuta, setIsAddingRuta] = useState(false);
  const [isEditingRuta, setIsEditingRuta] = useState(false);
  const [isCompletingRuta, setIsCompletingRuta] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [currentTab, setCurrentTab] = useState("pendientes");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [litrosTotales, setLitrosTotales] = useState<number>(0);
  // Add missing state variables
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
    // Get the clientes from usuarios filtered by distrito
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
  
  const handleCompleteRuta = async () => {
    if (!selectedRuta) return;
    
    await completeRuta(selectedRuta.id, litrosTotales);
    setIsCompletingRuta(false);
    setLitrosTotales(0);
    setSelectedRuta(null);
  };
  
  const handleDeleteRuta = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta ruta?")) {
      await deleteRuta(id);
    }
  };

  const handleClientsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clientesString = e.target.value;
    // Convert the comma-separated client names to array of client objects
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

  const handleUpdateClienteLitros = async (rutaId: string, clienteId: string, litros: number) => {
    if (!selectedRuta) return;
    
    await updateRutaRecogida(rutaId, clienteId, litros);
    
    // Update local state
    setSelectedRuta(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clientes: prev.clientes?.map(c => 
          c.id === clienteId ? { ...c, litros } : c
        )
      };
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
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Crear Ruta
              </Button>
            </DialogTrigger>
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
                    <Label htmlFor="distrito">Distrito</Label>
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
                    <Label htmlFor="fecha">Fecha de la ruta</Label>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora de inicio</Label>
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      value={formData.hora}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la ruta</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Ruta Centro - 15/05/2025"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recogedores">Personal asignado</Label>
                  <Input
                    id="recogedores"
                    name="recogedores"
                    value={formData.recogedores}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez, María López"
                  />
                </div>
                
                {formData.distrito && (
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <Label>Clientes en el distrito ({clientesPorDistrito[formData.distrito] || 0})</Label>
                    <ClientesRutaList
                      clientes={usuarios
                        .filter(u => u.distrito === formData.distrito)
                        .map(u => ({
                          id: u.id,
                          nombre: u.nombre,
                          direccion: u.direccion || ''
                        }))}
                      onUpdateLitros={() => {}}
                    />
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
                <Button onClick={handleSubmit} className="bg-asram hover:bg-asram-700">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Activas
            </CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutas.filter(r => !r.completada).length}</div>
            <p className="text-xs text-muted-foreground">
              rutas pendientes de realizar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Distritos Cubiertos
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Litros Totales Recogidos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rutas.reduce((total, ruta) => total + (ruta.litrosTotales || 0), 0)}L
            </div>
            <p className="text-xs text-muted-foreground">
              litros recogidos en todas las rutas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
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
                <SelectTrigger className="w-[180px]">
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre de la ruta</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Personal asignado</TableHead>
                    <TableHead>Nº Clientes</TableHead>
                    {currentTab === "completadas" && <TableHead>Litros recogidos</TableHead>}
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRutas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={currentTab === "completadas" ? 8 : 7} className="text-center">
                        No hay rutas {currentTab === "pendientes" ? "pendientes" : "completadas"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedRutas.map((ruta) => (
                      <TableRow key={ruta.id}>
                        <TableCell className="font-medium">{ruta.nombre}</TableCell>
                        <TableCell>{ruta.distrito}</TableCell>
                        <TableCell>
                          {ruta.fecha 
                            ? new Date(ruta.fecha).toLocaleDateString() 
                            : "No programada"}
                        </TableCell>
                        <TableCell>{ruta.hora}</TableCell>
                        <TableCell>{ruta.recogedores}</TableCell>
                        <TableCell>{ruta.clientes?.length || clientesPorDistrito[ruta.distrito] || 0}</TableCell>
                        {currentTab === "completadas" && (
                          <TableCell>{ruta.litrosTotales || 0}L</TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1">
                            {currentTab === "pendientes" ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleOpenEditDialog(ruta)}
                                >
                                  <PenLine className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleOpenCompleteDialog(ruta)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleDeleteRuta(ruta.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {displayedRutas.length} rutas {currentTab === "pendientes" ? "pendientes" : "completadas"}
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
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
            
            {formData.distrito && (
              <div className="space-y-2">
                <Label>Clientes en el distrito ({clientesPorDistrito[formData.distrito] || 0})</Label>
                <div className="h-32 overflow-y-auto border rounded-md p-2">
                  <ul className="space-y-1">
                    {usuarios
                      .filter(u => u.distrito === formData.distrito)
                      .map((cliente) => (
                        <li key={cliente.id} className="text-sm">
                          {cliente.nombre} - {cliente.direccion}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
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
              className="bg-asram hover:bg-asram-700"
              onClick={handleSubmit}
            >
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompletingRuta} onOpenChange={setIsCompletingRuta}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Completar ruta</DialogTitle>
            <DialogDescription>
              Registra los litros recogidos en cada ubicación
            </DialogDescription>
          </DialogHeader>
          
          {selectedRuta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4">
                <div>
                  <p className="text-sm font-medium">Nombre de la ruta:</p>
                  <p className="text-lg">{selectedRuta.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Distrito:</p>
                  <p className="text-lg">{selectedRuta.distrito}</p>
                </div>
              </div>

              <ClientesRutaList
                clientes={selectedRuta.clientes || []}
                onUpdateLitros={(clienteId, litros) => 
                  handleUpdateClienteLitros(selectedRuta.id, clienteId, litros)
                }
                onComplete={() => handleCompleteRuta()}
                showComplete={true}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasDistritos;
