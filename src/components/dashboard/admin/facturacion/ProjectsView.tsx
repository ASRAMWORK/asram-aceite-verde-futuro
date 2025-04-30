
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
  const [isIngresoFormOpen, setIsIngresoFormOpen] = useState(false);
  const [isGastoFormOpen, setIsGastoFormOpen] = useState(false);
  const [isFacturaFormOpen, setIsFacturaFormOpen] = useState(false);

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
    setIsIngresoFormOpen(true);
    // Placeholder for adding income
    toast.info("Funcionalidad para añadir ingreso en desarrollo");
  };

  const handleAddGasto = (project: any) => {
    setSelectedProject(project);
    setIsGastoFormOpen(true);
    // Placeholder for adding expense
    toast.info("Funcionalidad para añadir gasto en desarrollo");
  };

  const handleAddFactura = (project: any) => {
    setSelectedProject(project);
    setIsFacturaFormOpen(true);
    // Placeholder for adding pending invoice
    toast.info("Funcionalidad para añadir factura pendiente en desarrollo");
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
    </div>
  );
};
