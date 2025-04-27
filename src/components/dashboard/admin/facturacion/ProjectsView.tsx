
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects, Project } from "@/hooks/useProjects";
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
  ChevronDown,
  Circle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LineChart,
  Clock
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
import { Dialog } from "@/components/ui/dialog";
import IngresosForm from "./IngresosForm";
import GastosForm from "./GastosForm";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ProjectsViewProps {
  onEditProject: (projectId: string) => void;
}

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'activo':
      return <Circle className="h-4 w-4 text-blue-500" />;
    case 'pendiente':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'completado':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'cancelado':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-500" />;
  }
};

export const ProjectsView = ({ onEditProject }: ProjectsViewProps) => {
  const { projects, loading, deleteProject } = useProjects();
  const { ingresos, gastos, addIngreso, addGasto } = useFacturacion();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isIngresoDialogOpen, setIsIngresoDialogOpen] = useState(false);
  const [isGastoDialogOpen, setIsGastoDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<{field: keyof Project, direction: 'asc' | 'desc'}>({field: 'createdAt', direction: 'desc'});

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
    
    // Calculate percentage of budget used
    const project = projects.find(p => p.id === projectId);
    const presupuesto = project?.presupuesto || 0;
    const porcentajePresupuesto = presupuesto > 0 ? (totalIngresos / presupuesto) * 100 : 0;
    
    return {
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos,
      rentabilidad: rentabilidad.toFixed(2),
      percentComplete: Math.min(100, Math.round(porcentajePresupuesto)),
      progressColor: 
        totalIngresos > 0 && totalGastos === 0 ? 'bg-green-500' :
        totalIngresos > totalGastos ? 'bg-blue-500' :
        'bg-amber-500',
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
    ? [...projects] 
    : projects.filter(p => p.estado === activeFilter);
  
  // Apply sorting
  filteredProjects.sort((a, b) => {
    const fieldA = a[sortOrder.field];
    const fieldB = b[sortOrder.field];
    
    const compare = (() => {
      if (fieldA === fieldB) return 0;
      
      // Handle dates
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return fieldA < fieldB ? -1 : 1;
      }
      
      // Handle numbers
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return fieldA < fieldB ? -1 : 1;
      }
      
      // Handle strings (including null/undefined)
      const strA = String(fieldA || '');
      const strB = String(fieldB || '');
      return strA.localeCompare(strB);
    })();
    
    // Apply direction
    return sortOrder.direction === 'asc' ? compare : -compare;
  });

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
  
  // Calculate some statistics
  const totalProyectos = projects.length;
  const proyectosActivos = projects.filter(p => p.estado === 'activo').length;
  const totalIngresos = projects.reduce((sum, project) => {
    const financials = getProjectFinancials(project.id);
    return sum + financials.ingresos;
  }, 0);
  const totalGastos = projects.reduce((sum, project) => {
    const financials = getProjectFinancials(project.id);
    return sum + financials.gastos;
  }, 0);
  
  // Function to render project cards
  const renderProjectCards = () => {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-2">
        {filteredProjects.map((project) => {
          const financials = getProjectFinancials(project.id);
          const statusColors = {
            'activo': 'border-blue-500 text-blue-700 bg-blue-50',
            'pendiente': 'border-amber-500 text-amber-700 bg-amber-50',
            'completado': 'border-green-500 text-green-700 bg-green-50',
            'cancelado': 'border-gray-500 text-gray-700 bg-gray-50'
          };
          
          const statusLabels = {
            'activo': 'Activo',
            'pendiente': 'Pendiente',
            'completado': 'Completado',
            'cancelado': 'Cancelado'
          };
          
          return (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-md transition-all border-t-4"
              style={{
                borderTopColor: 
                  project.estado === 'activo' ? '#3b82f6' : 
                  project.estado === 'pendiente' ? '#f59e0b' :
                  project.estado === 'completado' ? '#10b981' :
                  '#6b7280'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge 
                      variant="outline" 
                      className={statusColors[project.estado as keyof typeof statusColors]}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(project.estado)}
                        {statusLabels[project.estado as keyof typeof statusLabels]}
                      </span>
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
                <CardDescription className="mt-1 flex items-center">
                  <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                  {project.cliente || "Sin cliente"}
                </CardDescription>
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
                  <div className="grid grid-cols-2 mb-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Presupuesto</div>
                      <div className="font-medium">{project.presupuesto?.toLocaleString()}€</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Ingresos</div>
                      <div className="font-medium text-green-600">{financials.ingresos.toLocaleString()}€</div>
                    </div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${financials.progressColor} rounded-full`}
                      style={{ width: `${financials.percentComplete}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <div>
                      Progreso: <span className="text-blue-600">{financials.percentComplete}%</span>
                    </div>
                    <div>
                      {financials.balance >= 0 ? (
                        <span className="text-green-600">+{financials.balance.toLocaleString()}€</span>
                      ) : (
                        <span className="text-red-600">{financials.balance.toLocaleString()}€</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-1 items-center">
                    <div className="flex items-center">
                      <LineChart className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="text-sm font-medium">Rentabilidad:</span>
                    </div>
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
                  
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Ingresos</div>
                      <div className="font-medium text-green-600">{financials.ingresos.toLocaleString()}€</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Gastos</div>
                      <div className="font-medium text-red-600">{financials.gastos.toLocaleString()}€</div>
                    </div>
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProyectos}</div>
            <div className="text-xs text-muted-foreground">
              {proyectosActivos} proyectos activos
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalIngresos.toLocaleString()}€
            </div>
            <div className="text-xs text-muted-foreground">
              {ingresos.length} transacciones
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalGastos.toLocaleString()}€
            </div>
            <div className="text-xs text-muted-foreground">
              {gastos.length} transacciones
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(totalIngresos - totalGastos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(totalIngresos - totalGastos).toLocaleString()}€
            </div>
            <Progress 
              className="h-2 mt-2" 
              value={Math.min(100, Math.max(0, (totalIngresos / (totalIngresos + totalGastos || 1)) * 100))} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>
                Gestiona los proyectos financieros
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
          ) : renderProjectCards()}
        </CardContent>
      </Card>
      
      {/* Dialogs for adding financial transactions */}
      {isIngresoDialogOpen && (
        <IngresosForm 
          isOpen={isIngresoDialogOpen}
          onClose={() => setIsIngresoDialogOpen(false)}
          initialData={{
            concepto: "",
            cantidad: 0,
            tipo: "",
            fecha: new Date().toISOString().split("T")[0],
            cliente: projects.find(p => p.id === selectedProjectId)?.cliente || "",
            origen: selectedProjectId || ""
          }}
        />
      )}
      
      {isGastoDialogOpen && (
        <GastosForm 
          isOpen={isGastoDialogOpen}
          onClose={() => setIsGastoDialogOpen(false)}
          initialData={{
            concepto: "",
            cantidad: 0,
            tipo: selectedProjectId || "",
            fecha: new Date().toISOString().split("T")[0],
            proveedor: "",
            numFactura: "",
            notas: ""
          }}
        />
      )}
    </div>
  );
};
