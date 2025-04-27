
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRutas } from "@/hooks/useRutas";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Calendar,
  Check,
  Clock,
  FilePlus2,
  FileText,
  Grid3X3,
  Loader2,
  MapPin,
  PenLine,
  Route,
  Trash2,
  Users,
} from "lucide-react";
import { distritos } from "@/data/madridDistritos";

interface PuntoVerdeSeleccionado {
  id: string;
  direccion: string;
  barrio: string;
  distrito: string;
  numViviendas: number;
  numContenedores: number;
  litrosEstimados: number;
  orden: number;
}

const RutasDistritos = () => {
  const { rutas, loading: loadingRutas, addRuta, updateRuta, deleteRuta, completeRuta } = useRutas();
  const { puntosVerdes, loading: loadingPuntos, getDistritosUnicos, getPuntosByDistrito } = usePuntosVerdes();
  
  const [currentTab, setCurrentTab] = useState("pendientes");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [puntosFiltrados, setPuntosFiltrados] = useState<any[]>([]);
  const [puntosSeleccionados, setPuntosSeleccionados] = useState<PuntoVerdeSeleccionado[]>([]);
  const [isCreatingRuta, setIsCreatingRuta] = useState(false);
  const [isViewingRuta, setIsViewingRuta] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<any>(null);
  const [litrosTotales, setLitrosTotales] = useState<number>(0);
  const [isCompletingRuta, setIsCompletingRuta] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    distrito: "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    hora: "09:00",
    recogedores: "",
    distanciaTotal: 0,
    tiempoEstimado: 0,
    frecuencia: "semanal"
  });
  
  // Filter displayed routes based on current tab and district filter
  const filteredRutas = currentTab === "pendientes"
    ? rutas.filter(r => !r.completada)
    : rutas.filter(r => r.completada);
  
  const displayedRutas = filterDistrito
    ? filteredRutas.filter(r => r.distrito === filterDistrito)
    : filteredRutas;

  // Handle district change in form
  const handleDistritoChange = (distrito: string) => {
    setFormData({
      ...formData,
      distrito,
      nombre: `Ruta ${distrito} - ${format(new Date(), "dd/MM/yyyy")}`
    });
    
    const puntosFiltradosDelDistrito = puntosVerdes.filter(punto => punto.distrito === distrito);
    setPuntosFiltrados(puntosFiltradosDelDistrito);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "distrito") {
      handleDistritoChange(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePuntoVerdeSelect = (punto: any) => {
    // Check if punto is already selected
    const isAlreadySelected = puntosSeleccionados.some(p => p.id === punto.id);
    
    if (isAlreadySelected) {
      // Remove from selection
      setPuntosSeleccionados(puntosSeleccionados.filter(p => p.id !== punto.id));
    } else {
      // Add to selection with the next order number
      const orden = puntosSeleccionados.length + 1;
      // Estimate liters based on containers (adjust formula as needed)
      const litrosEstimados = punto.numContenedores * 5; // Assuming 5L per container on average
      
      setPuntosSeleccionados([
        ...puntosSeleccionados,
        {
          id: punto.id,
          direccion: punto.direccion,
          barrio: punto.barrio,
          distrito: punto.distrito,
          numViviendas: punto.numViviendas,
          numContenedores: punto.numContenedores,
          litrosEstimados,
          orden
        }
      ]);
    }
  };
  
  const handleReorderPunto = (id: string, direction: "up" | "down") => {
    const newPuntos = [...puntosSeleccionados];
    const index = newPuntos.findIndex(p => p.id === id);
    
    if (direction === "up" && index > 0) {
      // Swap with previous element
      [newPuntos[index - 1], newPuntos[index]] = [newPuntos[index], newPuntos[index - 1]];
    } else if (direction === "down" && index < newPuntos.length - 1) {
      // Swap with next element
      [newPuntos[index], newPuntos[index + 1]] = [newPuntos[index + 1], newPuntos[index]];
    }
    
    // Re-number the order
    newPuntos.forEach((punto, idx) => {
      punto.orden = idx + 1;
    });
    
    setPuntosSeleccionados(newPuntos);
  };
  
  const handleRemovePunto = (id: string) => {
    const newPuntos = puntosSeleccionados.filter(p => p.id !== id);
    
    // Re-number the order
    newPuntos.forEach((punto, idx) => {
      punto.orden = idx + 1;
    });
    
    setPuntosSeleccionados(newPuntos);
  };
  
  const handleCreateRuta = async () => {
    if (!formData.nombre || !formData.distrito || !formData.fecha || !formData.hora || !formData.recogedores) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    if (puntosSeleccionados.length === 0) {
      toast.error("Debes seleccionar al menos un punto verde para la ruta");
      return;
    }
    
    // Calculate total liters estimate
    const litrosEstimados = puntosSeleccionados.reduce((sum, punto) => sum + punto.litrosEstimados, 0);
    
    // Format points for storage
    const clientesRuta = puntosSeleccionados.map(punto => ({
      id: punto.id,
      nombre: punto.direccion,
      direccion: punto.direccion,
      barrio: punto.barrio,
      orden: punto.orden,
      litrosEstimados: punto.litrosEstimados
    }));
    
    // Create route data
    const nuevaRuta = {
      nombre: formData.nombre,
      distrito: formData.distrito,
      fecha: new Date(formData.fecha),
      hora: formData.hora,
      recogedores: formData.recogedores,
      clientes: clientesRuta,
      barrios: Array.from(new Set(puntosSeleccionados.map(p => p.barrio))),
      puntosRecogida: puntosSeleccionados.length,
      distanciaTotal: formData.distanciaTotal || Math.round(puntosSeleccionados.length * 0.5), // Simple estimate
      tiempoEstimado: formData.tiempoEstimado || Math.round(puntosSeleccionados.length * 10), // Simple estimate: 10 min per point
      frecuencia: formData.frecuencia,
      litrosEstimados: litrosEstimados,
      completada: false
    };
    
    try {
      await addRuta(nuevaRuta);
      setIsCreatingRuta(false);
      resetForm();
      toast.success("Ruta creada correctamente");
    } catch (error) {
      console.error("Error al crear la ruta:", error);
      toast.error("Error al crear la ruta");
    }
  };
  
  const handleViewRuta = (ruta: any) => {
    setSelectedRuta(ruta);
    setIsViewingRuta(true);
  };
  
  const handleDeleteRuta = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta ruta? Esta acción no se puede deshacer.")) {
      try {
        await deleteRuta(id);
        toast.success("Ruta eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar la ruta:", error);
        toast.error("Error al eliminar la ruta");
      }
    }
  };
  
  const handleCompleteRuta = async () => {
    if (!selectedRuta) return;
    
    try {
      await completeRuta(selectedRuta.id, litrosTotales);
      setIsCompletingRuta(false);
      setSelectedRuta(null);
      setLitrosTotales(0);
      setCurrentTab("completadas");
      toast.success("Ruta marcada como completada");
    } catch (error) {
      console.error("Error al completar la ruta:", error);
      toast.error("Error al completar la ruta");
    }
  };
  
  const resetForm = () => {
    setFormData({
      nombre: "",
      distrito: "",
      fecha: format(new Date(), "yyyy-MM-dd"),
      hora: "09:00",
      recogedores: "",
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: "semanal"
    });
    setPuntosSeleccionados([]);
    setPuntosFiltrados([]);
  };
  
  const calculateTotalLitrosEstimados = () => {
    return puntosSeleccionados.reduce((sum, punto) => sum + punto.litrosEstimados, 0);
  };

  const handleOpenCompleteDialog = (ruta: any) => {
    setSelectedRuta(ruta);
    setLitrosTotales(ruta.litrosEstimados || 0);
    setIsCompletingRuta(true);
  };
  
  const handleLitrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLitrosTotales(parseInt(e.target.value) || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas por Distritos</h2>
          <p className="text-muted-foreground">
            Crea rutas eficientes con los puntos verdes registrados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreatingRuta} onOpenChange={setIsCreatingRuta}>
            <DialogTrigger asChild>
              <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Crear Ruta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear nueva ruta de recogida</DialogTitle>
                <DialogDescription>
                  Selecciona puntos verdes para crear una ruta óptima de recogida
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                {/* Form Column */}
                <div className="md:col-span-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito" className="text-sm font-medium">
                      Distrito <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={(value) => handleSelectChange("distrito", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistritosUnicos().map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium">
                      Nombre de la ruta <span className="text-red-500">*</span>
                    </Label>
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
                      <Label htmlFor="fecha" className="text-sm font-medium">
                        Fecha <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hora" className="text-sm font-medium">
                        Hora <span className="text-red-500">*</span>
                      </Label>
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
                    <Label htmlFor="recogedores" className="text-sm font-medium">
                      Personal asignado <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recogedores"
                      name="recogedores"
                      value={formData.recogedores}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez, María López"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="distanciaTotal" className="text-sm font-medium">
                        Distancia (km)
                      </Label>
                      <Input
                        id="distanciaTotal"
                        name="distanciaTotal"
                        type="number"
                        value={formData.distanciaTotal}
                        onChange={handleInputChange}
                        placeholder="Automático"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiempoEstimado" className="text-sm font-medium">
                        Tiempo (min)
                      </Label>
                      <Input
                        id="tiempoEstimado"
                        name="tiempoEstimado"
                        type="number"
                        value={formData.tiempoEstimado}
                        onChange={handleInputChange}
                        placeholder="Automático"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frecuencia" className="text-sm font-medium">
                      Frecuencia
                    </Label>
                    <Select
                      value={formData.frecuencia}
                      onValueChange={(value) => handleSelectChange("frecuencia", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-[#f9f7ff] p-4 rounded-md border border-[#9b87f5] mt-4">
                    <h4 className="font-medium text-sm mb-2">Resumen de la ruta</h4>
                    <div className="space-y-1 text-sm">
                      <p>Puntos seleccionados: <span className="font-bold">{puntosSeleccionados.length}</span></p>
                      <p>Litros estimados: <span className="font-bold">{calculateTotalLitrosEstimados()} L</span></p>
                      <p>Contenedores a recoger: <span className="font-bold">
                        {puntosSeleccionados.reduce((sum, punto) => sum + punto.numContenedores, 0)}
                      </span></p>
                    </div>
                  </div>
                </div>
                
                {/* Points Selection Column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Puntos verdes disponibles</h3>
                    <Badge variant="outline" className="bg-[#f9f7ff]">
                      {puntosFiltrados.length} puntos
                    </Badge>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead>Barrio</TableHead>
                            <TableHead className="text-right">Viviendas</TableHead>
                            <TableHead className="text-right">Contenedores</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loadingPuntos ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                              </TableCell>
                            </TableRow>
                          ) : puntosFiltrados.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                {formData.distrito 
                                  ? "No hay puntos verdes en este distrito" 
                                  : "Selecciona un distrito para ver los puntos disponibles"}
                              </TableCell>
                            </TableRow>
                          ) : (
                            puntosFiltrados.map((punto) => {
                              const isSelected = puntosSeleccionados.some(p => p.id === punto.id);
                              const selectedPunto = puntosSeleccionados.find(p => p.id === punto.id);
                              
                              return (
                                <TableRow 
                                  key={punto.id} 
                                  className={isSelected ? "bg-[#f9f7ff]" : "hover:bg-gray-50"}
                                  onClick={() => handlePuntoVerdeSelect(punto)}
                                >
                                  <TableCell>
                                    <Checkbox 
                                      checked={isSelected} 
                                      onCheckedChange={() => handlePuntoVerdeSelect(punto)}
                                    />
                                  </TableCell>
                                  <TableCell>{punto.direccion}</TableCell>
                                  <TableCell>{punto.barrio}</TableCell>
                                  <TableCell className="text-right">{punto.numViviendas}</TableCell>
                                  <TableCell className="text-right">{punto.numContenedores}</TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Orden de la ruta</h3>
                      <Badge variant="outline" className="bg-[#f9f7ff]">
                        {puntosSeleccionados.length} puntos seleccionados
                      </Badge>
                    </div>
                    
                    {puntosSeleccionados.length === 0 ? (
                      <div className="text-center py-8 border rounded-md bg-gray-50">
                        <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Selecciona puntos verdes para crear tu ruta</p>
                      </div>
                    ) : (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[60px]">Orden</TableHead>
                              <TableHead>Dirección</TableHead>
                              <TableHead>Barrio</TableHead>
                              <TableHead className="text-right">Contenedores</TableHead>
                              <TableHead className="text-right">Litros est.</TableHead>
                              <TableHead className="w-[120px]">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {puntosSeleccionados
                              .sort((a, b) => a.orden - b.orden)
                              .map((punto) => (
                                <TableRow key={punto.id}>
                                  <TableCell className="font-medium">{punto.orden}</TableCell>
                                  <TableCell>{punto.direccion}</TableCell>
                                  <TableCell>{punto.barrio}</TableCell>
                                  <TableCell className="text-right">{punto.numContenedores}</TableCell>
                                  <TableCell className="text-right">{punto.litrosEstimados}L</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-1">
                                      <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReorderPunto(punto.id, "up");
                                        }}
                                        disabled={punto.orden === 1}
                                      >
                                        <span className="sr-only">Subir</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                          <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                                        </svg>
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReorderPunto(punto.id, "down");
                                        }}
                                        disabled={punto.orden === puntosSeleccionados.length}
                                      >
                                        <span className="sr-only">Bajar</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                                        </svg>
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8 text-red-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemovePunto(punto.id);
                                        }}
                                      >
                                        <span className="sr-only">Eliminar</span>
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
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingRuta(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                  onClick={handleCreateRuta}
                  disabled={puntosSeleccionados.length === 0 || !formData.nombre || !formData.distrito || !formData.fecha || !formData.hora || !formData.recogedores}
                >
                  Crear Ruta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => alert("Exportando rutas a Excel. Esta función estará disponible próximamente.")}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-[#f9f7ff] to-white border-[#9b87f5]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7E69AB] flex items-center gap-2">
              <Route className="h-4 w-4" />
              Rutas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rutas.filter(r => !r.completada).length}</div>
            <p className="text-xs text-muted-foreground">
              pendientes de realizar
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#f9f7ff] to-white border-[#9b87f5]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7E69AB] flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Distritos con Rutas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(rutas.map(r => r.distrito)).size} / {distritos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              distritos con rutas programadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#f9f7ff] to-white border-[#9b87f5]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7E69AB] flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Total Recogido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rutas.reduce((total, ruta) => total + (ruta.litrosTotales || 0), 0)}L
            </div>
            <p className="text-xs text-muted-foreground">
              litros de aceite recolectados
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Listado de Rutas</CardTitle>
          <CardDescription>
            Gestión de rutas de recogida por distritos
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="pendientes" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value="completadas" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
                  Completadas
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full sm:w-auto">
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {getDistritosUnicos().map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRutas ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            </div>
          ) : displayedRutas.length === 0 ? (
            <div className="text-center py-12">
              <Route className="h-16 w-16 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No hay rutas {currentTab === "pendientes" ? "pendientes" : "completadas"}</h3>
              <p className="text-sm text-gray-500">
                {currentTab === "pendientes" 
                  ? "Crea una nueva ruta para comenzar" 
                  : "Las rutas completadas aparecerán aquí"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Puntos</TableHead>
                    <TableHead className="text-right">Litros</TableHead>
                    <TableHead className="w-[140px] text-center">Estado</TableHead>
                    <TableHead className="w-[150px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRutas.map((ruta) => (
                    <TableRow key={ruta.id} className="hover:bg-[#f9f7ff]/50">
                      <TableCell>
                        <div className="font-medium">{ruta.nombre}</div>
                        <div className="text-xs text-gray-500">{ruta.recogedores}</div>
                      </TableCell>
                      <TableCell>{ruta.distrito}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span>
                            {ruta.fecha 
                              ? format(new Date(ruta.fecha), "dd/MM/yyyy")
                              : "No programada"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{ruta.hora || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{ruta.puntosRecogida || ruta.clientes?.length || 0}</div>
                        <div className="text-xs text-gray-500">
                          {ruta.barrios?.length 
                            ? `${ruta.barrios.length} barrio${ruta.barrios.length !== 1 ? 's' : ''}` 
                            : "Sin barrios"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {currentTab === "completadas" 
                          ? <span className="font-medium">{ruta.litrosTotales || 0}L</span>
                          : <span className="text-gray-500">{ruta.litrosEstimados || 0}L est.</span>
                        }
                      </TableCell>
                      <TableCell className="text-center">
                        {ruta.completada ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                            Completada
                          </Badge>
                        ) : (
                          <Badge className="bg-[#f9f7ff] text-[#7E69AB] hover:bg-[#f9f7ff] border-[#9b87f5]">
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0" 
                            onClick={() => handleViewRuta(ruta)}
                          >
                            <span className="sr-only">Ver detalles</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </Button>
                          
                          {currentTab === "pendientes" ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleOpenCompleteDialog(ruta)}
                              >
                                <span className="sr-only">Completar</span>
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => handleDeleteRuta(ruta.id)}
                            >
                              <span className="sr-only">Eliminar</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Route Dialog */}
      <Dialog open={isViewingRuta} onOpenChange={setIsViewingRuta}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalles de la ruta</DialogTitle>
            <DialogDescription>
              Información detallada sobre la ruta seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedRuta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre de la ruta</h3>
                  <p className="font-medium">{selectedRuta.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Distrito</h3>
                  <p>{selectedRuta.distrito}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha programada</h3>
                  <p>{selectedRuta.fecha ? format(new Date(selectedRuta.fecha), "dd/MM/yyyy") : "No programada"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Hora</h3>
                  <p>{selectedRuta.hora || "No especificada"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Personal asignado</h3>
                <p>{selectedRuta.recogedores || "No asignado"}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Puntos de recogida</h3>
                  <p className="font-medium">{selectedRuta.puntosRecogida || selectedRuta.clientes?.length || 0}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Distancia</h3>
                  <p>{selectedRuta.distanciaTotal || 0} km</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tiempo estimado</h3>
                  <p>{selectedRuta.tiempoEstimado || 0} min</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Barrios incluidos</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRuta.barrios?.length > 0 ? (
                    selectedRuta.barrios.map((barrio: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {barrio}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No hay barrios especificados</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Puntos de recogida</h3>
                {selectedRuta.clientes?.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">Orden</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Barrio</TableHead>
                          <TableHead className="text-right">Litros est.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRuta.clientes
                          .sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0))
                          .map((cliente: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{cliente.orden || index + 1}</TableCell>
                              <TableCell>{cliente.direccion || cliente.nombre}</TableCell>
                              <TableCell>{cliente.barrio || "N/A"}</TableCell>
                              <TableCell className="text-right">{cliente.litrosEstimados || 0}L</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-md bg-gray-50">
                    <p className="text-gray-500">No hay puntos de recogida especificados</p>
                  </div>
                )}
              </div>
              
              {selectedRuta.completada && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <h3 className="text-sm font-medium text-green-800 flex items-center gap-1 mb-2">
                    <Check className="h-4 w-4" />
                    Ruta completada
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Fecha de realización</p>
                      <p className="text-sm">
                        {selectedRuta.fechaCompletada 
                          ? format(new Date(selectedRuta.fechaCompletada.toDate()), "dd/MM/yyyy HH:mm") 
                          : format(new Date(), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Litros recogidos</p>
                      <p className="text-sm font-medium">{selectedRuta.litrosTotales || 0}L</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewingRuta(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Complete Route Dialog */}
      <Dialog open={isCompletingRuta} onOpenChange={setIsCompletingRuta}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Completar ruta</DialogTitle>
            <DialogDescription>
              Registra los litros totales recogidos en esta ruta
            </DialogDescription>
          </DialogHeader>
          
          {selectedRuta && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre de la ruta</h3>
                  <p className="font-medium">{selectedRuta.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Distrito</h3>
                  <p>{selectedRuta.distrito}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha</h3>
                  <p>{selectedRuta.fecha ? format(new Date(selectedRuta.fecha), "dd/MM/yyyy") : "No programada"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Puntos de recogida</h3>
                  <p>{selectedRuta.puntosRecogida || selectedRuta.clientes?.length || 0}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="litrosTotales">
                  Litros totales recogidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="litrosTotales"
                  name="litrosTotales"
                  type="number"
                  value={litrosTotales}
                  onChange={handleLitrosChange}
                  placeholder="Introduce los litros recogidos"
                />
                <p className="text-xs text-gray-500">
                  Litros estimados: {selectedRuta.litrosEstimados || 0}L
                </p>
              </div>
            </div>
          )}
          
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
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
              onClick={handleCompleteRuta}
              disabled={litrosTotales <= 0}
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
