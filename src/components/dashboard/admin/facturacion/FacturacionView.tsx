
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, CalendarDays, Clock, Plus, Search, X, FileText, ChevronLeft, ChevronRight, CircleDollarSign, Receipt, ArrowUpDown } from "lucide-react";
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
  const { ingresos, gastos, loading, getFinancialSummary } = useFacturacion();
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

  const totalIngresosAllTime = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastosAllTime = gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balanceAllTime = totalIngresosAllTime - totalGastosAllTime;

  const financialSummary = getFinancialSummary();

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
        <Card>
          <CardContent className="p-4">
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white">
                  Visión general
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white">
                  Proyectos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden space-y-4 md:flex">
        <Card className="w-[300px] border-l-4 border-l-[#EE970D] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#EE970D]" />
              Facturación
            </CardTitle>
            <CardDescription>
              Resumen de facturación y gestión de proyectos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
            >
              <TabsList className="flex flex-col">
                <TabsTrigger value="overview" className="justify-start data-[state=active]:bg-[#EE970D]/10 data-[state=active]:text-[#EE970D] font-medium">
                  <BarChart className="mr-2 h-4 w-4" />
                  Visión general
                </TabsTrigger>
                <TabsTrigger value="projects" className="justify-start data-[state=active]:bg-[#EE970D]/10 data-[state=active]:text-[#EE970D] font-medium">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Proyectos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="container py-10">
        {currentTab === "overview" ? (
          <div className="grid gap-6">
            {/* Monthly and All Time Overview Cards */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Visión general de {format(selectedDate, "MMMM yyyy", { locale: es })}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDateChange(-1)}
                      className="border-[#EE970D]/20 hover:bg-[#EE970D]/10 hover:border-[#EE970D]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDateChange(1)}
                      className="border-[#EE970D]/20 hover:bg-[#EE970D]/10 hover:border-[#EE970D]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-6 shadow-md border border-green-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-green-800">Ingresos</h3>
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <CircleDollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-green-600">
                        {totalIngresos.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Ingresos del mes
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md border border-red-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-red-800">Gastos</h3>
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                          <Receipt className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-red-600">
                        {totalGastos.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Gastos del mes
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-md border border-amber-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#EE970D]">Balance</h3>
                        <div className="p-2 rounded-full bg-amber-100 text-[#EE970D]">
                          <ArrowUpDown className="h-5 w-5" />
                        </div>
                      </div>
                      <p className={`text-4xl font-bold mt-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balance.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Balance del mes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Time Overview Card */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Acumulado Total 
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-6 shadow-md border border-green-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-green-800">Ingresos Totales</h3>
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <CircleDollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-green-600">
                        {totalIngresosAllTime.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Ingresos acumulados
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md border border-red-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-red-800">Gastos Totales</h3>
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                          <Receipt className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-red-600">
                        {totalGastosAllTime.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Gastos acumulados
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-md border border-amber-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#EE970D]">Balance Total</h3>
                        <div className="p-2 rounded-full bg-amber-100 text-[#EE970D]">
                          <ArrowUpDown className="h-5 w-5" />
                        </div>
                      </div>
                      <p className={`text-4xl font-bold mt-4 ${balanceAllTime >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balanceAllTime.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Balance acumulado
                      </p>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-md border border-blue-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-800">Ingresos proyectados</h3>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <BarChart className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-blue-600">{projectedRevenue.toLocaleString('es-ES')}€</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Proyectos activos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="col-span-2 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Transacciones
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar transacción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-[#EE970D]/20 focus:border-[#EE970D] focus:ring-[#EE970D]/20"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Ingresos
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                      {filteredIngresos.length > 0 ? (
                        filteredIngresos.map((ingreso) => (
                          <div
                            key={ingreso.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{ingreso.concepto}</span>
                              <span className="text-xs text-gray-500">
                                {ingreso.fecha ? format(new Date(ingreso.fecha), "dd/MM/yyyy") : ""}
                              </span>
                            </div>
                            <span className="font-bold text-green-600">
                              +{ingreso.cantidad.toLocaleString('es-ES')}€
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 italic py-4">No hay ingresos que coincidan</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      Gastos
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                      {filteredGastos.length > 0 ? (
                        filteredGastos.map((gasto) => (
                          <div
                            key={gasto.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{gasto.concepto}</span>
                              <span className="text-xs text-gray-500">
                                {gasto.fecha ? format(new Date(gasto.fecha), "dd/MM/yyyy") : ""}
                              </span>
                            </div>
                            <span className="font-bold text-red-600">
                              -{gasto.cantidad.toLocaleString('es-ES')}€
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 italic py-4">No hay gastos que coincidan</p>
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
