import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Euro,
  ReceiptText,
  Landmark,
  Building,
  FolderPlus,
  BadgeDollarSign,
  CalendarRange,
  FileText,
} from "lucide-react";
import IngresosForm from "./IngresosForm";
import GastosForm from "./GastosForm";
import InformeFinanciero from "./InformeFinanciero";
import { useFacturacion } from "@/hooks/useFacturacion";
import { ProjectsView } from "./ProjectsView";
import ProjectForm from "./ProjectForm";
import FacturasPendientes from "./FacturasPendientes";

const FacturacionView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showIngresosForm, setShowIngresosForm] = useState(false);
  const [showGastosForm, setShowGastosForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { ingresos, gastos, loading, getFinancialSummary } = useFacturacion();
  const { ingresosMes, gastosMes, balanceMes, pendienteCobro } = getFinancialSummary();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    setShowIngresosForm(false);
    setShowGastosForm(false);
    setShowProjectForm(false);
    setSelectedProject(null);
  }, [activeTab]);

  const handleAddIngreso = () => {
    setShowIngresosForm(true);
  };

  const handleAddGasto = () => {
    setShowGastosForm(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowProjectForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Facturación</h2>
          <p className="text-muted-foreground">
            Gestión de ingresos, gastos y proyectos financieros
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            onClick={handleAddIngreso}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Ingreso
          </Button>
          <Button
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
            onClick={handleAddGasto}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Gasto
          </Button>
          <Button 
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
            onClick={handleAddProject}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-green-800">
                Ingresos del Mes
              </CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {loading ? "..." : `${ingresosMes.toLocaleString('es-ES')}€`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ingresos.filter((i) => {
                const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
                return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
              }).length} transacciones este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-red-800">
                Gastos del Mes
              </CardTitle>
              <ReceiptText className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {loading ? "..." : `${gastosMes.toLocaleString('es-ES')}€`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {gastos.filter((g) => {
                const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
                return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
              }).length} transacciones este mes
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${balanceMes >= 0 ? 'from-blue-50 to-white' : 'from-amber-50 to-white'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-blue-800">
                Balance del Mes
              </CardTitle>
              <Landmark className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${balanceMes >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
              {loading ? "..." : `${balanceMes.toLocaleString('es-ES')}€`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {balanceMes >= 0 ? "Balance positivo" : "Balance negativo"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-amber-800">
                Pendiente de Cobro
              </CardTitle>
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {loading ? "..." : `${pendienteCobro.toLocaleString('es-ES')}€`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ingresos.filter(i => i.estado === 'pendiente').length} facturas pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">
            <CalendarRange className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="ingresos">
            <BadgeDollarSign className="h-4 w-4 mr-2 text-green-600" />
            Ingresos
          </TabsTrigger>
          <TabsTrigger value="gastos">
            <ReceiptText className="h-4 w-4 mr-2 text-red-600" />
            Gastos
          </TabsTrigger>
          <TabsTrigger value="proyectos">
            <Building className="h-4 w-4 mr-2 text-blue-600" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="pendientes">
            <FileText className="h-4 w-4 mr-2 text-amber-600" />
            Pendientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informe Financiero</CardTitle>
              <CardDescription>
                Análisis de ingresos y gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InformeFinanciero 
                ingresos={ingresos}
                gastos={gastos}
                ingresosMes={ingresosMes}
                gastosMes={gastosMes}
                diasEnMes={30}
                pendienteCobro={pendienteCobro}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingresos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Ingresos</CardTitle>
              <CardDescription>
                Historial de ingresos registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {/* Tabla de ingresos */}
                <div className="w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-muted/50">
                      <tr className="border-b transition-colors hover:bg-muted/10">
                        <th className="h-12 px-4 text-left align-middle font-medium">Concepto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Categoría</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Proyecto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Fecha</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {ingresos.length > 0 ? (
                        ingresos.map((ingreso) => (
                          <tr
                            key={ingreso.id}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">{ingreso.concepto}</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-green-700 bg-green-50">
                                {ingreso.categoria}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              {ingreso.origen || "General"}
                            </td>
                            <td className="p-4 align-middle">
                              {ingreso.fecha instanceof Date
                                ? ingreso.fecha.toLocaleDateString()
                                : new Date(ingreso.fecha).toLocaleDateString()}
                            </td>
                            <td className="p-4 align-middle">{ingreso.cliente || "-"}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                                ${ingreso.estado === 'pendiente' 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-green-50 text-green-700'}`}
                              >
                                {ingreso.estado === 'pendiente' ? 'Pendiente' : 'Cobrado'}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right font-medium">
                              {ingreso.cantidad.toLocaleString()}€
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            {loading
                              ? "Cargando ingresos..."
                              : "No hay ingresos registrados."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Gastos</CardTitle>
              <CardDescription>
                Historial de gastos registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {/* Tabla de gastos */}
                <div className="w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-muted/50">
                      <tr className="border-b transition-colors hover:bg-muted/10">
                        <th className="h-12 px-4 text-left align-middle font-medium">Concepto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Categoría</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Proyecto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Fecha</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Proveedor</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {gastos.length > 0 ? (
                        gastos.map((gasto) => (
                          <tr
                            key={gasto.id}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">{gasto.concepto}</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-red-700 bg-red-50">
                                {gasto.categoria}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              {gasto.tipo || "General"}
                            </td>
                            <td className="p-4 align-middle">
                              {gasto.fecha instanceof Date
                                ? gasto.fecha.toLocaleDateString()
                                : new Date(gasto.fecha).toLocaleDateString()}
                            </td>
                            <td className="p-4 align-middle">{gasto.proveedor || "-"}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                                ${gasto.estado === 'pendiente' 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-green-50 text-green-700'}`}
                              >
                                {gasto.estado === 'pendiente' ? 'Pendiente' : 'Pagado'}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right font-medium">
                              {gasto.cantidad.toLocaleString()}€
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            {loading
                              ? "Cargando gastos..."
                              : "No hay gastos registrados."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proyectos" className="mt-6">
          <ProjectsView 
            onEditProject={(projectId) => {
              setSelectedProject(projectId);
              setShowProjectForm(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="pendientes" className="mt-6">
          <FacturasPendientes 
            ingresos={ingresos}
            gastos={gastos}
          />
        </TabsContent>
      </Tabs>

      {showIngresosForm && (
        <IngresosForm 
          isOpen={showIngresosForm} 
          onClose={() => setShowIngresosForm(false)} 
        />
      )}

      {showGastosForm && (
        <GastosForm 
          isOpen={showGastosForm} 
          onClose={() => setShowGastosForm(false)} 
        />
      )}

      {showProjectForm && (
        <ProjectForm
          isOpen={showProjectForm}
          onClose={() => {
            setShowProjectForm(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject}
        />
      )}
    </div>
  );
};

export default FacturacionView;
