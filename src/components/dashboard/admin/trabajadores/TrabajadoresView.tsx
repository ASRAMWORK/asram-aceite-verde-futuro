
import React, { useState } from "react";
import { PlusCircle, Search, Filter, User, X, Edit, Trash2, Truck, Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrabajadores } from "@/hooks/useTrabajadores";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useRutas } from "@/hooks/useRutas";
import TrabajadorForm from "./TrabajadorForm";
import TrabajadorDetalle from "./TrabajadorDetalle";
import AsignacionTurnos from "./AsignacionTurnos";
import { Trabajador } from "@/types";

const ITEMS_PER_PAGE = 10;

const TrabajadoresView = () => {
  const { trabajadores, loading, addTrabajador, updateTrabajador, deleteTrabajador } = useTrabajadores();
  const { vehiculos } = useVehiculos();
  const { rutas } = useRutas();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rolFilter, setRolFilter] = useState<string>("");
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAsignacionDialog, setOpenAsignacionDialog] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  
  const [activeTab, setActiveTab] = useState("lista");

  // Filtrar trabajadores
  const filteredTrabajadores = trabajadores.filter((trabajador) => {
    const matchesSearch = 
      searchTerm === "" ||
      trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = rolFilter === "" || trabajador.roles.includes(rolFilter as any);
    const matchesEstado = estadoFilter === "" || 
      (estadoFilter === "activo" && trabajador.activo) || 
      (estadoFilter === "inactivo" && !trabajador.activo);
    
    return matchesSearch && matchesRol && matchesEstado;
  });

  // Paginación
  const totalPages = Math.ceil(filteredTrabajadores.length / ITEMS_PER_PAGE);
  const paginatedTrabajadores = filteredTrabajadores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddTrabajador = async (data: any) => {
    try {
      await addTrabajador({
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento),
        fechaAlta: new Date(data.fechaAlta),
      });
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error al añadir trabajador:", error);
    }
  };

  const handleEditTrabajador = async (data: any) => {
    if (selectedTrabajador) {
      try {
        await updateTrabajador(selectedTrabajador.id, {
          ...data,
          fechaNacimiento: new Date(data.fechaNacimiento),
          fechaAlta: new Date(data.fechaAlta),
        });
        setOpenEditDialog(false);
      } catch (error) {
        console.error("Error al actualizar trabajador:", error);
      }
    }
  };

  const handleDeleteTrabajador = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas desactivar este trabajador?")) {
      try {
        await deleteTrabajador(id);
      } catch (error) {
        console.error("Error al eliminar trabajador:", error);
      }
    }
  };

  const handleViewTrabajador = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
    setOpenDetailDialog(true);
  };

  const handleAsignarTrabajador = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
    setOpenAsignacionDialog(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRolBadgeColor = (rol: string) => {
    switch (rol) {
      case 'recolector': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'conductor': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'supervisor': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'analista': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'administrador': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'gestor': return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case 'recolector': return 'Recolector';
      case 'conductor': return 'Conductor';
      case 'supervisor': return 'Supervisor';
      case 'analista': return 'Analista';
      case 'administrador': return 'Administrador';
      case 'gestor': return 'Gestor';
      default: return rol;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando datos de trabajadores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Trabajadores</h2>
        <Button onClick={() => setOpenAddDialog(true)} className="bg-asram">
          <PlusCircle className="h-4 w-4 mr-2" />
          Añadir Trabajador
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Lista de Trabajadores</TabsTrigger>
          <TabsTrigger value="metricas">Métricas y Desempeño</TabsTrigger>
          <TabsTrigger value="asignaciones">Asignaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nombre, DNI o email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                
                <Select value={rolFilter} onValueChange={(value) => {
                  setRolFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      {rolFilter ? `Rol: ${getRolLabel(rolFilter)}` : "Filtrar por rol"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los roles</SelectItem>
                    <SelectItem value="recolector">Recolector</SelectItem>
                    <SelectItem value="conductor">Conductor</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="analista">Analista</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={estadoFilter} onValueChange={(value) => {
                  setEstadoFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      {estadoFilter ? `Estado: ${estadoFilter === "activo" ? "Activo" : "Inactivo"}` : "Filtrar por estado"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>DNI/NIE</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTrabajadores.length > 0 ? (
                      paginatedTrabajadores.map((trabajador) => (
                        <TableRow key={trabajador.id}>
                          <TableCell>
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={trabajador.foto} alt={`${trabajador.nombre} ${trabajador.apellidos}`} />
                              <AvatarFallback>
                                {trabajador.nombre.charAt(0)}{trabajador.apellidos.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {trabajador.nombre} {trabajador.apellidos}
                          </TableCell>
                          <TableCell>{trabajador.dni}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {trabajador.roles.slice(0, 2).map((rol) => (
                                <Badge key={rol} variant="outline" className={getRolBadgeColor(rol)}>
                                  {getRolLabel(rol)}
                                </Badge>
                              ))}
                              {trabajador.roles.length > 2 && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                  +{trabajador.roles.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={trabajador.activo ? "default" : "secondary"} className={
                              trabajador.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }>
                              {trabajador.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell>{trabajador.telefono}</TableCell>
                          <TableCell>{trabajador.email}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <User className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewTrabajador(trabajador)}>
                                  <User className="mr-2 h-4 w-4" /> Ver detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedTrabajador(trabajador);
                                  setOpenEditDialog(true);
                                }}>
                                  <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleAsignarTrabajador(trabajador)}>
                                  <Truck className="mr-2 h-4 w-4" /> Asignar rutas
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Functionality for schedule assignment
                                  toast.info("Funcionalidad en desarrollo");
                                }}>
                                  <Calendar className="mr-2 h-4 w-4" /> Gestionar turnos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTrabajador(trabajador.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> {trabajador.activo ? "Desactivar" : "Activar"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron trabajadores con los filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredTrabajadores.length)} de {" "}
                    {filteredTrabajadores.length} registros
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metricas">
          <Card className="p-6">
            <div className="text-center py-10">
              <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Módulo de métricas en desarrollo</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Próximamente podrás visualizar métricas de desempeño, litros recogidos, horas trabajadas e incidencias.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="asignaciones">
          <Card className="p-6">
            <div className="text-center py-10">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Módulo de asignaciones en desarrollo</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Próximamente podrás gestionar asignaciones masivas de rutas, vehículos y horarios.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo Añadir Trabajador */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Trabajador</DialogTitle>
            <DialogDescription>
              Complete el formulario para añadir un nuevo trabajador al sistema.
            </DialogDescription>
          </DialogHeader>
          <TrabajadorForm 
            onSubmit={handleAddTrabajador} 
            onCancel={() => setOpenAddDialog(false)}
            vehiculos={vehiculos.filter(v => v.estado === 'disponible')}
            rutas={rutas}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo Editar Trabajador */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Trabajador</DialogTitle>
            <DialogDescription>
              Modifique la información del trabajador.
            </DialogDescription>
          </DialogHeader>
          {selectedTrabajador && (
            <TrabajadorForm 
              initialData={selectedTrabajador}
              onSubmit={handleEditTrabajador} 
              onCancel={() => setOpenEditDialog(false)}
              vehiculos={vehiculos.filter(v => v.estado === 'disponible' || v.id === selectedTrabajador.vehiculoAsignado)}
              rutas={rutas}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Detalle Trabajador */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Trabajador</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4" 
              onClick={() => setOpenDetailDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedTrabajador && (
            <TrabajadorDetalle 
              trabajador={selectedTrabajador} 
              onEdit={() => {
                setOpenDetailDialog(false);
                setOpenEditDialog(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Asignación de Rutas */}
      <Dialog open={openAsignacionDialog} onOpenChange={setOpenAsignacionDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Asignación de Rutas y Turnos</DialogTitle>
            <DialogDescription>
              Gestione las rutas y turnos asignados al trabajador.
            </DialogDescription>
          </DialogHeader>
          {selectedTrabajador && (
            <AsignacionTurnos 
              trabajador={selectedTrabajador}
              onClose={() => setOpenAsignacionDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrabajadoresView;
