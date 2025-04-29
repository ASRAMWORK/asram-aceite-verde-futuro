import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFacturacion } from "@/hooks/useFacturacion";
import { ProjectsView } from "./ProjectsView";
import { ProjectForm } from "./ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { Ingreso, Gasto } from "@/types";
import { toast } from "sonner";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileText, 
  Trash2, 
  Edit, 
  MoreHorizontal,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FolderKanban
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IngresosForm from "./IngresosForm";
import GastosForm from "./GastosForm";

export const FacturacionView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showIngresoForm, setShowIngresoForm] = useState(false);
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  const { ingresos, gastos, addIngreso, addGasto, deleteIngreso, deleteGasto } = useFacturacion();
  const { projects, addProject, updateProject } = useProjects();
  
  // Calculate summary statistics
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balance = totalIngresos - totalGastos;
  
  // Get current month's data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const ingresosThisMonth = ingresos.filter(ingreso => {
    const ingresoDate = new Date(ingreso.fecha);
    return ingresoDate.getMonth() === currentMonth && ingresoDate.getFullYear() === currentYear;
  });
  
  const gastosThisMonth = gastos.filter(gasto => {
    const gastoDate = new Date(gasto.fecha);
    return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear;
  });
  
  const totalIngresosThisMonth = ingresosThisMonth.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastosThisMonth = gastosThisMonth.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balanceThisMonth = totalIngresosThisMonth - totalGastosThisMonth;
  
  // Filter transactions based on search and filters
  const filteredIngresos = ingresos.filter(ingreso => {
    const matchesSearch = searchTerm === "" || 
      ingreso.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = filterMonth === "" || 
      (ingreso.fecha && new Date(ingreso.fecha).getMonth() + 1 === parseInt(filterMonth));
    
    const matchesYear = filterYear === "" || 
      (ingreso.fecha && new Date(ingreso.fecha).getFullYear() === parseInt(filterYear));
    
    const matchesCategory = filterCategory === "" || ingreso.categoria === filterCategory;
    
    const matchesStatus = filterStatus === "" || ingreso.estado === filterStatus;
    
    return matchesSearch && matchesMonth && matchesYear && matchesCategory && matchesStatus;
  });
  
  const filteredGastos = gastos.filter(gasto => {
    const matchesSearch = searchTerm === "" || 
      gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = filterMonth === "" || 
      (gasto.fecha && new Date(gasto.fecha).getMonth() + 1 === parseInt(filterMonth));
    
    const matchesYear = filterYear === "" || 
      (gasto.fecha && new Date(gasto.fecha).getFullYear() === parseInt(filterYear));
    
    const matchesCategory = filterCategory === "" || gasto.categoria === filterCategory;
    
    const matchesStatus = filterStatus === "" || gasto.estado === filterStatus;
    
    return matchesSearch && matchesMonth && matchesYear && matchesCategory && matchesStatus;
  });
  
  // Handle form submissions
  const handleAddIngreso = async (data: Partial<Omit<Ingreso, "id">>) => {
    await addIngreso(data);
    setShowIngresoForm(false);
    toast.success("Ingreso añadido correctamente");
  };
  
  const handleAddGasto = async (data: Partial<Omit<Gasto, "id">>) => {
    await addGasto(data);
    setShowGastoForm(false);
    toast.success("Gasto añadido correctamente");
  };
  
  const handleSaveProject = async (data: any) => {
    if (editingProjectId) {
      await updateProject(editingProjectId, data);
      toast.success("Proyecto actualizado correctamente");
    } else {
      await addProject(data);
      toast.success("Proyecto añadido correctamente");
    }
    setShowProjectForm(false);
    setEditingProjectId(null);
  };
  
  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setShowProjectForm(true);
  };
  
  // Generate month options
  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];
  
  // Generate year options (last 5 years through next year)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYearNum - 4 + i).toString());
  
  // Categories for filtering
  const categories = [
    { value: "general", label: "General" },
    { value: "ventas", label: "Ventas" },
    { value: "servicios", label: "Servicios" },
    { value: "subvenciones", label: "Subvenciones" },
    { value: "donaciones", label: "Donaciones" },
    { value: "personal", label: "Personal" },
    { value: "materiales", label: "Materiales" },
    { value: "transporte", label: "Transporte" },
    { value: "alquiler", label: "Alquiler" },
    { value: "suministros", label: "Suministros" },
    { value: "marketing", label: "Marketing" },
    { value: "otros", label: "Otros" },
  ];
  
  // Status options for filtering
  const statusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "pagado", label: "Pagado" },
    { value: "cancelado", label: "Cancelado" },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Facturación</h2>
        <p className="text-muted-foreground">
          Gestiona los ingresos, gastos y proyectos financieros
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIngresos.toLocaleString()}€</div>
                <p className="text-xs text-muted-foreground">
                  {ingresos.length} transacciones
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gastos Totales
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGastos.toLocaleString()}€</div>
                <p className="text-xs text-muted-foreground">
                  {gastos.length} transacciones
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Balance
                </CardTitle>
                {balance >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.toLocaleString()}€
                </div>
                <p className="text-xs text-muted-foreground">
                  {balance >= 0 ? 'Positivo' : 'Negativo'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Proyectos Activos
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.estado === 'activo').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  De {projects.length} proyectos totales
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Mes Actual</CardTitle>
                <CardDescription>
                  {format(new Date(currentYear, currentMonth), 'MMMM yyyy', { locale: es })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 mr-4">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Ingresos:</span>
                    </div>
                    <span className="text-green-600 font-medium">{totalIngresosThisMonth.toLocaleString()}€</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 mr-4">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Gastos:</span>
                    </div>
                    <span className="text-red-600 font-medium">{totalGastosThisMonth.toLocaleString()}€</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 mr-4">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Balance:</span>
                    </div>
                    <span className={`font-medium ${balanceThisMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {balanceThisMonth.toLocaleString()}€
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Gestiona tus finanzas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setShowIngresoForm(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Ingreso
                  </Button>
                  
                  <Button 
                    onClick={() => setShowGastoForm(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Gasto
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setEditingProjectId(null);
                      setShowProjectForm(true);
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proyecto
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("ingresos")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Informes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Últimos Ingresos</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("ingresos")}
                  >
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingresos.slice(0, 5).map((ingreso) => (
                      <TableRow key={ingreso.id}>
                        <TableCell>
                          {ingreso.fecha ? format(new Date(ingreso.fecha), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{ingreso.concepto}</TableCell>
                        <TableCell className="text-right font-medium">
                          {ingreso.cantidad.toLocaleString()}€
                        </TableCell>
                      </TableRow>
                    ))}
                    {ingresos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No hay ingresos registrados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Últimos Gastos</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("gastos")}
                  >
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gastos.slice(0, 5).map((gasto) => (
                      <TableRow key={gasto.id}>
                        <TableCell>
                          {gasto.fecha ? format(new Date(gasto.fecha), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{gasto.concepto}</TableCell>
                        <TableCell className="text-right font-medium">
                          {gasto.cantidad.toLocaleString()}€
                        </TableCell>
                      </TableRow>
                    ))}
                    {gastos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No hay gastos registrados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ingresos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ingresos</CardTitle>
                  <CardDescription>
                    Gestiona todos los ingresos de la organización
                  </CardDescription>
                </div>
                <Button onClick={() => setShowIngresoForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Ingreso
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por concepto o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los meses</SelectItem>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIngresos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No se encontraron ingresos con los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIngresos.map((ingreso) => (
                      <TableRow key={ingreso.id}>
                        <TableCell>
                          {ingreso.fecha ? format(new Date(ingreso.fecha), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{ingreso.concepto}</TableCell>
                        <TableCell>{ingreso.cliente}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ingreso.categoria || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              ingreso.estado === 'pagado' ? 'default' : 
                              ingreso.estado === 'pendiente' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {ingreso.estado || 'Pendiente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {ingreso.cantidad.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteIngreso(ingreso.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredIngresos.length} de {ingresos.length} ingresos
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gastos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gastos</CardTitle>
                  <CardDescription>
                    Gestiona todos los gastos de la organización
                  </CardDescription>
                </div>
                <Button onClick={() => setShowGastoForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Gasto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por concepto o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los meses</SelectItem>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGastos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No se encontraron gastos con los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGastos.map((gasto) => (
                      <TableRow key={gasto.id}>
                        <TableCell>
                          {gasto.fecha ? format(new Date(gasto.fecha), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{gasto.concepto}</TableCell>
                        <TableCell>{gasto.proveedor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {gasto.categoria || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              gasto.estado === 'pagado' ? 'default' : 
                              gasto.estado === 'pendiente' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {gasto.estado || 'Pendiente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {gasto.cantidad.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteGasto(gasto.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredGastos.length} de {gastos.length} gastos
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="proyectos">
          <ProjectsView onEditProject={handleEditProject} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs for forms */}
      {showIngresoForm && (
        <IngresosForm 
          isOpen={true} 
          onClose={() => setShowIngresoForm(false)}
          onSubmit={handleAddIngreso}
          onCancel={() => setShowIngresoForm(false)}
        />
      )}
      
      {showGastoForm && (
        <GastosForm 
          isOpen={true} 
          onClose={() => setShowGastoForm(false)}
          onSubmit={handleAddGasto}
          onCancel={() => setShowGastoForm(false)}
        />
      )}
      
      {showProjectForm && (
        <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProjectId ? "Editar Proyecto" : "Nuevo Proyecto"}
              </DialogTitle>
              <DialogDescription>
                {editingProjectId 
                  ? "Modifica los detalles del proyecto existente" 
                  : "Crea un nuevo proyecto financiero"}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm 
              onSubmit={handleSaveProject} 
              onCancel={() => {
                setShowProjectForm(false);
                setEditingProjectId(null);
              }}
              projectId={editingProjectId || ""}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
