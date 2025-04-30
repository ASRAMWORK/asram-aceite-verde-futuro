
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, FileSpreadsheet, FileCheck, CircleDollarSign, ArrowUpDown, CreditCard, Receipt, BanknoteIcon } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacturacion } from "@/hooks/useFacturacion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Ingreso, Gasto } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

export interface ProjectsViewProps {
  onOpenProjectForm: () => void;
  onEditProject: (project: any) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  onOpenProjectForm, 
  onEditProject 
}) => {
  const { projects, deleteProject, getProjectFinancials } = useProjects();
  const { addIngreso, addGasto } = useFacturacion();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Estados para los formularios de transacciones
  const [isIngresoFormOpen, setIsIngresoFormOpen] = useState(false);
  const [isGastoFormOpen, setIsGastoFormOpen] = useState(false);
  const [isFacturaFormOpen, setIsFacturaFormOpen] = useState(false);
  
  // Estados para los formularios
  const [ingresoForm, setIngresoForm] = useState({
    concepto: '',
    cantidad: 0,
    fecha: new Date(),
    cliente: '',
    numFactura: '',
    estado: 'cobrada',
    categoria: 'venta'
  });
  
  const [gastoForm, setGastoForm] = useState({
    concepto: '',
    cantidad: 0,
    fecha: new Date(),
    proveedor: '',
    numFactura: '',
    estado: 'pagada',
    categoria: 'compra'
  });
  
  const [facturaForm, setFacturaForm] = useState({
    concepto: '',
    cantidad: 0,
    fecha: new Date(),
    cliente: '',
    numFactura: '',
    estado: 'pendiente',
    categoria: 'venta'
  });

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este proyecto?")) {
      await deleteProject(id);
    }
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const handleAddIngreso = (project: any) => {
    setSelectedProject(project);
    setIngresoForm({
      ...ingresoForm,
      concepto: `Ingreso - ${project.nombre}`,
      cliente: project.cliente || '',
    });
    setIsIngresoFormOpen(true);
  };

  const handleAddGasto = (project: any) => {
    setSelectedProject(project);
    setGastoForm({
      ...gastoForm,
      concepto: `Gasto - ${project.nombre}`,
    });
    setIsGastoFormOpen(true);
  };

  const handleAddFactura = (project: any) => {
    setSelectedProject(project);
    setFacturaForm({
      ...facturaForm,
      concepto: `Factura - ${project.nombre}`,
      cliente: project.cliente || '',
    });
    setIsFacturaFormOpen(true);
  };

  const handleSubmitIngreso = async () => {
    try {
      if (!ingresoForm.concepto || ingresoForm.cantidad <= 0) {
        toast.error("Por favor complete los campos requeridos");
        return;
      }

      await addIngreso({
        concepto: ingresoForm.concepto,
        cantidad: ingresoForm.cantidad,
        fecha: ingresoForm.fecha,
        cliente: ingresoForm.cliente,
        numFactura: ingresoForm.numFactura,
        estado: ingresoForm.estado,
        categoria: ingresoForm.categoria,
        origen: selectedProject.id,
        tipo: selectedProject.id
      });

      setIsIngresoFormOpen(false);
      setIngresoForm({
        concepto: '',
        cantidad: 0,
        fecha: new Date(),
        cliente: '',
        numFactura: '',
        estado: 'cobrada',
        categoria: 'venta'
      });
      toast.success("Ingreso añadido correctamente");
    } catch (error) {
      console.error("Error al añadir ingreso:", error);
      toast.error("Error al añadir ingreso");
    }
  };

  const handleSubmitGasto = async () => {
    try {
      if (!gastoForm.concepto || gastoForm.cantidad <= 0) {
        toast.error("Por favor complete los campos requeridos");
        return;
      }

      await addGasto({
        concepto: gastoForm.concepto,
        cantidad: gastoForm.cantidad,
        fecha: gastoForm.fecha,
        proveedor: gastoForm.proveedor,
        numFactura: gastoForm.numFactura,
        estado: gastoForm.estado,
        categoria: gastoForm.categoria,
        tipo: selectedProject.id
      });

      setIsGastoFormOpen(false);
      setGastoForm({
        concepto: '',
        cantidad: 0,
        fecha: new Date(),
        proveedor: '',
        numFactura: '',
        estado: 'pagada',
        categoria: 'compra'
      });
      toast.success("Gasto añadido correctamente");
    } catch (error) {
      console.error("Error al añadir gasto:", error);
      toast.error("Error al añadir gasto");
    }
  };

  const handleSubmitFactura = async () => {
    try {
      if (!facturaForm.concepto || facturaForm.cantidad <= 0) {
        toast.error("Por favor complete los campos requeridos");
        return;
      }

      await addIngreso({
        concepto: facturaForm.concepto,
        cantidad: facturaForm.cantidad,
        fecha: facturaForm.fecha,
        cliente: facturaForm.cliente,
        numFactura: facturaForm.numFactura,
        estado: 'pendiente',
        categoria: 'factura',
        origen: selectedProject.id,
        tipo: selectedProject.id
      });

      setIsFacturaFormOpen(false);
      setFacturaForm({
        concepto: '',
        cantidad: 0,
        fecha: new Date(),
        cliente: '',
        numFactura: '',
        estado: 'pendiente',
        categoria: 'venta'
      });
      toast.success("Factura pendiente añadida correctamente");
    } catch (error) {
      console.error("Error al añadir factura:", error);
      toast.error("Error al añadir factura pendiente");
    }
  };

  const getProjectFinancialSummary = (project: any) => {
    if (!project?.id) return { ingresos: 0, gastos: 0, balance: 0 };
    const financials = getProjectFinancials(project.id);
    return {
      ingresos: financials.totalIngresos,
      gastos: financials.totalGastos,
      balance: financials.balance
    };
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Proyectos</h2>
          <p className="text-muted-foreground">
            Gestiona los proyectos y facturación asociada
          </p>
        </div>
        <Button 
          onClick={onOpenProjectForm} 
          className="bg-[#EE970D] hover:bg-[#D38109] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      <Card className="shadow-md border-t-4 border-t-[#EE970D]">
        <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#EE970D]" />
            <CardTitle>Proyectos activos</CardTitle>
          </div>
          <CardDescription>
            Proyectos con facturación en curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "activo")
                  .map((project) => {
                    const financials = getProjectFinancialSummary(project);
                    return (
                      <TableRow key={project.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewProject(project)}>
                        <TableCell className="font-medium">{project.nombre}</TableCell>
                        <TableCell>{project.cliente}</TableCell>
                        <TableCell>
                          {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {financials.ingresos.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {financials.gastos.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell className={`text-right font-bold ${getBalanceColor(financials.balance)}`}>
                          {financials.balance.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddIngreso(project);
                              }}
                              className="hover:bg-green-50 hover:text-green-600 h-8 w-8"
                              title="Añadir ingreso"
                            >
                              <BanknoteIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddGasto(project);
                              }}
                              className="hover:bg-red-50 hover:text-red-600 h-8 w-8"
                              title="Añadir gasto"
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFactura(project);
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600 h-8 w-8"
                              title="Añadir factura pendiente"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project);
                              }}
                              className="hover:bg-[#EE970D]/10 hover:text-[#EE970D] h-8 w-8"
                              title="Editar proyecto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project.id);
                              }}
                              className="hover:bg-red-50 text-red-500 h-8 w-8"
                              title="Eliminar proyecto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {projects.filter(p => p.estado === "activo").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      No hay proyectos activos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-t-4 border-t-blue-400">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-500" />
            <CardTitle>Proyectos completados</CardTitle>
          </div>
          <CardDescription>
            Proyectos finalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "completado")
                  .map((project) => {
                    const financials = getProjectFinancialSummary(project);
                    return (
                      <TableRow key={project.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewProject(project)}>
                        <TableCell className="font-medium">{project.nombre}</TableCell>
                        <TableCell>{project.cliente}</TableCell>
                        <TableCell>
                          {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {financials.ingresos.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {financials.gastos.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell className={`text-right font-bold ${getBalanceColor(financials.balance)}`}>
                          {financials.balance.toLocaleString('es-ES')}€
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completado</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {projects.filter(p => p.estado === "completado").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No hay proyectos completados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[90%] sm:max-w-[80%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#EE970D]" />
              Detalles del Proyecto: {selectedProject?.nombre}
            </SheetTitle>
            <SheetDescription>
              {selectedProject?.descripcion || 'Sin descripción'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {selectedProject && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-sm">
                    <CardHeader className="bg-green-50 py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BanknoteIcon className="h-4 w-4 text-green-600" />
                        Ingresos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                      <p className="text-2xl font-bold text-green-600">
                        {getProjectFinancialSummary(selectedProject).ingresos.toLocaleString('es-ES')}€
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="bg-red-50 py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-red-600" />
                        Gastos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                      <p className="text-2xl font-bold text-red-600">
                        {getProjectFinancialSummary(selectedProject).gastos.toLocaleString('es-ES')}€
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="bg-blue-50 py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-blue-600" />
                        Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                      <p className={`text-2xl font-bold ${getBalanceColor(getProjectFinancialSummary(selectedProject).balance)}`}>
                        {getProjectFinancialSummary(selectedProject).balance.toLocaleString('es-ES')}€
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border mt-6">
                  <Tabs defaultValue="ingresos" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                      <TabsTrigger value="gastos">Gastos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ingresos" className="p-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead>Concepto</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Cliente</TableHead>
                              <TableHead className="text-right">Importe</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProject && getProjectFinancials(selectedProject.id).ingresos.length > 0 ? (
                              getProjectFinancials(selectedProject.id).ingresos.map((ingreso: Ingreso) => (
                                <TableRow key={ingreso.id}>
                                  <TableCell>{ingreso.concepto}</TableCell>
                                  <TableCell>
                                    {ingreso.fecha ? format(new Date(ingreso.fecha), "dd/MM/yyyy") : "N/A"}
                                  </TableCell>
                                  <TableCell>{ingreso.cliente || "N/A"}</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {ingreso.cantidad.toLocaleString('es-ES')}€
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={
                                      ingreso.estado === 'cobrada' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }>
                                      {ingreso.estado === 'cobrada' ? 'Cobrada' : 'Pendiente'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                  No hay ingresos registrados para este proyecto
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="gastos" className="p-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead>Concepto</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Proveedor</TableHead>
                              <TableHead className="text-right">Importe</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProject && getProjectFinancials(selectedProject.id).gastos.length > 0 ? (
                              getProjectFinancials(selectedProject.id).gastos.map((gasto: Gasto) => (
                                <TableRow key={gasto.id}>
                                  <TableCell>{gasto.concepto}</TableCell>
                                  <TableCell>
                                    {gasto.fecha ? format(new Date(gasto.fecha), "dd/MM/yyyy") : "N/A"}
                                  </TableCell>
                                  <TableCell>{gasto.proveedor || "N/A"}</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {gasto.cantidad.toLocaleString('es-ES')}€
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={
                                      gasto.estado === 'pagada' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }>
                                      {gasto.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                  No hay gastos registrados para este proyecto
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Dialog for adding income */}
      <Dialog open={isIngresoFormOpen} onOpenChange={setIsIngresoFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-green-600" />
              Añadir ingreso al proyecto
            </DialogTitle>
            <DialogDescription>
              Rellene los campos para registrar un nuevo ingreso para {selectedProject?.nombre || 'este proyecto'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concepto" className="text-right">
                Concepto
              </Label>
              <Input
                id="concepto"
                value={ingresoForm.concepto}
                onChange={(e) => setIngresoForm({...ingresoForm, concepto: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad (€)
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={ingresoForm.cantidad}
                onChange={(e) => setIngresoForm({...ingresoForm, cantidad: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="col-span-3 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {ingresoForm.fecha ? format(ingresoForm.fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={ingresoForm.fecha}
                    onSelect={(date) => setIngresoForm({...ingresoForm, fecha: date || new Date()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cliente" className="text-right">
                Cliente
              </Label>
              <Input
                id="cliente"
                value={ingresoForm.cliente}
                onChange={(e) => setIngresoForm({...ingresoForm, cliente: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numFactura" className="text-right">
                Núm. Factura
              </Label>
              <Input
                id="numFactura"
                value={ingresoForm.numFactura}
                onChange={(e) => setIngresoForm({...ingresoForm, numFactura: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select
                value={ingresoForm.estado}
                onValueChange={(value) => setIngresoForm({...ingresoForm, estado: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cobrada">Cobrada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Select
                value={ingresoForm.categoria}
                onValueChange={(value) => setIngresoForm({...ingresoForm, categoria: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="subvencion">Subvención</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsIngresoFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" className="bg-green-600 hover:bg-green-700" onClick={handleSubmitIngreso}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding expenses */}
      <Dialog open={isGastoFormOpen} onOpenChange={setIsGastoFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-red-600" />
              Añadir gasto al proyecto
            </DialogTitle>
            <DialogDescription>
              Rellene los campos para registrar un nuevo gasto para {selectedProject?.nombre || 'este proyecto'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concepto" className="text-right">
                Concepto
              </Label>
              <Input
                id="concepto"
                value={gastoForm.concepto}
                onChange={(e) => setGastoForm({...gastoForm, concepto: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad (€)
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={gastoForm.cantidad}
                onChange={(e) => setGastoForm({...gastoForm, cantidad: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="col-span-3 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {gastoForm.fecha ? format(gastoForm.fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={gastoForm.fecha}
                    onSelect={(date) => setGastoForm({...gastoForm, fecha: date || new Date()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedor" className="text-right">
                Proveedor
              </Label>
              <Input
                id="proveedor"
                value={gastoForm.proveedor}
                onChange={(e) => setGastoForm({...gastoForm, proveedor: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numFactura" className="text-right">
                Núm. Factura
              </Label>
              <Input
                id="numFactura"
                value={gastoForm.numFactura}
                onChange={(e) => setGastoForm({...gastoForm, numFactura: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select
                value={gastoForm.estado}
                onValueChange={(value) => setGastoForm({...gastoForm, estado: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Select
                value={gastoForm.categoria}
                onValueChange={(value) => setGastoForm({...gastoForm, categoria: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="impuesto">Impuesto</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsGastoFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleSubmitGasto}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding pending invoices */}
      <Dialog open={isFacturaFormOpen} onOpenChange={setIsFacturaFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Añadir factura pendiente
            </DialogTitle>
            <DialogDescription>
              Rellene los campos para registrar una nueva factura pendiente para {selectedProject?.nombre || 'este proyecto'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concepto" className="text-right">
                Concepto
              </Label>
              <Input
                id="concepto"
                value={facturaForm.concepto}
                onChange={(e) => setFacturaForm({...facturaForm, concepto: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad (€)
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={facturaForm.cantidad}
                onChange={(e) => setFacturaForm({...facturaForm, cantidad: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="col-span-3 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {facturaForm.fecha ? format(facturaForm.fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={facturaForm.fecha}
                    onSelect={(date) => setFacturaForm({...facturaForm, fecha: date || new Date()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cliente" className="text-right">
                Cliente
              </Label>
              <Input
                id="cliente"
                value={facturaForm.cliente}
                onChange={(e) => setFacturaForm({...facturaForm, cliente: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numFactura" className="text-right">
                Núm. Factura
              </Label>
              <Input
                id="numFactura"
                value={facturaForm.numFactura}
                onChange={(e) => setFacturaForm({...facturaForm, numFactura: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFacturaFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmitFactura}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
