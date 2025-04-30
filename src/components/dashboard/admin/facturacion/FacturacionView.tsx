
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, CalendarDays, Clock, Plus, Search, X, FileText, ChevronLeft, ChevronRight, CircleDollarSign, Receipt, ArrowUpDown, TrendingUp, PieChart } from "lucide-react";
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
import InformeFinanciero from "./InformeFinanciero";
import { Chart } from "@/components/ui/chart";

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

  // Prepare data for monthly trend chart
  const prepareMonthlyTrendData = () => {
    // Get last 6 months
    const months = [];
    const monthlyIngresos = [];
    const monthlyGastos = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthName = format(date, 'MMM', { locale: es });
      
      const ingresosMes = ingresos
        .filter((ingreso) => {
          const fecha = new Date(ingreso.fecha);
          return fecha >= monthStart && fecha <= monthEnd;
        })
        .reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
      
      const gastosMes = gastos
        .filter((gasto) => {
          const fecha = new Date(gasto.fecha);
          return fecha >= monthStart && fecha <= monthEnd;
        })
        .reduce((sum, gasto) => sum + gasto.cantidad, 0);
      
      months.push(monthName);
      monthlyIngresos.push(ingresosMes);
      monthlyGastos.push(gastosMes);
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Ingresos',
          data: monthlyIngresos,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Gastos',
          data: monthlyGastos,
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          tension: 0.3,
        }
      ]
    };
  };

  // Prepare data for category distribution pie chart
  const prepareCategoryDistributionData = () => {
    // Group expenses by category
    const gastosPorCategoria = gastos.reduce((acc: Record<string, number>, gasto) => {
      const categoria = gasto.categoria || 'Sin categorizar';
      if (!acc[categoria]) acc[categoria] = 0;
      acc[categoria] += gasto.cantidad;
      return acc;
    }, {});
    
    // Get top 5 categories
    const topCategorias = Object.entries(gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    // Calculate "others" if more than 5 categories
    const otherCategories = Object.entries(gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .slice(5)
      .reduce((sum, [, value]) => sum + value, 0);
    
    // Prepare labels and data
    const labels = topCategorias.map(([categoria]) => categoria);
    const data = topCategorias.map(([, value]) => value);
    
    if (otherCategories > 0) {
      labels.push('Otros');
      data.push(otherCategories);
    }
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(16, 185, 129, 0.7)',  // Green
            'rgba(245, 158, 11, 0.7)',  // Yellow
            'rgba(99, 102, 241, 0.7)',  // Indigo
            'rgba(236, 72, 153, 0.7)',  // Pink
            'rgba(107, 114, 128, 0.7)', // Gray
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  const monthlyTrendData = prepareMonthlyTrendData();
  const categoryDistributionData = prepareCategoryDistributionData();
  
  // Calculate pending invoices total
  const pendienteCobro = ingresos
    .filter(ingreso => ingreso.estado === 'pendiente')
    .reduce((sum, ingreso) => sum + ingreso.cantidad, 0);

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
            {/* Financial Dashboard and Summary */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-[#EE970D]" />
                    Dashboard Financiero
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
                    <span className="font-medium text-gray-600 px-2">
                      {format(selectedDate, "MMMM yyyy", { locale: es })}
                    </span>
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
                  <div className="mb-6">
                    <InformeFinanciero 
                      ingresos={ingresos}
                      gastos={gastos}
                      ingresosMes={totalIngresos}
                      gastosMes={totalGastos}
                      diasEnMes={30}
                      pendienteCobro={pendienteCobro}
                    />
                  </div>
                  
                  {/* Charts section */}
                  <div className="grid gap-6 md:grid-cols-2 mt-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#EE970D]" />
                          Evolución mensual (últimos 6 meses)
                        </CardTitle>
                        <CardDescription>
                          Comparativa de ingresos y gastos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="line"
                          data={monthlyTrendData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                                align: 'end',
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString('es-ES')}€`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function(value) {
                                    return value.toLocaleString('es-ES') + '€';
                                  }
                                }
                              }
                            }
                          }}
                          className="h-[320px]"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-[#EE970D]" />
                          Distribución de gastos por categoría
                        </CardTitle>
                        <CardDescription>
                          Principales categorías de gasto
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="doughnut"
                          data={categoryDistributionData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  boxWidth: 12,
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const value = context.parsed.toLocaleString('es-ES') + '€';
                                    const label = context.label || '';
                                    return `${label}: ${value}`;
                                  }
                                }
                              }
                            },
                            cutout: '60%'
                          }}
                          className="h-[320px]"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            
              {/* Monthly and All Time Overview Cards */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Resumen Financiero Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-6 shadow-md border border-green-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-green-800">Ingresos del Mes</h3>
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <CircleDollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-green-600">
                        {totalIngresos.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {format(selectedDate, "MMMM yyyy", { locale: es })}
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 shadow-md border border-red-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-red-800">Gastos del Mes</h3>
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                          <Receipt className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold mt-4 text-red-600">
                        {totalGastos.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {format(selectedDate, "MMMM yyyy", { locale: es })}
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-md border border-amber-100 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#EE970D]">Balance del Mes</h3>
                        <div className="p-2 rounded-full bg-amber-100 text-[#EE970D]">
                          <ArrowUpDown className="h-5 w-5" />
                        </div>
                      </div>
                      <p className={`text-4xl font-bold mt-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balance.toLocaleString('es-ES')}€
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {format(selectedDate, "MMMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  {/* All Time Overview */}
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
