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
import { useCallesApadrinadas } from "@/hooks/useCallesApadrinadas";
import { useUsuarios } from "@/hooks/useUsuarios";
import type { CalleApadrinada } from "@/types";
import { 
  BadgeEuro, 
  Calendar, 
  FilePlus2, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  MapPin, 
  PenLine, 
  Percent, 
  Trash2, 
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CalleFormData = {
  nombre: string;
  distrito: string;
  barrio: string;
  descripcion: string;
  padrinoId: string;
  precio: number;
  fechaInicio: string;
  fechaRenovacion: string;
};

const distritos = [
  "Centro", "Arganzuela", "Retiro", "Salamanca", "Chamartín", 
  "Tetuán", "Chamberí", "Fuencarral-El Pardo", "Moncloa-Aravaca", 
  "Latina", "Carabanchel", "Usera", "Puente de Vallecas", 
  "Moratalaz", "Ciudad Lineal", "Hortaleza", "Villaverde",
  "Villa de Vallecas", "Vicálvaro", "San Blas-Canillejas", "Barajas"
];

const barrios: Record<string, string[]> = {
  "Centro": ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
  "Arganzuela": ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
  // Add more barrios for each distrito as needed
};

const CallesApadrinadas = () => {
  const { callesApadrinadas, loading, addCalleApadrinada, updateCalleApadrinada, deleteCalleApadrinada } = useCallesApadrinadas();
  const { usuarios } = useUsuarios();
  const [isAddingCalle, setIsAddingCalle] = useState(false);
  const [isEditingCalle, setIsEditingCalle] = useState(false);
  const [selectedCalle, setSelectedCalle] = useState<CalleApadrinada | null>(null);
  const [formData, setFormData] = useState<CalleFormData>({
    nombre: "",
    distrito: "",
    barrio: "",
    descripcion: "",
    padrinoId: "",
    precio: 0,
    fechaInicio: "",
    fechaRenovacion: ""
  });
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  
  const totalCalles = callesApadrinadas.length;
  const totalPadrinos = new Set(callesApadrinadas.map(calle => calle.padrinoId)).size;
  const ingresosMensuales = callesApadrinadas.reduce((sum, calle) => sum + (calle.precio || 0), 0);
  
  const renovadas = callesApadrinadas.filter(calle => {
    if (!calle.fechaRenovacion) return false;
    const renovacion = new Date(calle.fechaRenovacion);
    const hoy = new Date();
    return renovacion > hoy;
  }).length;
  
  const porcentajeRenovacion = totalCalles > 0 ? Math.round((renovadas / totalCalles) * 100) : 0;
  
  const handleDistritoChange = (value: string) => {
    setFormData({
      ...formData,
      distrito: value,
      barrio: ""
    });
    setFilteredBarrios(barrios[value] || []);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "precio" ? parseFloat(value) : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleOpenEditDialog = (calle: CalleApadrinada) => {
    setSelectedCalle(calle);
    setFormData({
      nombre: calle.nombre || "",
      distrito: calle.distrito || "",
      barrio: calle.barrio || "",
      descripcion: calle.descripcion || "",
      padrinoId: calle.padrinoId || "",
      precio: calle.precio || 0,
      fechaInicio: calle.fechaInicio ? new Date(calle.fechaInicio).toISOString().split('T')[0] : "",
      fechaRenovacion: calle.fechaRenovacion ? new Date(calle.fechaRenovacion).toISOString().split('T')[0] : ""
    });
    
    if (calle.distrito) {
      setFilteredBarrios(barrios[calle.distrito] || []);
    }
    
    setIsEditingCalle(true);
  };
  
  const resetForm = () => {
    setFormData({
      nombre: "",
      distrito: "",
      barrio: "",
      descripcion: "",
      padrinoId: "",
      precio: 0,
      fechaInicio: "",
      fechaRenovacion: ""
    });
    setFilteredBarrios([]);
    setSelectedCalle(null);
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.distrito || !formData.padrinoId) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const dataToSubmit = {
      ...formData,
      fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : '',
      fechaRenovacion: formData.fechaRenovacion ? new Date(formData.fechaRenovacion).toISOString() : ''
    };
    
    if (isEditingCalle && selectedCalle) {
      await updateCalleApadrinada(selectedCalle.id, dataToSubmit);
      setIsEditingCalle(false);
    } else {
      await addCalleApadrinada(dataToSubmit as Omit<CalleApadrinada, 'id'>);
      setIsAddingCalle(false);
    }
    
    resetForm();
  };
  
  const handleDeleteCalle = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta calle apadrinada?")) {
      await deleteCalleApadrinada(id);
    }
  };
  
  const handleExportData = (format: 'pdf' | 'excel') => {
    alert(`Exportando datos en formato ${format}. Esta función estará disponible próximamente.`);
  };
  
  const getPadrinoName = (padrinoId: string) => {
    const padrino = usuarios.find(u => u.id === padrinoId);
    return padrino ? padrino.nombre : "Desconocido";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calles Apadrinadas</h2>
          <p className="text-muted-foreground">
            Gestión de calles con padrinos y suscripciones activas
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingCalle} onOpenChange={setIsAddingCalle}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Añadir Calle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir nueva calle apadrinada</DialogTitle>
                <DialogDescription>
                  Completa el formulario para añadir una nueva calle al programa de apadrinamiento
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la calle</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito">Distrito</Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={handleDistritoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {distritos.map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito}
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
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="padrinoId">Padrino</Label>
                  <Select
                    value={formData.padrinoId}
                    onValueChange={(value) => handleSelectChange("padrinoId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona padrino" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre || usuario.email || "Usuario sin nombre"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio mensual (€)</Label>
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      value={formData.precio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha inicio</Label>
                    <Input
                      id="fechaInicio"
                      name="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaRenovacion">Fecha renovación</Label>
                    <Input
                      id="fechaRenovacion"
                      name="fechaRenovacion"
                      type="date"
                      value={formData.fechaRenovacion}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCalle(false);
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
          
          <Dialog open={isEditingCalle} onOpenChange={setIsEditingCalle}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar calle apadrinada</DialogTitle>
                <DialogDescription>
                  Actualiza la información de la calle apadrinada
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-edit">Nombre de la calle</Label>
                  <Input
                    id="nombre-edit"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito-edit">Distrito</Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={handleDistritoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {distritos.map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barrio-edit">Barrio</Label>
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
                  <Label htmlFor="descripcion-edit">Descripción</Label>
                  <Input
                    id="descripcion-edit"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="padrinoId-edit">Padrino</Label>
                  <Select
                    value={formData.padrinoId}
                    onValueChange={(value) => handleSelectChange("padrinoId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona padrino" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre || usuario.email || "Usuario sin nombre"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio-edit">Precio mensual (€)</Label>
                    <Input
                      id="precio-edit"
                      name="precio"
                      type="number"
                      value={formData.precio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio-edit">Fecha inicio</Label>
                    <Input
                      id="fechaInicio-edit"
                      name="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaRenovacion-edit">Fecha renovación</Label>
                    <Input
                      id="fechaRenovacion-edit"
                      name="fechaRenovacion"
                      type="date"
                      value={formData.fechaRenovacion}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingCalle(false);
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
          
          <Button variant="outline" onClick={() => handleExportData('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExportData('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calles Apadrinadas
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalles}</div>
            <p className="text-xs text-muted-foreground">
              calles en el programa
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Padrinos Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPadrinos}</div>
            <p className="text-xs text-muted-foreground">
              participantes en el programa
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Mensuales
            </CardTitle>
            <BadgeEuro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingresosMensuales}€</div>
            <p className="text-xs text-muted-foreground">
              por suscripciones activas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              % Renovación
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{porcentajeRenovacion}%</div>
            <p className="text-xs text-muted-foreground">
              tasa de renovación de suscripciones
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Calles Apadrinadas</CardTitle>
          <CardDescription>
            Calles con padrinos y programa de recogida activo
          </CardDescription>
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Distrito / Barrio</TableHead>
                    <TableHead>Padrino</TableHead>
                    <TableHead className="text-right">Precio mensual</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Renovación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callesApadrinadas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay calles apadrinadas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    callesApadrinadas.map((calle) => (
                      <TableRow key={calle.id}>
                        <TableCell className="font-medium">{calle.nombre}</TableCell>
                        <TableCell>{calle.distrito} / {calle.barrio}</TableCell>
                        <TableCell>{getPadrinoName(calle.padrinoId)}</TableCell>
                        <TableCell className="text-right">{calle.precio}€</TableCell>
                        <TableCell>
                          {calle.fechaInicio ? new Date(calle.fechaInicio).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {calle.fechaRenovacion ? new Date(calle.fechaRenovacion).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(calle)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteCalle(calle.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
            Mostrando {callesApadrinadas.length} calles apadrinadas
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CallesApadrinadas;
