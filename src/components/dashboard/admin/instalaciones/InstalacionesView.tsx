
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { distritosConBarrios } from "@/data/madridDistritos";
import { Building, Plus } from "lucide-react";
import { toast } from "sonner";

const InstalacionesView = () => {
  const { 
    instalaciones, 
    loading, 
    error, 
    addInstalacion, 
    updateInstalacion,
    deleteInstalacion
  } = useInstalaciones();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    direccion: "",
    distrito: "",
    barrio: "",
    numContenedores: 0,
    numPorteria: 0,
    numViviendas: 0
  });
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numContenedores" || name === "numPorteria" || name === "numViviendas"
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
      nombre: "",
      direccion: "",
      distrito: "",
      barrio: "",
      numContenedores: 0,
      numPorteria: 0,
      numViviendas: 0
    });
    setSelectedDistrito("");
    setFilteredBarrios([]);
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.direccion || !formData.distrito || !formData.barrio) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      if (isEditing && formData.id) {
        await updateInstalacion(formData.id, {
          nombre: formData.nombre,
          direccion: formData.direccion,
          distrito: formData.distrito,
          barrio: formData.barrio,
          numContenedores: formData.numContenedores,
          numPorteria: formData.numPorteria,
          numViviendas: formData.numViviendas
        });
      } else {
        await addInstalacion({
          nombre: formData.nombre,
          direccion: formData.direccion,
          distrito: formData.distrito,
          barrio: formData.barrio,
          numContenedores: formData.numContenedores,
          numPorteria: formData.numPorteria,
          numViviendas: formData.numViviendas,
          createdAt: new Date()
        });
      }
      
      setIsOpen(false);
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Error guardando la instalación:", error);
    }
  };
  
  const handleEdit = (instalacion: any) => {
    const distrito = distritosConBarrios.find(d => d.distrito === instalacion.distrito);
    setFilteredBarrios(distrito?.barrios || []);
    setSelectedDistrito(instalacion.distrito);
    
    setFormData({
      id: instalacion.id,
      nombre: instalacion.nombre,
      direccion: instalacion.direccion,
      distrito: instalacion.distrito,
      barrio: instalacion.barrio,
      numContenedores: instalacion.numContenedores,
      numPorteria: instalacion.numPorteria,
      numViviendas: instalacion.numViviendas
    });
    
    setIsEditing(true);
    setIsOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta instalación?")) {
      await deleteInstalacion(id);
    }
  };
  
  // Group installations by district
  const instalacionesAgrupadas: { [distrito: string]: any[] } = {};
  instalaciones.forEach(instalacion => {
    if (!instalacionesAgrupadas[instalacion.distrito]) {
      instalacionesAgrupadas[instalacion.distrito] = [];
    }
    instalacionesAgrupadas[instalacion.distrito].push(instalacion);
  });
  
  // Calculate total statistics
  const totalViviendas = instalaciones.reduce((acc, i) => acc + (i.numViviendas || 0), 0);
  const totalContenedores = instalaciones.reduce((acc, i) => acc + (i.numContenedores || 0), 0);
  const totalPorterias = instalaciones.reduce((acc, i) => acc + (i.numPorteria || 0), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instalaciones</h2>
          <p className="text-muted-foreground">
            Gestione las instalaciones de contenedores en comunidades
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-asram hover:bg-asram-700">
              <Plus className="mr-2 h-4 w-4" /> Nueva Instalación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar instalación" : "Añadir nueva instalación"}</DialogTitle>
              <DialogDescription>
                Complete el formulario para {isEditing ? "actualizar la" : "añadir una nueva"} instalación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la instalación</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
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
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numContenedores">Nº de contenedores</Label>
                  <Input
                    id="numContenedores"
                    name="numContenedores"
                    type="number"
                    value={formData.numContenedores}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numPorteria">Nº de portería</Label>
                  <Input
                    id="numPorteria"
                    name="numPorteria"
                    type="number"
                    value={formData.numPorteria}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numViviendas">Nº de viviendas</Label>
                  <Input
                    id="numViviendas"
                    name="numViviendas"
                    type="number"
                    value={formData.numViviendas}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-asram hover:bg-asram-700"
                onClick={handleSubmit}
              >
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Resumen de Instalaciones</CardTitle>
          <CardDescription>
            Estadísticas generales de las instalaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <Building className="h-8 w-8 text-asram mb-2" />
            <span className="text-muted-foreground text-sm">Total Viviendas</span>
            <span className="text-4xl font-bold text-asram">{totalViviendas}</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <Building className="h-8 w-8 text-asram mb-2" />
            <span className="text-muted-foreground text-sm">Total Contenedores</span>
            <span className="text-4xl font-bold text-asram">{totalContenedores}</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <Building className="h-8 w-8 text-asram mb-2" />
            <span className="text-muted-foreground text-sm">Total Porterías</span>
            <span className="text-4xl font-bold text-asram">{totalPorterias}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Listado de Instalaciones</CardTitle>
          <CardDescription>
            Instalaciones registradas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Cargando instalaciones...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500">{error}</p>
            </div>
          ) : instalaciones.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">No hay instalaciones registradas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(instalacionesAgrupadas).map(([distrito, instalaciones]) => (
                <div key={distrito} className="space-y-2">
                  <h3 className="font-semibold text-lg bg-muted px-4 py-2 rounded-md">
                    {distrito}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Barrio</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead className="text-right">Contenedores</TableHead>
                        <TableHead className="text-right">Portería</TableHead>
                        <TableHead className="text-right">Viviendas</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {instalaciones.map((instalacion) => (
                        <TableRow key={instalacion.id}>
                          <TableCell className="font-medium">{instalacion.nombre}</TableCell>
                          <TableCell>{instalacion.barrio}</TableCell>
                          <TableCell>{instalacion.direccion}</TableCell>
                          <TableCell className="text-right">{instalacion.numContenedores}</TableCell>
                          <TableCell className="text-right">{instalacion.numPorteria}</TableCell>
                          <TableCell className="text-right">{instalacion.numViviendas}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(instalacion)}>
                                Editar
                              </Button>
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(instalacion.id)}
                              >
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

export default InstalacionesView;
