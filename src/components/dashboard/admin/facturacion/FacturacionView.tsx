
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, CalendarDays, Clock, Plus, Search, X, 
  FileText, ChevronLeft, ChevronRight, Banknote, 
  TrendingUp, CreditCard, ArrowDownIcon, ArrowUpIcon, 
  Calendar, DollarSign
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useFacturacion } from "@/hooks/useFacturacion";
import { ProjectsView } from "./ProjectsView";
import { ProjectForm } from "./ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { Ingreso, Gasto } from "@/types";
import { toast } from "sonner";

const FacturacionView = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const { ingresos, gastos, loading } = useFacturacion();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");

  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);

  const totalIngresos = ingresos
    .filter((ingreso) => ingreso.fecha >= start && ingreso.fecha <= end)
    .reduce((sum, ingreso) => sum + ingreso.cantidad, 0);

  const totalGastos = gastos
    .filter((gasto) => gasto.fecha >= start && gasto.fecha <= end)
    .reduce((sum, gasto) => sum + gasto.cantidad, 0);
    
  const balance = totalIngresos - totalGastos;
  const balanceColor = balance >= 0 ? "text-green-600" : "text-red-600";
  const balanceIcon = balance >= 0 ? <ArrowUpIcon className="h-4 w-4 text-green-600" /> : <ArrowDownIcon className="h-4 w-4 text-red-600" />;

  const filteredIngresos = ingresos.filter((ingreso) =>
    ingreso.concepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGastos = gastos.filter((gasto) =>
    gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateChange = (amount: number) => {
    setSelectedDate(amount > 0 ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
  };

  const handleOpenProjectForm = () => {
    setIsProjectFormOpen(true);
    setProjectToEdit(null);
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setProjectToEdit(null);
  };

  const handleEditProject = (project: any) => {
    setProjectToEdit(project);
    setIsProjectFormOpen(true);
  };

  const handleSubmitProject = () => {
    handleCloseProjectForm();
  };

  const calculateProjectedRevenue = () => {
    let total = 0;
    projects.forEach(project => {
      if (project.estado === 'activo' && project.presupuesto) {
        total += project.presupuesto;
      }
    });
    return total;
  };

  const projectedRevenue = calculateProjectedRevenue();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE970D]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="md:hidden">
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-4">
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white transition-colors"
                >
                  <BarChart className="mr-2 h-4 w-4" /> Visión general
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" /> Proyectos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden space-y-4 md:block">
        <Card className="w-[300px] border-l-4 border-l-[#EE970D] shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-[#EE970D]/20">
                <Banknote className="h-5 w-5 text-[#EE970D]" />
              </div>
              <CardTitle className="text-xl">Facturación</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Gestión de facturación y proyectos
            </CardDescription>
            <Separator className="my-4 bg-gray-200" />
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col space-y-1 bg-transparent">
                <TabsTrigger 
                  value="overview" 
                  className="justify-start text-left data-[state=active]:bg-[#EE970D]/10 data-[state=active]:text-[#EE970D] data-[state=active]:font-medium w-full transition-colors"
                >
                  <BarChart className="mr-3 h-5 w-5" />
                  Visión general
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="justify-start text-left data-[state=active]:bg-[#EE970D]/10 data-[state=active]:text-[#EE970D] data-[state=active]:font-medium w-full transition-colors"
                >
                  <CalendarDays className="mr-3 h-5 w-5" />
                  Proyectos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
        </Card>
      </div>

      <div className="container py-10">
        {currentTab === "overview" ? (
          <div className="grid gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-[#EE970D]" />
                  <span>Visión Financiera</span>
                </h2>
                <p className="text-muted-foreground mt-1">
                  Monitoriza los ingresos, gastos y el balance general
                </p>
              </div>
              
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDateChange(-1)}
                  className="hover:bg-[#EE970D]/10 hover:text-[#EE970D]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#EE970D]" />
                  <span className="capitalize">{format(selectedDate, "MMMM yyyy", { locale: es })}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDateChange(1)}
                  className="hover:bg-[#EE970D]/10 hover:text-[#EE970D]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-xl bg-gradient-to-br from-green-50 to-white p-6 shadow-md border border-green-100 flex flex-col hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-800">Ingresos</h3>
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <ArrowUpIcon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-bold mt-4 text-green-600">
                  {totalIngresos.toLocaleString('es-ES')}€
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Ingresos del mes</span>
                </div>
              </Card>
              
              <Card className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md border border-red-100 flex flex-col hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-red-800">Gastos</h3>
                  <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <ArrowDownIcon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-bold mt-4 text-red-600">
                  {totalGastos.toLocaleString('es-ES')}€
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Gastos del mes</span>
                </div>
              </Card>
              
              <Card className="rounded-xl bg-gradient-to-br from-[#EE970D]/10 to-white p-6 shadow-md border border-[#EE970D]/20 flex flex-col hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#EE970D]">Balance</h3>
                  <div className="p-2 rounded-full bg-[#EE970D]/20 text-[#EE970D]">
                    {balanceIcon}
                  </div>
                </div>
                <p className={`text-4xl font-bold mt-4 ${balanceColor}`}>
                  {balance.toLocaleString('es-ES')}€
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Balance del mes</span>
                </div>
              </Card>
              
              <Card className="col-span-full rounded-xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-md border border-blue-100 flex flex-col hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-800">Ingresos proyectados</h3>
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-bold mt-4 text-blue-600">{projectedRevenue.toLocaleString('es-ES')}€</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <BarChart className="h-4 w-4" />
                  <span>Ingresos proyectados de todos los proyectos activos</span>
                </div>
              </Card>
            </div>
            
            <Card className="col-span-2 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden border-t-4 border-t-[#EE970D]">
              <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#EE970D]/20">
                    <CreditCard className="h-5 w-5 text-[#EE970D]" />
                  </div>
                  <CardTitle className="text-xl">Transacciones recientes</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar transacción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-[#EE970D]/20 focus:border-[#EE970D] focus:ring-[#EE970D]/20 pr-8 w-[250px]"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      Ingresos
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                      {filteredIngresos.length > 0 ? (
                        filteredIngresos.map((ingreso) => (
                          <div
                            key={ingreso.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-green-100">
                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{ingreso.concepto}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {ingreso.fecha ? format(new Date(ingreso.fecha), "dd/MM/yyyy") : ""}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-green-600">
                              +{ingreso.cantidad.toLocaleString('es-ES')}€
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                          <FileText className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-center italic">No hay ingresos que coincidan</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      Gastos
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                      {filteredGastos.length > 0 ? (
                        filteredGastos.map((gasto) => (
                          <div
                            key={gasto.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-red-100">
                                <ArrowDownIcon className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{gasto.concepto}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {gasto.fecha ? format(new Date(gasto.fecha), "dd/MM/yyyy") : ""}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-red-600">
                              -{gasto.cantidad.toLocaleString('es-ES')}€
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                          <FileText className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-center italic">No hay gastos que coincidan</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : currentTab === "projects" ? (
          <ProjectsView
            onOpenProjectForm={handleOpenProjectForm}
            onEditProject={handleEditProject}
          />
        ) : null}
      </div>

      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={handleCloseProjectForm}
        onSubmit={handleSubmitProject}
        initialData={projectToEdit}
      />
    </div>
  );
};

export default FacturacionView;
