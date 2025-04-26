
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { 
  Building, 
  FolderPlus, 
  Calendar, 
  User, 
  BadgeDollarSign, 
  PieChart, 
  MoreHorizontal, 
  PenLine, 
  Trash2,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFacturacion } from "@/hooks/useFacturacion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { IngresosForm } from "./IngresosForm";
import { GastosForm } from "./GastosForm";
import { toast } from "sonner";

interface ProjectsViewProps {
  onEditProject: (projectId: string) => void;
}

export const ProjectsView = ({ onEditProject }: ProjectsViewProps) => {
  const { projects, loading, deleteProject } = useProjects();
  const { ingresos, gastos, addIngreso, addGasto } = useFacturacion();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isIngresoDialogOpen, setIsIngresoDialogOpen] = useState(false);
  const [isGastoDialogOpen, setIsGastoDialogOpen] = useState(false);

  const getProjectFinancials = (projectId: string) => {
    const projectIngresos = ingresos.filter(i => i.origen === projectId);
    const projectGastos = gastos.filter(g => g.tipo === projectId);
    
    const totalIngresos = projectIngresos.reduce((sum, i) => sum + i.cantidad, 0);
    const totalGastos = projectGastos.reduce((sum, g) => sum + g.cantidad, 0);
    
    // Calculate project profitability (rentabilidad)
    let rentabilidad = 0;
    if (totalIngresos > 0) {
      rentabilidad = ((totalIngresos - totalGastos) / totalIngresos) * 100;
    }
    
    return {
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos,
      rentabilidad: rentabilidad.toFixed(2),
      percentComplete: Math.min(100, Math.round((totalIngresos / (totalIngresos + totalGastos || 1)) * 100)),
    };
  };
  
  const handleAddIngreso = async (data: any) => {
    if (selectedProjectId) {
      await addIngreso({
        ...data,
        origen: selectedProjectId
      });
      setIsIngresoDialogOpen(false);
      toast.success("Ingreso añadido al proyecto correctamente");
    }
  };

  const handleAddGasto = async (data: any) => {
    if (selectedProjectId) {
      await addGasto({
        ...data,
        tipo: selectedProjectId
      });
      setIsGastoDialogOpen(false);
      toast.success("Gasto añadido al proyecto correctamente");
    }
  };
  
  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.estado === activeFilter);
  
  const handleDelete = (projectId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      deleteProject(projectId);
    }
  };

  const handleOpenIngresoDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsIngresoDialogOpen(true);
  };

  const handleOpenGastoDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsGastoDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>
                Gestiona los proyectos financieros de ASRAM
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="activo">Activos</TabsTrigger>
                  <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
                  <TabsTrigger value="completado">Completados</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button 
                variant="outline"
                className="border-dashed border-2"
                onClick={() => onEditProject("")}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando proyectos...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-muted/10">
              <Building className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No hay proyectos</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Comienza creando tu primer proyecto financiero
              </p>
              <Button 
                variant="outline"
                className="border-dashed border-2"
                onClick={() => onEditProject("")} 
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-2">
              {filteredProjects.map((project) => {
                const financials = getProjectFinancials(project.id);
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
                    <div className={`h-2 w-full ${
                      project.estado === 'activo' ? 'bg-blue-500' :
                      project.estado === 'pendiente' ? 'bg-amber-500' :
                      project.estado === 'completado' ? 'bg-green-500' : 
                      'bg-gray-500'
                    }`} />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={
                              project.estado === 'activo' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                              project.estado === 'pendiente' ? 'border-amber-500 text-amber-700 bg-amber-50' :
                              project.estado === 'completado' ? 'border-green-500 text-green-700 bg-green-50' : 
                              'border-gray-500 text-gray-700 bg-gray-50'
                            }
                          >
                            {project.estado === 'activo' ? 'Activo' :
                             project.estado === 'pendiente' ? 'Pendiente' :
                             project.estado === 'completado' ? 'Completado' : 
                             'Cancelado'}
                          </Badge>
                          <CardTitle className="mt-2 text-xl">{project.nombre}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditProject(project.id)}>
                              <PenLine className="mr-2 h-4 w-4" />
                              Editar proyecto
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenIngresoDialog(project.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Añadir ingreso
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenGastoDialog(project.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Añadir gasto
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(project.id)}
                              className="text-red-600 hover:text-red-700 focus:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="mt-1">{project.cliente || "Sin cliente"}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {project.fechaInicio 
                              ? new Date(project.fechaInicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })
                              : "Sin fecha"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{project.responsable || "Sin responsable"}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <div className="flex items-center">
                            <BadgeDollarSign className="h-4 w-4 mr-1 text-blue-600" />
                            <span>Balance:</span>
                          </div>
                          <span className={financials.balance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {financials.balance.toLocaleString()}€
                          </span>
                        </div>
                        
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${financials.percentComplete}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>Ingresos: <span className="text-green-600">{financials.ingresos.toLocaleString()}€</span></div>
                          <div>Gastos: <span className="text-red-600">{financials.gastos.toLocaleString()}€</span></div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-medium">Rentabilidad:</span>
                          <Badge 
                            className={
                              parseFloat(financials.rentabilidad) > 20 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                              parseFloat(financials.rentabilidad) > 0 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                              'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            {financials.rentabilidad}%
                          </Badge>
                        </div>
                      </div>
                      
                      {project.descripcion && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {project.descripcion}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="bg-slate-50 flex justify-between pt-2 pb-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleOpenIngresoDialog(project.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Ingreso
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleOpenGastoDialog(project.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Gasto
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs for adding financial transactions */}
      <Dialog open={isIngresoDialogOpen} onOpenChange={setIsIngresoDialogOpen}>
        <IngresosForm 
          project={projects.find(p => p.id === selectedProjectId)}
          onSave={handleAddIngreso}
          onCancel={() => setIsIngresoDialogOpen(false)}
        />
      </Dialog>
      
      <Dialog open={isGastoDialogOpen} onOpenChange={setIsGastoDialogOpen}>
        <GastosForm 
          project={projects.find(p => p.id === selectedProjectId)}
          onSave={handleAddGasto}
          onCancel={() => setIsGastoDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};
