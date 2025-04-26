
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useVoluntarios } from "@/hooks/useVoluntarios";
import { useTrabajadores } from "@/hooks/useTrabajadores";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { Building, Briefcase, Users, Home, CalendarDays, User, FileText } from "lucide-react";

const AdminDashboard = () => {
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { voluntarios, loading: loadingVoluntarios } = useVoluntarios();
  const { trabajadores, loading: loadingTrabajadores } = useTrabajadores();
  const { instalaciones, loading: loadingInstalaciones } = useInstalaciones();

  // Calculate statistics
  const clientesActivos = usuarios.filter(u => u.activo && u.tipo === 'comunidad').length;
  const puntosActivosCount = puntosVerdes.length;
  const totalVoluntarios = voluntarios.length;
  const totalTrabajadores = trabajadores.length;
  
  // Total viviendas and containers in all active installations
  const totalViviendas = instalaciones.reduce((acc, inst) => acc + (inst.numViviendas || 0), 0);
  const totalContenedores = instalaciones.reduce((acc, inst) => acc + (inst.numContenedores || 0), 0);
  
  // Facturación data (example/mock data for now)
  const [facturacionData, setFacturacionData] = useState({
    ingresosMes: 12450,
    gastosMes: 8750,
    previsionAnual: 145000,
    pendienteCobro: 3200
  });

  // Prepare chart data for litros recogidos por distrito
  const distritoData: Record<string, number> = {};
  puntosVerdes.forEach(punto => {
    if (!distritoData[punto.distrito]) {
      distritoData[punto.distrito] = 0;
    }
    distritoData[punto.distrito] += punto.litrosRecogidos || 0;
  });

  const litrosChartData = {
    labels: Object.keys(distritoData),
    datasets: [
      {
        label: 'Litros recogidos',
        data: Object.values(distritoData) as number[],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for users by type
  const usersByType: Record<string, number> = usuarios.reduce((acc, user) => {
    const type = user.tipo || 'otros';
    if (!acc[type]) acc[type] = 0;
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);
  
  const usersChartData = {
    labels: Object.keys(usersByType),
    datasets: [
      {
        label: 'Usuarios por tipo',
        data: Object.values(usersByType) as number[],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const isLoading = loadingPuntos || loadingUsuarios || loadingVoluntarios || loadingTrabajadores || loadingInstalaciones;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        <p className="text-muted-foreground">
          Vista general del sistema ASRAM
        </p>
      </div>

      {/* Cards de estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : clientesActivos}
            </div>
            <p className="text-xs text-muted-foreground">
              Comunidades y establecimientos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Verdes</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : puntosActivosCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Puntos de recogida activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipo ASRAM</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${totalTrabajadores} / ${totalVoluntarios}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Trabajadores / Voluntarios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infraestructura</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${totalViviendas} / ${totalContenedores}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Viviendas / Total Contenedores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de facturación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {facturacionData.ingresosMes.toLocaleString()}€
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {facturacionData.gastosMes.toLocaleString()}€
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsión Anual</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facturacionData.previsionAnual.toLocaleString()}€
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente Cobro</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {facturacionData.pendienteCobro.toLocaleString()}€
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con gráficas */}
      <Tabs defaultValue="recogidas">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recogidas">Recogidas por Distrito</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios por Tipo</TabsTrigger>
        </TabsList>
        <TabsContent value="recogidas">
          <Card>
            <CardHeader>
              <CardTitle>Aceite Recogido por Distrito (litros)</CardTitle>
              <CardDescription>
                Distribución de litros recogidos por cada distrito
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart
                type="bar"
                data={litrosChartData}
                options={{
                  maintainAspectRatio: false,
                }}
                className="h-80"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Usuarios</CardTitle>
              <CardDescription>
                Tipos de usuarios registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart
                type="pie"
                data={usersChartData}
                options={{
                  maintainAspectRatio: false,
                }}
                className="h-80"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
