
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsuarios } from "@/hooks/useUsuarios";
import {
  Building2,
  Filter,
  FileSpreadsheet,
  FileText,
  Home,
  Loader2,
  PenLine,
  Trash2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Usuario } from "@/types";
import { distritos, distritosConBarrios, getBarriosByDistrito } from "@/data/madridDistritos";

const tipos = [
  "Comunidad de Vecinos",
  "Bar/Restaurante",
  "Hotel",
  "Asociación/Entidad",
  "Centro Escolar",
  "Usuario Particular"
];

const frecuencias = [
  "Semanal",
  "Quincenal",
  "Mensual",
  "Bimestral",
  "Trimestral",
  "Bajo demanda"
];

const GestionClientes = () => {
  const { usuarios, loading, error, updateUsuario, deleteUsuario } = useUsuarios();
  const [isEditingUsuario, setIsEditingUsuario] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [currentTab, setCurrentTab] = useState("todos");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  
  // Calculate statistics for each type of client
  const comunidades = usuarios.filter(u => u.tipo === "Comunidad de Vecinos");
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((sum, u) => sum + (u.numViviendas || 0), 0);
  const totalContenedores = comunidades.reduce((sum, u) => sum + (u.numContenedores || 0), 0);
  const mediaContenedor = totalViviendas > 0 ? (totalContenedores / totalViviendas).toFixed(2) : "0";
  
  // Filter usuarios based on the current tab
  const filteredUsuarios = currentTab === "todos" 
    ? usuarios 
    : usuarios.filter(u => u.tipo === currentTab);
    
  // Apply distrito filter if selected
  const displayedUsuarios = filterDistrito 
    ? filteredUsuarios.filter(u => u.distrito === filterDistrito)
    : filteredUsuarios;
  
  const handleOpenEditDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      ...usuario,
      // Ensure these values are numbers
      numViviendas: usuario.numViviendas || 0,
      numContenedores: usuario.numContenedores || 0,
      litrosRecogidos: usuario.litrosRecogidos || 0
    });
    
    if (usuario.distrito) {
      setFilteredBarrios(getBarriosByDistrito(usuario.distrito));
    }
    
    setIsEditingUsuario(true);
  };
  
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("num") || name === "litrosRecogidos" 
        ? parseInt(value) || 0 
        : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // If selecting distrito, update barrios
    if (name === "distrito") {
      const barriosDelDistrito = getBarriosByDistrito(value);
      setFilteredBarrios(barriosDelDistrito);
      
      // Reset barrio if not in the new distrito
      if (formData.barrio && !barriosDelDistrito.includes(formData.barrio)) {
        setFormData({
          ...formData,
          distrito: value,
          barrio: ""
        });
      } else {
        setFormData({
          ...formData,
          distrito: value
        });
      }
    }
  };
  
  const resetForm = () => {
    setFormData({});
    setSelectedUsuario(null);
    setFilteredBarrios([]);
  };
  
  const handleSubmit = async () => {
    if (!selectedUsuario) return;
    
    await updateUsuario(selectedUsuario.id, formData);
    setIsEditingUsuario(false);
    resetForm();
  };
  
  const handleDeleteUsuario = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres desactivar este cliente?")) {
      await deleteUsuario(id);
    }
  };
  
  const handleExportData = (format: 'pdf' | 'excel') => {
    // This would be implemented with a PDF/Excel generation library
    alert(`Exportando datos en formato ${format}. Esta función estará disponible próximamente.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">
            Administra los clientes registrados y sus datos de recogida
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Dashboard Cards for Comunidades */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comunidades
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComunidades}</div>
            <p className="text-xs text-muted-foreground">
              comunidades de vecinos registradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Viviendas
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViviendas}</div>
            <p className="text-xs text-muted-foreground">
              viviendas en comunidades
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contenedores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContenedores}</div>
            <p className="text-xs text-muted-foreground">
              contenedores instalados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Media/Contenedor
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaContenedor}</div>
            <p className="text-xs text-muted-foreground">
              viviendas por contenedor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cliente Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los clientes registrados
          </CardDescription>
          
          <div className="flex justify-between items-center mt-4">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="Comunidad de Vecinos">Comunidades</TabsTrigger>
                <TabsTrigger value="Bar/Restaurante">Bares/Rest.</TabsTrigger>
                <TabsTrigger value="Hotel">Hoteles</TabsTrigger>
                <TabsTrigger value="Asociación/Entidad">Asociaciones</TabsTrigger>
                <TabsTrigger value="Centro Escolar">Centros</TabsTrigger>
                <TabsTrigger value="Usuario Particular">Particulares</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito/Barrio</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead className="text-right">Litros Recogidos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedUsuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No hay clientes registrados con los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{usuario.tipo}</Badge>
                        </TableCell>
                        <TableCell>{usuario.direccion}</TableCell>
                        <TableCell>{usuario.distrito} / {usuario.barrio}</TableCell>
                        <TableCell>{usuario.telefono}</TableCell>
                        <TableCell>{usuario.frecuenciaRecogida}</TableCell>
                        <TableCell className="text-right">{usuario.litrosRecogidos || 0}L</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(usuario)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteUsuario(usuario.id)}
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
            Mostrando {displayedUsuarios.length} clientes
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit usuario dialog */}
      <Dialog open={isEditingUsuario} onOpenChange={setIsEditingUsuario}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Actualiza los datos del cliente seleccionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de cliente</Label>
                <Select
                  value={formData.tipo || ""}
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Datos de contacto</h3>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Select
                  value={formData.distrito || ""}
                  onValueChange={(value) => handleSelectChange("distrito", value)}
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
                  value={formData.barrio || ""}
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Datos de servicio</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numViviendas">Nº de viviendas</Label>
                <Input
                  id="numViviendas"
                  name="numViviendas"
                  type="number"
                  value={formData.numViviendas || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numContenedores">Nº de contenedores</Label>
                <Input
                  id="numContenedores"
                  name="numContenedores"
                  type="number"
                  value={formData.numContenedores || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="litrosRecogidos">Litros recogidos</Label>
                <Input
                  id="litrosRecogidos"
                  name="litrosRecogidos"
                  type="number"
                  value={formData.litrosRecogidos || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frecuenciaRecogida">Frecuencia de recogida</Label>
              <Select
                value={formData.frecuenciaRecogida || ""}
                onValueChange={(value) => handleSelectChange("frecuenciaRecogida", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {frecuencias.map((frecuencia) => (
                    <SelectItem key={frecuencia} value={frecuencia}>
                      {frecuencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingUsuario(false);
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
    </div>
  );
};

export default GestionClientes;
