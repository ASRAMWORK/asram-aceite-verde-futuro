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
import { useUsuarios } from "@/hooks/useUsuarios";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import {
  AlertCircle,
  Bell,
  Building2,
  Filter,
  FileSpreadsheet,
  FileText,
  Home,
  Loader2,
  PenLine,
  Trash2,
  Users,
  UserPlus,
  Download,
  Search,
  DropletIcon,
  Container,
  ChevronRight
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
import { AddClienteForm } from "./AddClienteForm";
import type { Usuario, PuntoVerde, Instalacion } from "@/types";
import { distritos, distritosConBarrios, getBarriosByDistrito } from "@/data/madridDistritos";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { usuarios, loading, error, updateUsuario, deleteUsuario, loadUsuariosData } = useUsuarios();
  const { puntosVerdes, loading: loadingPuntos, addPuntoVerde } = usePuntosVerdes();
  const { instalaciones, loading: loadingInstalaciones } = useInstalaciones();
  
  const [isEditingUsuario, setIsEditingUsuario] = useState(false);
  const [isAddingUsuario, setIsAddingUsuario] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [currentTab, setCurrentTab] = useState("todos");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [showNewRegistrations, setShowNewRegistrations] = useState(false);
  
  // Cast usuarios to include our extended type with numViviendas and numContenedores
  const typedUsuarios = usuarios as (Usuario & { numViviendas?: number, numContenedores?: number })[];
  
  // New registrations (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const newRegistrations = typedUsuarios.filter(u => {
    if (!u.createdAt) return false;
    const creationDate = u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt);
    return creationDate > sevenDaysAgo;
  });
  
  // Calculate statistics for dashboard
  const comunidades = instalaciones.length;
  const totalViviendas = instalaciones.reduce((sum, i) => sum + (i.numViviendas || 0), 0);
  const totalContenedores = instalaciones.reduce((sum, i) => sum + (i.numContenedores || 0), 0);
  
  // Calculate average litros per container
  const totalLitrosRecogidos = puntosVerdes.reduce((sum, pv) => sum + (pv.litrosRecogidos || 0), 0);
  const mediaContenedor = totalContenedores > 0 ? (totalLitrosRecogidos / totalContenedores).toFixed(2) : "0";
  
  // Mapear puntos verdes a sus usuarios correspondientes
  const [puntosByDireccion, setPuntosByDireccion] = useState<Record<string, PuntoVerde>>({});
  
  useEffect(() => {
    if (!loadingPuntos && puntosVerdes.length > 0) {
      const puntosMap: Record<string, PuntoVerde> = {};
      puntosVerdes.forEach(punto => {
        if (punto.direccion) {
          puntosMap[punto.direccion.toLowerCase()] = punto;
        }
      });
      setPuntosByDireccion(puntosMap);
    }
  }, [loadingPuntos, puntosVerdes]);
  
  // Función para verificar si un usuario tiene punto verde
  const tienePuntoVerde = (usuario: Usuario): boolean => {
    if (!usuario.direccion) return false;
    return !!puntosByDireccion[usuario.direccion.toLowerCase()];
  };
  
  // Filter usuarios based on the current tab and search term
  const filteredByTab = currentTab === "todos" 
    ? typedUsuarios 
    : typedUsuarios.filter(u => u.tipo === currentTab);
    
  const filteredBySearch = searchTerm 
    ? filteredByTab.filter(u => 
        u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.distrito?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.barrio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByTab;
    
  // Apply distrito filter if selected
  const displayedUsuarios = filterDistrito 
    ? filteredBySearch.filter(u => u.distrito === filterDistrito)
    : filteredBySearch;
  
  const handleOpenEditDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    // Cast usuario to include our extended type with numViviendas and numContenedores
    const typedUsuario = usuario as (Usuario & { numViviendas?: number, numContenedores?: number, litrosRecogidos?: number });
    setFormData({
      ...typedUsuario,
      // Ensure these values are numbers
      numViviendas: typedUsuario.numViviendas || 0,
      numContenedores: typedUsuario.numContenedores || 0,
      litrosRecogidos: typedUsuario.litrosRecogidos || 0
    });
    
    if (usuario.distrito) {
      setFilteredBarrios(getBarriosByDistrito(usuario.distrito));
    }
    
    setIsEditingUsuario(true);
  };
  
  const [formData, setFormData] = useState<Partial<Usuario> & { 
    numViviendas?: number; 
    numContenedores?: number;
    litrosRecogidos?: number;
  }>({});
  
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
    
    // Create a copy of formData without the extra properties
    const { numViviendas, numContenedores, litrosRecogidos, ...basicFormData } = formData;
    
    // Use a type assertion to add the specialized fields back
    const updateData: Partial<Usuario> = {
      ...basicFormData
    };
    
    // Now safely add back the specialized fields with type assertion
    if (numViviendas !== undefined) {
      (updateData as any).numViviendas = numViviendas;
    }
    if (numContenedores !== undefined) {
      (updateData as any).numContenedores = numContenedores;
    }
    if (litrosRecogidos !== undefined) {
      (updateData as any).litrosRecogidos = litrosRecogidos;
    }
    
    await updateUsuario(selectedUsuario.id, updateData);
    
    // Si es una comunidad y cambiaron los datos relevantes para puntos verdes, actualizar/añadir punto verde
    if (selectedUsuario.tipo === "Comunidad de Vecinos") {
      const direccion = formData.direccion || selectedUsuario.direccion;
      if (direccion) {
        const puntoExistente = puntosByDireccion[direccion.toLowerCase()];
        
        if (puntoExistente) {
          // Actualizar punto verde
          const updateData: Partial<PuntoVerde> = {};
          if (formData.distrito) updateData.distrito = formData.distrito;
          if (formData.barrio) updateData.barrio = formData.barrio;
          if (formData.direccion) updateData.direccion = formData.direccion;
          if (formData.numViviendas !== undefined) {
            (updateData as any).numViviendas = formData.numViviendas;
          }
          if (formData.numContenedores !== undefined) {
            (updateData as any).numContenedores = formData.numContenedores;
          }
          if (formData.telefono) updateData.telefono = formData.telefono;
        } else if (formData.numContenedores && formData.numContenedores > 0) {
          // Crear nuevo punto verde
          const nuevoPuntoVerde: Omit<PuntoVerde, "id"> = {
            distrito: formData.distrito || selectedUsuario.distrito || "",
            barrio: formData.barrio || selectedUsuario.barrio || "",
            direccion: formData.direccion || selectedUsuario.direccion || "",
            numViviendas: formData.numViviendas || 0,
            numContenedores: formData.numContenedores || 0,
            telefono: formData.telefono || selectedUsuario.telefono || "",
            litrosRecogidos: 0,
            administradorId: null // Adding the required field
          };
          
          await addPuntoVerde(nuevoPuntoVerde);
        }
      }
    }
    
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

  const handleAddClienteSuccess = () => {
    loadUsuariosData();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">
            Administra los clientes registrados y sus datos de recogida
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            className="bg-asram hover:bg-asram-700"
            onClick={() => setIsAddingUsuario(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo cliente
          </Button>
          <Button 
            variant={showNewRegistrations ? "secondary" : "outline"} 
            className={showNewRegistrations ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : ""}
            onClick={() => setShowNewRegistrations(!showNewRegistrations)}
          >
            <Bell className="mr-2 h-4 w-4" />
            Nuevos registros
            {newRegistrations.length > 0 && (
              <Badge className="ml-2 bg-red-500">{newRegistrations.length}</Badge>
            )}
          </Button>
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

      {/* Panel de nuevos registros */}
      {showNewRegistrations && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Nuevos Registros</CardTitle>
              <Badge variant="outline" className="bg-blue-100 text-blue-600">
                Últimos 7 días
              </Badge>
            </div>
            <CardDescription>
              Usuarios registrados recientemente en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {newRegistrations.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No hay nuevos registros en los últimos 7 días
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newRegistrations.map(usuario => (
                      <TableRow key={usuario.id} className="bg-white">
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{usuario.tipo}</Badge>
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.telefono}</TableCell>
                        <TableCell>
                          {usuario.createdAt instanceof Date 
                            ? usuario.createdAt.toLocaleDateString() 
                            : new Date(usuario.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenEditDialog(usuario)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            <ChevronRight className="mr-1 h-4 w-4" />
                            Ver detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dashboard Cards for Comunidades - Updated with real data */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-asram hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comunidades
            </CardTitle>
            <Building2 className="h-5 w-5 text-asram" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comunidades}</div>
            <p className="text-xs text-muted-foreground">
              instalaciones registradas
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Viviendas
            </CardTitle>
            <Home className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViviendas}</div>
            <p className="text-xs text-muted-foreground">
              viviendas registradas
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contenedores
            </CardTitle>
            <Container className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContenedores}</div>
            <p className="text-xs text-muted-foreground">
              contenedores instalados
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Media/Contenedor
            </CardTitle>
            <DropletIcon className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaContenedor}L</div>
            <p className="text-xs text-muted-foreground">
              litros por contenedor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cliente Tabs and Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-white sticky top-0 z-10 pb-2">
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los clientes registrados
          </CardDescription>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <ScrollArea className="w-full md:w-auto">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full md:w-auto">
                <TabsList className="w-full md:w-auto overflow-x-auto">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="Comunidad de Vecinos">Comunidades</TabsTrigger>
                  <TabsTrigger value="Bar/Restaurante">Bares/Rest.</TabsTrigger>
                  <TabsTrigger value="Hotel">Hoteles</TabsTrigger>
                  <TabsTrigger value="Asociación/Entidad">Asociaciones</TabsTrigger>
                  <TabsTrigger value="Centro Escolar">Centros</TabsTrigger>
                  <TabsTrigger value="Usuario Particular">Particulares</TabsTrigger>
                </TabsList>
              </Tabs>
            </ScrollArea>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setFilterDistrito("");
                  setSearchTerm("");
                }}
                className="h-10 w-10"
                aria-label="Limpiar filtros"
              >
                <Filter className="h-4 w-4" />
              </Button>
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
                  <TableRow className="bg-muted/50">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito/Barrio</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Punto Verde</TableHead>
                    <TableHead className="text-right">Litros</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedUsuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No hay clientes registrados con los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedUsuarios.map((usuario) => (
                      <TableRow key={usuario.id} className={!usuario.activo ? "opacity-50 bg-gray-50" : "hover:bg-muted/20"}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            usuario.tipo === "Comunidad de Vecinos" ? "border-asram text-asram" : 
                            usuario.tipo === "Bar/Restaurante" ? "border-orange-500 text-orange-500" :
                            usuario.tipo === "Hotel" ? "border-blue-500 text-blue-500" :
                            usuario.tipo === "Centro Escolar" ? "border-green-500 text-green-500" :
                            ""
                          }>
                            {usuario.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>{usuario.direccion}</TableCell>
                        <TableCell>{usuario.distrito} / {usuario.barrio}</TableCell>
                        <TableCell>{usuario.telefono}</TableCell>
                        <TableCell>{usuario.frecuenciaRecogida}</TableCell>
                        <TableCell>
                          {usuario.tipo === "Comunidad de Vecinos" ? (
                            tienePuntoVerde(usuario) ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Instalado</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-500 hover:bg-red-50">No instalado</Badge>
                            )
                          ) : (
                            <Badge variant="outline" className="text-gray-400">N/A</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{usuario.litrosRecogidos || 0}L</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(usuario)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteUsuario(usuario.id)}
                              disabled={!usuario.activo}
                              className={!usuario.activo ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-600"}
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
        <CardFooter className="flex justify-between bg-white py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {displayedUsuarios.length} de {usuarios.length} clientes
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit usuario dialog - keeping existing code */}
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
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="activo" className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  className="h-4 w-4 rounded border-gray-300 text-asram focus:ring-asram"
                  checked={formData.activo !== false}
                  onChange={(e) => setFormData({
                    ...formData,
                    activo: e.target.checked
                  })}
                />
                <span className="ml-2">Cliente activo</span>
              </Label>
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

      {/* Add Cliente Form */}
      {isAddingUsuario && (
        <AddClienteForm 
          isOpen={isAddingUsuario} 
          onClose={() => setIsAddingUsuario(false)} 
          onSuccess={handleAddClienteSuccess}
        />
      )}
    </div>
  );
};

export default GestionClientes;
