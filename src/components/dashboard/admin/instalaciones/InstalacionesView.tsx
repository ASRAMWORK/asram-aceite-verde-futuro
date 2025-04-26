
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useUsuarios } from "@/hooks/useUsuarios";
import { distritosConBarrios } from "@/data/madridDistritos";
import { Building, Plus, Search, Filter, ChartBarBig, Users, MapPin, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { Chart } from "@/components/ui/chart";

const InstalacionesView = () => {
  const { 
    instalaciones, 
    loading, 
    error, 
    addInstalacion, 
    updateInstalacion,
    deleteInstalacion
  } = useInstalaciones();
  
  const { puntosVerdes, loading: loadingPuntosVerdes } = usePuntosVerdes();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDistrito, setFilterDistrito] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Estadísticas generales (combinando datos)
  const totalViviendas = instalaciones.reduce((acc, i) => acc + (i.numViviendas || 0), 0);
  const totalContenedores = instalaciones.reduce((acc, i) => acc + (i.numContenedores || 0), 0);
  const totalPorterias = instalaciones.reduce((acc, i) => acc + (i.numPorteria || 0), 0);
  
  const totalPuntosVerdes = puntosVerdes.length;
  const totalLitrosRecogidos = puntosVerdes.reduce((acc, p) => acc + (p.litrosRecogidos || 0), 0);
  const totalClientes = usuarios.filter(u => u.tipo === 'cliente').length;
  
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
  
  // Filter installations by distrito and search term
  const filteredInstalaciones = instalaciones.filter(instalacion => {
    const matchDistrito = filterDistrito === 'todos' ? true : instalacion.distrito === filterDistrito;
    const matchSearch = searchTerm 
      ? instalacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instalacion.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instalacion.barrio.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchDistrito && matchSearch;
  });
  
  // Data for charts
  const distritoStats = Array.from(new Set(instalaciones.map(i => i.distrito)))
    .map(distrito => {
      const instsByDistrito = instalaciones.filter(i => i.distrito === distrito);
      const puntosByDistrito = puntosVerdes.filter(p => p.distrito === distrito);
      const clientesByDistrito = usuarios.filter(u => u.distrito === distrito && u.tipo === 'cliente');
      
      return {
        distrito,
        instalaciones: instsByDistrito.length,
        contenedores: instsByDistrito.reduce((sum, i) => sum + (i.numContenedores || 0), 0),
        viviendas: instsByDistrito.reduce((sum, i) => sum + (i.numViviendas || 0), 0),
        puntosVerdes: puntosByDistrito.length,
        litrosRecogidos: puntosByDistrito.reduce((sum, p) => sum + (p.litrosRecogidos || 0), 0),
        clientes: clientesByDistrito.length
      };
    })
    .sort((a, b) => b.viviendas - a.viviendas);
  
  const chartDataContenedores = {
    labels: distritoStats.map(d => d.distrito),
    datasets: [
      {
        label: 'Contenedores',
        data: distritoStats.map(d => d.contenedores),
        backgroundColor: 'rgba(155, 135, 245, 0.6)',
        borderColor: 'rgba(155, 135, 245, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  const chartDataLitros = {
    labels: distritoStats.map(d => d.distrito),
    datasets: [
      {
        label: 'Litros Recogidos',
        data: distritoStats.map(d => d.litrosRecogidos),
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  const chartDataViviendas = {
    labels: distritoStats.map(d => d.distrito),
    datasets: [
      {
        label: 'Viviendas',
        data: distritoStats.map(d => d.viviendas),
        backgroundColor: 'rgba(236, 72, 153, 0.6)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  const chartDataRelaciones = {
    labels: distritoStats.map(d => d.distrito),
    datasets: [
      {
        label: 'Instalaciones',
        data: distritoStats.map(d => d.instalaciones),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Puntos Verdes',
        data: distritoStats.map(d => d.puntosVerdes),
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
      },
      {
        label: 'Clientes',
        data: distritoStats.map(d => d.clientes),
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instalaciones</h2>
          <p className="text-muted-foreground">
            Sistema integral de gestión de instalaciones de contenedores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram/90">
                <Plus className="mr-2 h-4 w-4" /> Nueva Instalación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="bg-asram hover:bg-asram/90"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px] mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBarBig className="h-4 w-4" />
            <span className="hidden sm:inline">Vista General</span>
          </TabsTrigger>
          <TabsTrigger value="installations" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Instalaciones</span>
          </TabsTrigger>
          <TabsTrigger value="puntos-verdes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Puntos Verdes</span>
          </TabsTrigger>
          <TabsTrigger value="reportes" className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Reportes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Resumen de Instalaciones</CardTitle>
                <CardDescription>Estadísticas generales</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                    <Building className="h-10 w-10 text-asram mb-2" />
                    <span className="text-5xl font-bold text-asram">{instalaciones.length}</span>
                    <span className="text-muted-foreground text-sm">Total Instalaciones</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                      <span className="text-2xl font-bold text-asram">{totalViviendas}</span>
                      <span className="text-xs text-muted-foreground text-center">Viviendas</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                      <span className="text-2xl font-bold text-asram">{totalContenedores}</span>
                      <span className="text-xs text-muted-foreground text-center">Contenedores</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                      <span className="text-2xl font-bold text-asram">{totalPorterias}</span>
                      <span className="text-xs text-muted-foreground text-center">Porterías</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Resumen de Puntos Verdes</CardTitle>
                <CardDescription>Impacto medioambiental</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                    <MapPin className="h-10 w-10 text-green-600 mb-2" />
                    <span className="text-5xl font-bold text-green-600">{totalPuntosVerdes}</span>
                    <span className="text-muted-foreground text-sm">Total Puntos Verdes</span>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                    <span className="text-2xl font-bold text-green-600">{totalLitrosRecogidos.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground text-center">Litros de Aceite Recogidos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Resumen de Clientes</CardTitle>
                <CardDescription>Gestión de servicio</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                    <Users className="h-10 w-10 text-orange-500 mb-2" />
                    <span className="text-5xl font-bold text-orange-500">{totalClientes}</span>
                    <span className="text-muted-foreground text-sm">Total Clientes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                      <span className="text-2xl font-bold text-orange-500">
                        {usuarios.filter(u => u.tipo === 'cliente' && u.activo).length}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">Clientes Activos</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50">
                      <span className="text-2xl font-bold text-orange-500">
                        {Math.round(totalContenedores / (totalClientes || 1) * 10) / 10}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">Cont./Cliente</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Distribución de Contenedores por Distrito</CardTitle>
                <CardDescription>Análisis de cobertura geográfica</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart 
                  type="bar" 
                  data={chartDataContenedores}
                  options={chartOptions} 
                  className="h-full"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Distribución de Viviendas por Distrito</CardTitle>
                <CardDescription>Penetración de servicio por área</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart 
                  type="bar" 
                  data={chartDataViviendas}
                  options={chartOptions} 
                  className="h-full"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Análisis Comparativo por Distrito</CardTitle>
              <CardDescription>
                Relación entre instalaciones, puntos verdes y clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Chart 
                type="bar" 
                data={chartDataRelaciones}
                options={chartOptions} 
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installations" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, dirección..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los distritos</SelectItem>
                  {Array.from(new Set(instalaciones.map(i => i.distrito))).sort().map(distrito => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Listado de Instalaciones</CardTitle>
              <CardDescription>
                {filterDistrito === 'todos' 
                  ? 'Todas las instalaciones registradas' 
                  : `Instalaciones en el distrito ${filterDistrito}`}
                {searchTerm && ` | Búsqueda: "${searchTerm}"`}
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
              ) : filteredInstalaciones.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-muted-foreground">No hay instalaciones que coincidan con los criterios</p>
                </div>
              ) : filterDistrito !== 'todos' ? (
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
                    {filteredInstalaciones.map((instalacion) => (
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
              ) : (
                <div className="space-y-6">
                  {Object.entries(instalacionesAgrupadas).sort().map(([distrito, instalaciones]) => (
                    <div key={distrito} className="space-y-2">
                      <h3 className="font-semibold text-lg bg-muted px-4 py-2 rounded-md flex justify-between items-center">
                        <span>{distrito}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {instalaciones.length} instalaciones | 
                          {instalaciones.reduce((acc, i) => acc + (i.numContenedores || 0), 0)} contenedores
                        </span>
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
                          {instalaciones
                            .filter(instalacion => !searchTerm || 
                              instalacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              instalacion.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              instalacion.barrio.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((instalacion) => (
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
        </TabsContent>

        <TabsContent value="puntos-verdes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white col-span-1">
              <CardHeader>
                <CardTitle>Litros Recogidos por Distrito</CardTitle>
                <CardDescription>Impacto medioambiental por zona</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart 
                  type="bar" 
                  data={chartDataLitros}
                  options={chartOptions} 
                  className="h-full"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Distribución de Puntos Verdes</CardTitle>
                <CardDescription>
                  Análisis de cobertura y rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Distrito</TableHead>
                      <TableHead className="text-right">Puntos Verdes</TableHead>
                      <TableHead className="text-right">Litros Recogidos</TableHead>
                      <TableHead className="text-right">Litros/Punto</TableHead>
                      <TableHead className="text-right">% del Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPuntosVerdes ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Cargando datos...
                        </TableCell>
                      </TableRow>
                    ) : (
                      distritoStats
                        .sort((a, b) => b.litrosRecogidos - a.litrosRecogidos)
                        .map(stat => (
                        <TableRow key={stat.distrito}>
                          <TableCell className="font-medium">{stat.distrito}</TableCell>
                          <TableCell className="text-right">{stat.puntosVerdes}</TableCell>
                          <TableCell className="text-right">{stat.litrosRecogidos.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {stat.puntosVerdes > 0 
                              ? Math.round(stat.litrosRecogidos / stat.puntosVerdes).toLocaleString()
                              : 0
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {totalLitrosRecogidos > 0
                              ? `${Math.round(stat.litrosRecogidos / totalLitrosRecogidos * 100)}%`
                              : '0%'
                            }
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Relación Instalaciones - Puntos Verdes</CardTitle>
              <CardDescription>
                Análisis de cobertura del servicio por distrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Chart 
                    type="pie" 
                    data={{
                      labels: distritoStats.map(d => d.distrito),
                      datasets: [{
                        data: distritoStats.map(d => d.puntosVerdes),
                        backgroundColor: [
                          'rgba(52, 211, 153, 0.8)',
                          'rgba(99, 102, 241, 0.8)',
                          'rgba(236, 72, 153, 0.8)',
                          'rgba(249, 115, 22, 0.8)',
                          'rgba(155, 135, 245, 0.8)',
                          'rgba(14, 165, 233, 0.8)',
                          'rgba(251, 191, 36, 0.8)',
                        ],
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12,
                          }
                        }
                      }
                    }}
                    className="h-[250px]"
                  />
                </div>
                <div className="col-span-1 lg:col-span-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Distrito</TableHead>
                        <TableHead className="text-right">Instalaciones</TableHead>
                        <TableHead className="text-right">Puntos Verdes</TableHead>
                        <TableHead className="text-right">Ratio de Cobertura</TableHead>
                        <TableHead className="text-right">Eficiencia (L/Inst.)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distritoStats.map(stat => (
                        <TableRow key={stat.distrito}>
                          <TableCell className="font-medium">{stat.distrito}</TableCell>
                          <TableCell className="text-right">{stat.instalaciones}</TableCell>
                          <TableCell className="text-right">{stat.puntosVerdes}</TableCell>
                          <TableCell className="text-right">
                            {stat.instalaciones > 0 
                              ? `${Math.round(stat.puntosVerdes / stat.instalaciones * 100)}%`
                              : '0%'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {stat.instalaciones > 0
                              ? Math.round(stat.litrosRecogidos / stat.instalaciones).toLocaleString()
                              : 0
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="reportes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Resumen Ejecutivo</CardTitle>
                <CardDescription>Métricas claves del rendimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-semibold text-muted-foreground">Ratio de Cobertura</h4>
                    <p className="text-2xl font-bold text-asram">
                      {Math.round(totalPuntosVerdes / (instalaciones.length || 1) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Puntos verdes / Instalaciones
                    </p>
                  </div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-semibold text-muted-foreground">Densidad de Contenedores</h4>
                    <p className="text-2xl font-bold text-asram">
                      {Math.round((totalContenedores / (totalViviendas || 1)) * 100) / 100}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contenedores por vivienda
                    </p>
                  </div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-semibold text-muted-foreground">Rendimiento de Recogida</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(totalLitrosRecogidos / (totalContenedores || 1) * 10) / 10}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Litros por contenedor
                    </p>
                  </div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-semibold text-muted-foreground">Participación Ciudadana</h4>
                    <p className="text-2xl font-bold text-orange-500">
                      {Math.round((totalClientes / (totalViviendas || 1)) * 1000) / 10}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clientes por vivienda
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-semibold mb-2">Distritos con Mayor Rendimiento</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Distrito</TableHead>
                        <TableHead className="text-right">Instalaciones</TableHead>
                        <TableHead className="text-right">Litros Recogidos</TableHead>
                        <TableHead className="text-right">L/Instalación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distritoStats
                        .filter(s => s.instalaciones > 0)
                        .sort((a, b) => (b.litrosRecogidos / b.instalaciones) - (a.litrosRecogidos / a.instalaciones))
                        .slice(0, 5)
                        .map(stat => (
                          <TableRow key={stat.distrito}>
                            <TableCell className="font-medium">{stat.distrito}</TableCell>
                            <TableCell className="text-right">{stat.instalaciones}</TableCell>
                            <TableCell className="text-right">{stat.litrosRecogidos.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {Math.round(stat.litrosRecogidos / stat.instalaciones).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Descargar Informe Ejecutivo
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Análisis de Oportunidades</CardTitle>
                <CardDescription>Áreas de mejora identificadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-semibold mb-2">Distritos con Baja Cobertura</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Distrito</TableHead>
                        <TableHead className="text-right">Instalaciones</TableHead>
                        <TableHead className="text-right">Puntos Verdes</TableHead>
                        <TableHead className="text-right">Cobertura</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distritoStats
                        .filter(s => s.instalaciones > 0)
                        .sort((a, b) => (a.puntosVerdes / a.instalaciones) - (b.puntosVerdes / b.instalaciones))
                        .slice(0, 5)
                        .map(stat => (
                          <TableRow key={stat.distrito}>
                            <TableCell className="font-medium">{stat.distrito}</TableCell>
                            <TableCell className="text-right">{stat.instalaciones}</TableCell>
                            <TableCell className="text-right">{stat.puntosVerdes}</TableCell>
                            <TableCell className="text-right">
                              {Math.round(stat.puntosVerdes / stat.instalaciones * 100)}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-semibold mb-2">Distritos con Potencial de Crecimiento</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Distrito</TableHead>
                        <TableHead className="text-right">Viviendas</TableHead>
                        <TableHead className="text-right">Clientes</TableHead>
                        <TableHead className="text-right">Penetración</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distritoStats
                        .filter(s => s.viviendas > 0)
                        .sort((a, b) => (a.clientes / a.viviendas) - (b.clientes / b.viviendas))
                        .slice(0, 5)
                        .map(stat => (
                          <TableRow key={stat.distrito}>
                            <TableCell className="font-medium">{stat.distrito}</TableCell>
                            <TableCell className="text-right">{stat.viviendas.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{stat.clientes}</TableCell>
                            <TableCell className="text-right">
                              {Math.round(stat.clientes / stat.viviendas * 1000) / 10}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Chart 
                  type="scatter" 
                  data={{
                    datasets: [{
                      label: 'Distritos',
                      data: distritoStats.map(s => ({
                        x: s.instalaciones > 0 ? Math.round(s.viviendas / s.instalaciones) : 0,
                        y: s.instalaciones > 0 ? Math.round(s.litrosRecogidos / s.instalaciones) : 0,
                        r: Math.sqrt(s.instalaciones) * 5,
                        distrito: s.distrito
                      })),
                      backgroundColor: 'rgba(155, 135, 245, 0.6)',
                      borderColor: 'rgba(155, 135, 245, 1)',
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const point = context.raw as any;
                            return [
                              `Distrito: ${point.distrito}`,
                              `Viviendas/Instalación: ${point.x}`,
                              `Litros/Instalación: ${point.y}`
                            ];
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Viviendas por Instalación'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Litros por Instalación'
                        }
                      }
                    }
                  }}
                  className="h-[250px]"
                />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Generar Plan de Acción
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstalacionesView;
