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

type RutaFormData = {
  nombre: string;
  distrito: string;
  fecha: string;
  hora: string;
  recogedores: string;
  barrios: string[];
  clientes: string[];
  completada: boolean;
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: number;
  frecuencia: string;
};

const RutasDistritos = () => {
  const { rutas, loading, addRuta, updateRuta, deleteRuta, completeRuta } = useRutas();
  const { usuarios } = useUsuarios();
  const [isAddingRuta, setIsAddingRuta] = useState(false);
  const [isEditingRuta, setIsEditingRuta] = useState(false);
  const [isCompletingRuta, setIsCompletingRuta] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [currentTab, setCurrentTab] = useState("pendientes");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [litrosTotales, setLitrosTotales] = useState<number>(0);
  
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
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear nueva ruta</DialogTitle>
                <DialogDescription>
                  Programa una ruta de recogida para un distrito completo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="nombre">Nombre de la ruta</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Ruta Centro - 15/05/2025"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="barrios">Barrios a recoger</Label>
                  <Input
                    id="barrios"
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
                  <Label htmlFor="clientes">Clientes a recoger</Label>
                  <Input
                    id="clientes"
                    name="clientes"
                    value={formData.clientes.join(", ")}
                    onChange={(e) => {
                      const value = e.target.value.split(", ").map((cliente) => cliente.trim());
                      setFormData({
                        ...formData,
                        clientes: value
                      });
                    }}
                    placeholder="Ej: Cliente 1, Cliente 2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="completada">Ruta completada</Label>
                  <Input
                    id="completada"
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
                  <Label htmlFor="puntosRecogida">Puntos de recogida</Label>
                  <Input
                    id="puntosRecogida"
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
                  <Label htmlFor="distanciaTotal">Distancia total</Label>
                  <Input
                    id="distanciaTotal"
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
                  <Label htmlFor="tiempoEstimado">Tiempo estimado</Label>
                  <Input
                    id="tiempoEstimado"
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
                  <Label htmlFor="frecuencia">Frecuencia</Label>
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
                    setIsAddingRuta(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-asram hover:bg-asram-700"
                  onClick={handleSubmit}
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
                value={formData.clientes.join(", ")}
                onChange={(e) => {
                  const value = e.target.value.split(", ").map((cliente) => cliente.trim());
                  setFormData({
                    ...formData,
                    clientes: value
                  });
                }}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Completar ruta</DialogTitle>
            <DialogDescription>
              Registra los litros totales de aceite recogidos en esta ruta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Nombre de la ruta:</p>
                <p>{selectedRuta?.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Distrito:</p>
                <p>{selectedRuta?.distrito}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Fecha:</p>
                <p>{selectedRuta?.fecha 
                  ? new Date(selectedRuta.fecha).toLocaleDateString() 
                  : "No programada"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Hora:</p>
                <p>{selectedRuta?.hora}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Clientes visitados:</p>
              <p>{selectedRuta?.clientes?.length || clientesPorDistrito[selectedRuta?.distrito || ""] || 0}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="litrosTotales">Litros totales recogidos</Label>
              <Input
                id="litrosTotales"
                name="litrosTotales"
                type="number"
                value={litrosTotales}
                onChange={handleLitrosChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCompletingRuta(false);
                setLitrosTotales(0);
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-asram hover:bg-asram-700"
              onClick={handleCompleteRuta}
            >
              Completar Ruta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasDistritos;
