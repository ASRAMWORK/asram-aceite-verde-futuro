
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { toast } from "sonner";
import { 
  Edit, 
  Trash2, 
  Filter,
  PlusCircle
} from "lucide-react";
import { db } from "@/lib/firebase";
import { PuntoVerde } from "@/types";
import { distritosConBarrios } from "@/data/madridDistritos";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";

const PuntosVerdes = () => {
  const { 
    puntosVerdes, 
    loading, 
    error, 
    loadPuntosVerdesData,
    addPuntoVerde,
    updatePuntoVerde,
    deletePuntoVerde,
    getDistritosUnicos,
    getBarriosUnicos
  } = usePuntosVerdes();
  
  // Estados para el formulario y la edición
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isEditingPoint, setIsEditingPoint] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [puntoToDelete, setPuntoToDelete] = useState<string | null>(null);
  
  // Estados para filtros
  const [filtroDistrito, setFiltroDistrito] = useState<string>("");
  const [filtroBarrio, setFiltroBarrio] = useState<string>("");
  const [barriosFiltro, setBarriosFiltro] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    id: "",
    distrito: "",
    barrio: "",
    direccion: "",
    numViviendas: 0,
    numContenedores: 0,
    telefono: "",
    litrosRecogidos: 0
  });
  
  // Manejar cambio de distrito en el formulario
  const handleDistritoChange = (value: string) => {
    setSelectedDistrito(value);
    const distrito = distritosConBarrios.find(d => d.distrito === value);
    setFilteredBarrios(distrito?.barrios || []);
    setFormData({
      ...formData,
      distrito: value,
      barrio: "",
    });
  };
  
  // Manejar cambio de distrito en el filtro
  const handleFiltroDistritoChange = (value: string) => {
    setFiltroDistrito(value);
    setFiltroBarrio("");
    
    if (value) {
      const distrito = distritosConBarrios.find(d => d.distrito === value);
      setBarriosFiltro(distrito?.barrios || []);
    } else {
      setBarriosFiltro([]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numViviendas" || name === "numContenedores" || name === "litrosRecogidos"
        ? parseInt(value) || 0 
        : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const resetForm = () => {
    setFormData({
      id: "",
      distrito: "",
      barrio: "",
      direccion: "",
      numViviendas: 0,
      numContenedores: 0,
      telefono: "",
      litrosRecogidos: 0
    });
    setSelectedDistrito("");
    setFilteredBarrios([]);
  };
  
  const handleSubmit = async () => {
    if (!formData.distrito || !formData.direccion) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      const nuevoPunto: Omit<PuntoVerde, 'id'> = {
        distrito: formData.distrito,
        barrio: formData.barrio || "",
        direccion: formData.direccion,
        numViviendas: Number(formData.numViviendas) || 0,
        numContenedores: Number(formData.numContenedores) || 0,
        telefono: formData.telefono || "",
        litrosRecogidos: Number(formData.litrosRecogidos) || 0,
        administradorId: null
      };

      await addPuntoVerde(nuevoPunto);
      
      setIsAddingPoint(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear punto verde:", error);
    }
  };

  const handleEditPoint = (punto: PuntoVerde) => {
    const distrito = distritosConBarrios.find(d => d.distrito === punto.distrito);
    setFilteredBarrios(distrito?.barrios || []);
    setSelectedDistrito(punto.distrito);
    
    setFormData({
      id: punto.id,
      distrito: punto.distrito,
      barrio: punto.barrio,
      direccion: punto.direccion,
      numViviendas: punto.numViviendas,
      numContenedores: punto.numContenedores,
      telefono: punto.telefono,
      litrosRecogidos: punto.litrosRecogidos
    });
    
    setIsEditingPoint(true);
  };
  
  const handleUpdatePoint = async () => {
    try {
      if (!formData.id || !formData.distrito || !formData.barrio || !formData.direccion) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }
      
      const success = await updatePuntoVerde(formData.id, {
        distrito: formData.distrito,
        barrio: formData.barrio,
        direccion: formData.direccion,
        numViviendas: Number(formData.numViviendas) || 0,
        numContenedores: Number(formData.numContenedores) || 0,
        telefono: formData.telefono,
        litrosRecogidos: Number(formData.litrosRecogidos) || 0
      });
      
      if (success) {
        setIsEditingPoint(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating punto verde:", error);
      toast.error("Error al actualizar el punto verde");
    }
  };

  const handleDeletePoint = async (id: string) => {
    setPuntoToDelete(id);
  };
  
  const confirmDeletePoint = async () => {
    if (puntoToDelete) {
      await deletePuntoVerde(puntoToDelete);
      setPuntoToDelete(null);
    }
  };
  
  // Filtrar los puntos verdes según los filtros aplicados
  const filteredPuntos = puntosVerdes.filter(punto => {
    const matchesDistrito = !filtroDistrito || punto.distrito === filtroDistrito;
    const matchesBarrio = !filtroBarrio || punto.barrio === filtroBarrio;
    return matchesDistrito && matchesBarrio;
  });
  
  // Agrupar los puntos filtrados por distrito
  const puntosAgrupados: { [distrito: string]: PuntoVerde[] } = {};
  filteredPuntos.forEach(punto => {
    if (!puntosAgrupados[punto.distrito]) {
      puntosAgrupados[punto.distrito] = [];
    }
    puntosAgrupados[punto.distrito].push(punto);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Puntos Verdes</h2>
          <p className="text-muted-foreground">
            Gestiona los puntos de recogida de aceite usado
          </p>
        </div>
        <Dialog open={isAddingPoint} onOpenChange={setIsAddingPoint}>
          <DialogTrigger asChild>
            <Button className="bg-asram hover:bg-asram-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Punto Verde
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Añadir nuevo punto verde</DialogTitle>
              <DialogDescription>
                Completa el formulario para añadir un nuevo punto de recogida de aceite.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select
                    value={formData.distrito}
                    onValueChange={(value) => handleDistritoChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritosConBarrios.map((d) => (
                        <SelectItem key={d.distrito} value={d.distrito}>
                          {d.distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barrio">Barrio</Label>
                  <Select
                    value={formData.barrio}
                    onValueChange={(value) => handleSelectChange("barrio", value)}
                    disabled={!formData.distrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona barrio" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBarrios.map((barrio) => (
                        <SelectItem key={barrio} value={barrio}>
                          {barrio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numViviendas">Número de viviendas</Label>
                  <Input
                    id="numViviendas"
                    name="numViviendas"
                    type="number"
                    value={formData.numViviendas}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numContenedores">Número de contenedores</Label>
                  <Input
                    id="numContenedores"
                    name="numContenedores"
                    type="number"
                    value={formData.numContenedores}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de contacto</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="litrosRecogidos">Litros recogidos</Label>
                <Input
                  id="litrosRecogidos"
                  name="litrosRecogidos"
                  type="number"
                  value={formData.litrosRecogidos}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingPoint(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-asram hover:bg-asram-700"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditingPoint} onOpenChange={setIsEditingPoint}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Editar punto verde</DialogTitle>
              <DialogDescription>
                Modifica la información del punto de recogida de aceite.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select
                    value={formData.distrito}
                    onValueChange={(value) => handleDistritoChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritosConBarrios.map((d) => (
                        <SelectItem key={d.distrito} value={d.distrito}>
                          {d.distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barrio">Barrio</Label>
                  <Select
                    value={formData.barrio}
                    onValueChange={(value) => handleSelectChange("barrio", value)}
                    disabled={!formData.distrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona barrio" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBarrios.map((barrio) => (
                        <SelectItem key={barrio} value={barrio}>
                          {barrio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numViviendas">Número de viviendas</Label>
                  <Input
                    id="numViviendas"
                    name="numViviendas"
                    type="number"
                    value={formData.numViviendas}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numContenedores">Número de contenedores</Label>
                  <Input
                    id="numContenedores"
                    name="numContenedores"
                    type="number"
                    value={formData.numContenedores}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de contacto</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="litrosRecogidos">Litros recogidos</Label>
                <Input
                  id="litrosRecogidos"
                  name="litrosRecogidos"
                  type="number"
                  value={formData.litrosRecogidos}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingPoint(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-asram hover:bg-asram-700"
                onClick={handleUpdatePoint}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!puntoToDelete} onOpenChange={(open) => !open && setPuntoToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará el punto verde permanentemente. No podrás recuperarlo después.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeletePoint} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Resumen de Puntos Verdes</CardTitle>
          <CardDescription>
            Estadísticas generales de los puntos de recogida
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Puntos Activos</span>
            <span className="text-4xl font-bold text-asram">{puntosVerdes.length}</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Total Viviendas</span>
            <span className="text-4xl font-bold text-asram">
              {puntosVerdes.reduce((total, punto) => total + punto.numViviendas, 0)}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Total Contenedores</span>
            <span className="text-4xl font-bold text-asram">
              {puntosVerdes.reduce((total, punto) => total + punto.numContenedores, 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Listado de Puntos Verdes</CardTitle>
              <CardDescription>
                Puntos de recogida de aceite registrados en el sistema
              </CardDescription>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="w-full md:w-auto">
                <Label htmlFor="filtroDistrito" className="text-sm">Filtrar por distrito</Label>
                <Select value={filtroDistrito} onValueChange={handleFiltroDistritoChange}>
                  <SelectTrigger className="w-[160px]">
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

              <div className="w-full md:w-auto">
                <Label htmlFor="filtroBarrio" className="text-sm">Filtrar por barrio</Label>
                <Select 
                  value={filtroBarrio} 
                  onValueChange={setFiltroBarrio}
                  disabled={!filtroDistrito}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Todos los barrios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los barrios</SelectItem>
                    {barriosFiltro.map((barrio) => (
                      <SelectItem key={barrio} value={barrio}>{barrio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="h-10" 
                onClick={() => {
                  setFiltroDistrito("");
                  setFiltroBarrio("");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Cargando puntos verdes...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button onClick={loadPuntosVerdesData}>Reintentar</Button>
              </div>
            </div>
          ) : Object.keys(puntosAgrupados).length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                {filtroDistrito || filtroBarrio ? "No se encontraron puntos verdes con los filtros aplicados" : "No hay puntos verdes registrados"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(puntosAgrupados).sort(([distritoA], [distritoB]) => 
                distritoA.localeCompare(distritoB)
              ).map(([distrito, puntos]) => (
                <div key={distrito} className="space-y-2">
                  <h3 className="font-semibold text-lg bg-muted px-4 py-2 rounded-md">
                    {distrito}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Barrio</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead className="text-right">Viviendas</TableHead>
                        <TableHead className="text-right">Contenedores</TableHead>
                        <TableHead className="text-right">Litros recogidos</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {puntos.sort((a, b) => a.barrio.localeCompare(b.barrio)).map((punto) => (
                        <TableRow key={punto.id}>
                          <TableCell>{punto.barrio}</TableCell>
                          <TableCell>{punto.direccion}</TableCell>
                          <TableCell className="text-right">{punto.numViviendas}</TableCell>
                          <TableCell className="text-right">{punto.numContenedores}</TableCell>
                          <TableCell className="text-right">{punto.litrosRecogidos}L</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditPoint(punto)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeletePoint(punto.id)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuntosVerdes;
