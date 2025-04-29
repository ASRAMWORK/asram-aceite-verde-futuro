import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, CalendarDays, Clock, Plus, Search, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useFacturacion } from "@/hooks/useFacturacion";
import { ProjectsView } from "./ProjectsView";
import { ProjectForm } from "./ProjectForm"; // Changed to named import
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

  const filteredIngresos = ingresos.filter((ingreso) =>
    ingreso.concepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGastos = gastos.filter((gasto) =>
    gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateChange = (numMonths: number) => {
    setSelectedDate(subMonths(selectedDate, numMonths));
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
    return <p>Cargando datos...</p>;
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
                <TabsTrigger value="overview">Visión general</TabsTrigger>
                <TabsTrigger value="projects">Proyectos</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden space-y-4 md:flex">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle>Facturación</CardTitle>
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
                <TabsTrigger value="overview" className="justify-start">
                  <BarChart className="mr-2 h-4 w-4" />
                  Visión general
                </TabsTrigger>
                <TabsTrigger value="projects" className="justify-start">
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
          <div className="grid gap-4">
            <Card className="col-span-2">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Visión general
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDateChange(1)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Mes anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDateChange(-1)}
                  >
                    Mes siguiente
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-emerald-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold">Ingresos</h3>
                    <p className="text-4xl font-bold text-emerald-600">
                      {totalIngresos}€
                    </p>
                    <p className="text-sm text-gray-500">
                      Ingresos totales de {format(selectedDate, "MMMM", { locale: es })}
                    </p>
                  </div>
                  <div className="border-2 border-red-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold">Gastos</h3>
                    <p className="text-4xl font-bold text-red-600">{totalGastos}€</p>
                    <p className="text-sm text-gray-500">
                      Gastos totales de {format(selectedDate, "MMMM", { locale: es })}
                    </p>
                  </div>
                  <div className="border-2 border-blue-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold">Ingresos proyectados</h3>
                    <p className="text-4xl font-bold text-blue-600">{projectedRevenue}€</p>
                    <p className="text-sm text-gray-500">
                      Ingresos proyectados de todos los proyectos activos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Transacciones
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Buscar transacción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="mr-2 h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Ingresos</h3>
                    <ul>
                      {filteredIngresos.map((ingreso) => (
                        <li
                          key={ingreso.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <span>{ingreso.concepto}</span>
                          <span className="font-bold text-emerald-600">
                            {ingreso.cantidad}€
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Gastos</h3>
                    <ul>
                      {filteredGastos.map((gasto) => (
                        <li
                          key={gasto.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <span>{gasto.concepto}</span>
                          <span className="font-bold text-red-600">
                            {gasto.cantidad}€
                          </span>
                        </li>
                      ))}
                    </ul>
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
