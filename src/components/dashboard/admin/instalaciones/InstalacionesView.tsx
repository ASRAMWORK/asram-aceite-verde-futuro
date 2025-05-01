
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MapPin, Edit, Trash2, Filter, Users, Droplet, Building, Search, BarChart4 } from "lucide-react";
import { Instalacion } from "@/types";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useRecogidas } from "@/hooks/useRecogidas";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InstalacionForm from "./InstalacionForm";
import InstalacionesStats from "./InstalacionesStats";

const InstalacionesView = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("instalaciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrito, setFilterDistrito] = useState("");
  
  // Load data from various hooks
  const { instalaciones, loading: loadingInstalaciones, deleteInstalacion } = useInstalaciones();
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { recogidas, loading: loadingRecogidas } = useRecogidas();

  // Filter clients by tipo
  const clientes = usuarios.filter(u => 
    u.tipo === 'cliente' || u.tipo === 'comunidad' || u.tipo === 'punto_verde'
  );

  // Get unique distritos for filtering
  const distritos = [...new Set([
    ...puntosVerdes.map(p => p.distrito),
    ...instalaciones.map(i => i.distrito).filter(Boolean),
  ])].filter(Boolean).sort();

  const [selectedInstalacion, setSelectedInstalacion] = useState<Instalacion | null>(null);

  const handleDeleteInstalacion = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta instalación?")) {
      deleteInstalacion(id)
        .then(() => {
          toast.success("Instalación eliminada correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar instalación:", error);
          toast.error("Error al eliminar instalación");
        });
    }
  };

  // Filter functions for search and distrito filter
  const filterData = (data: any[], searchField: string) => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item[searchField] && item[searchField].toLowerCase().includes(searchLower)) ||
        (item.direccion && item.direccion.toLowerCase().includes(searchLower)) ||
        (item.distrito && item.distrito.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply distrito filter
    if (filterDistrito !== "") {
      filtered = filtered.filter(item => 
        item.distrito === filterDistrito
      );
    }
    
    return filtered;
  };

  // Apply filters to each data set
  const filteredInstalaciones = filterData(instalaciones, "nombre");
  const filteredPuntos = filterData(puntosVerdes, "nombre");
  const filteredClientes = filterData(clientes, "nombre");
  const filteredRecogidas = filterData(recogidas, "direccionRecogida");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instalaciones y Puntos</h2>
          <p className="text-muted-foreground">
            Gestión centralizada de instalaciones, puntos verdes y clientes
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="instalaciones" className="flex items-center gap-2">
            <Building className="h-4 w-4" /> Instalaciones
          </TabsTrigger>
          <TabsTrigger value="puntos" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Puntos Verdes
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="recogidas" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" /> Recogidas
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" /> Estadísticas
          </TabsTrigger>
        </TabsList>

        {/* Estadísticas Tab */}
        <TabsContent value="estadisticas">
          <InstalacionesStats />
        </TabsContent>

        {/* Search and filter section - only show for data tabs, not for statistics */}
        {activeTab !== "estadisticas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, dirección o distrito..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {filterDistrito ? filterDistrito : "Filtrar por distrito"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterDistrito("");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}

        {/* Instalaciones Tab */}
        <TabsContent value="instalaciones">
          <Card className="shadow-md border-t-4 border-t-[#EE970D]">
            <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#EE970D]" />
                  <CardTitle>Instalaciones</CardTitle>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedInstalacion(null)}
                      className="bg-[#EE970D] hover:bg-[#D38109] text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Añadir Instalación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedInstalacion ? "Editar Instalación" : "Añadir Instalación"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedInstalacion
                          ? "Edita los campos de la instalación. Haz clic en guardar cuando hayas terminado."
                          : "Añade una nueva instalación a la base de datos. Asegúrate de que todos los campos son correctos."}
                      </DialogDescription>
                    </DialogHeader>
                    <InstalacionForm 
                      instalacion={selectedInstalacion} 
                      onClose={() => setOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Instalaciones registradas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingInstalaciones ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Cargando instalaciones...
                      </TableCell>
                    </TableRow>
                  ) : filteredInstalaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay instalaciones registradas o que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstalaciones.map((instalacion) => (
                      <TableRow key={instalacion.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {instalacion.nombre}
                        </TableCell>
                        <TableCell>{instalacion.direccion}</TableCell>
                        <TableCell>{instalacion.tipo}</TableCell>
                        <TableCell>{instalacion.distrito || "N/A"}</TableCell>
                        <TableCell>{instalacion.contacto}</TableCell>
                        <TableCell>
                          <Badge className={instalacion.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {instalacion.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInstalacion(instalacion);
                              setOpen(true);
                            }}
                            className="hover:bg-[#EE970D]/10 hover:text-[#EE970D]"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInstalacion(instalacion.id)}
                            className="hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Puntos Verdes Tab */}
        <TabsContent value="puntos">
          <Card className="shadow-md border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <CardTitle>Puntos Verdes</CardTitle>
              </div>
              <CardDescription>
                Puntos de recogida registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Viviendas</TableHead>
                    <TableHead>Contenedores</TableHead>
                    <TableHead>Litros Recogidos</TableHead>
                    <TableHead>Contacto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPuntos ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Cargando puntos verdes...
                      </TableCell>
                    </TableRow>
                  ) : filteredPuntos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay puntos verdes registrados o que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPuntos.map((punto) => (
                      <TableRow key={punto.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{punto.direccion}</TableCell>
                        <TableCell>{punto.distrito}</TableCell>
                        <TableCell>{punto.barrio}</TableCell>
                        <TableCell>{punto.numViviendas || "N/A"}</TableCell>
                        <TableCell>{punto.numContenedores || "N/A"}</TableCell>
                        <TableCell>{punto.litrosRecogidos || 0}L</TableCell>
                        <TableCell>{punto.contacto || punto.telefono || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clientes Tab */}
        <TabsContent value="clientes">
          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle>Clientes</CardTitle>
              </div>
              <CardDescription>
                Clientes registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingUsuarios ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Cargando clientes...
                      </TableCell>
                    </TableRow>
                  ) : filteredClientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay clientes registrados o que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                        <TableCell>
                          <Badge className={
                            cliente.tipo === 'punto_verde' ? "bg-green-100 text-green-800" :
                            cliente.tipo === 'comunidad' ? "bg-blue-100 text-blue-800" :
                            "bg-purple-100 text-purple-800"
                          }>
                            {cliente.tipo === 'punto_verde' ? "Punto Verde" : 
                             cliente.tipo === 'comunidad' ? "Comunidad" : "Cliente"}
                          </Badge>
                        </TableCell>
                        <TableCell>{cliente.direccion || "N/A"}</TableCell>
                        <TableCell>{cliente.distrito || "N/A"}</TableCell>
                        <TableCell>{cliente.barrio || "N/A"}</TableCell>
                        <TableCell>{cliente.telefono || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={cliente.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {cliente.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recogidas Tab */}
        <TabsContent value="recogidas">
          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-purple-600" />
                <CardTitle>Recogidas</CardTitle>
              </div>
              <CardDescription>
                Historial de recogidas realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Litros</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRecogidas ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Cargando recogidas...
                      </TableCell>
                    </TableRow>
                  ) : filteredRecogidas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay recogidas registradas o que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecogidas.map((recogida) => (
                      <TableRow key={recogida.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {recogida.direccionRecogida || recogida.direccion || "N/A"}
                        </TableCell>
                        <TableCell>{recogida.cliente || "N/A"}</TableCell>
                        <TableCell>
                          {recogida.fechaRecogida ? format(new Date(recogida.fechaRecogida), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{recogida.distrito || "N/A"}</TableCell>
                        <TableCell>
                          {recogida.litrosRecogidos ? `${recogida.litrosRecogidos}L` : "Pendiente"}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            recogida.completada || recogida.estadoRecogida === 'completada' 
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }>
                            {recogida.completada || recogida.estadoRecogida === 'completada' 
                              ? "Completada" 
                              : "Pendiente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstalacionesView;
