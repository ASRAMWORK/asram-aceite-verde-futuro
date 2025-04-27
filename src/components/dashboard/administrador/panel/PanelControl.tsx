
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Building, Droplet, Home, Euro, Route, BarChart4, LineChart } from 'lucide-react';
import { Chart } from '@/components/ui/chart';
import { useFacturacion } from '@/hooks/useFacturacion';
import { useRutas } from '@/hooks/useRutas';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';
import { useProjects } from '@/hooks/useProjects';

const PanelControl = () => {
  const { comunidades } = useComunidadesVecinos();
  const { ingresos, gastos, getFinancialSummary } = useFacturacion();
  const { rutas } = useRutas();
  const { puntosVerdes } = usePuntosVerdes();
  const { projects } = useProjects();

  // Datos de comunidades
  const totalLitros = comunidades.reduce((acc, com) => acc + (com.litrosRecogidos || 0), 0);
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  const totalPuntosVerdes = comunidades.reduce((acc, com) => acc + 1, 0);
  
  // Datos de rutas
  const rutasCompletadas = rutas.filter(r => r.completada).length;
  const rutasPendientes = rutas.filter(r => !r.completada).length;
  const litrosRecolectados = rutas.reduce((acc, ruta) => acc + (ruta.litrosTotales || 0), 0);
  
  // Financial data
  const { ingresosMes, gastosMes, balanceMes, pendienteCobro } = getFinancialSummary();
  
  // Project stats
  const proyectosActivos = projects.filter(p => p.estado === 'activo').length;
  const proyectosCompletados = projects.filter(p => p.estado === 'completado').length;

  const chartData = {
    labels: comunidades.slice(0, 10).map(c => c.nombre),
    datasets: [
      {
        label: 'Litros Recogidos',
        data: comunidades.slice(0, 10).map(c => c.litrosRecogidos || 0),
        backgroundColor: '#ee970d',
        borderColor: '#ee970d',
      }
    ]
  };

  const rutasChartData = {
    labels: ['Completadas', 'Pendientes'],
    datasets: [
      {
        label: 'Estado de Rutas',
        data: [rutasCompletadas, rutasPendientes],
        backgroundColor: ['#4CAF50', '#ee970d'],
        borderColor: ['#4CAF50', '#ee970d'],
      }
    ]
  };
  
  // Finanzas chart data
  const finanzasChartData = {
    labels: ['Ingresos', 'Gastos', 'Balance', 'Pendiente'],
    datasets: [
      {
        label: 'Finanzas del Mes',
        data: [ingresosMes, gastosMes, balanceMes, pendienteCobro],
        backgroundColor: ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b'],
      }
    ]
  };
  
  // Prepare monthly data
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  
  // Get data for the last 6 months
  const last6Months = Array(6).fill(0).map((_, i) => {
    const month = (currentMonth - i + 12) % 12;
    return month;
  }).reverse();
  
  const last6MonthsLabels = last6Months.map(month => monthLabels[month]);
  
  // Calculate income and expenses for each month
  const monthlyData = last6Months.map(month => {
    const monthIngresos = ingresos.filter(i => {
      const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
      return fecha.getMonth() === month;
    }).reduce((sum, i) => sum + i.cantidad, 0);
    
    const monthGastos = gastos.filter(g => {
      const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
      return fecha.getMonth() === month;
    }).reduce((sum, g) => sum + g.cantidad, 0);
    
    return {
      ingresos: monthIngresos,
      gastos: monthGastos,
      balance: monthIngresos - monthGastos
    };
  });
  
  const finanzasLineChartData = {
    labels: last6MonthsLabels,
    datasets: [
      {
        label: 'Ingresos',
        data: monthlyData.map(d => d.ingresos),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Gastos',
        data: monthlyData.map(d => d.gastos),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Balance',
        data: monthlyData.map(d => d.balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Litros Totales</CardTitle>
            <Droplet className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLitros}L</div>
            <p className="text-xs text-muted-foreground">
              Aceite recogido en todas las comunidades
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Viviendas</CardTitle>
            <Building className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViviendas}</div>
            <p className="text-xs text-muted-foreground">
              Viviendas en todas las comunidades
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Puntos Verdes</CardTitle>
            <Home className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{puntosVerdes.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de puntos verdes instalados
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#ee970d]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
            <Route className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Rutas pendientes de completar
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Información financiera */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
            <Euro className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ingresosMes.toLocaleString('es-ES')}€</div>
            <p className="text-xs text-muted-foreground">
              Total ingresos del mes actual
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mes</CardTitle>
            <Euro className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{gastosMes.toLocaleString('es-ES')}€</div>
            <p className="text-xs text-muted-foreground">
              Total gastos del mes actual
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance Mes</CardTitle>
            <Euro className={`h-4 w-4 ${balanceMes >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanceMes >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {balanceMes.toLocaleString('es-ES')}€
            </div>
            <p className="text-xs text-muted-foreground">
              Balance del mes actual
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendiente Cobro</CardTitle>
            <Euro className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendienteCobro.toLocaleString('es-ES')}€</div>
            <p className="text-xs text-muted-foreground">
              {ingresos.filter(i => i.estado === 'pendiente').length} facturas pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Litros Recogidos por Comunidad</CardTitle>
            </div>
            <Droplet className="h-5 w-5 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}L`
                    }
                  }
                }
              }}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Estado de Rutas</CardTitle>
            </div>
            <Route className="h-5 w-5 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <Chart
              type="doughnut"
              data={rutasChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Finanzas charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Finanzas del Mes</CardTitle>
            </div>
            <BarChart4 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={finanzasChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}€`
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Evolución Financiera</CardTitle>
            </div>
            <LineChart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={finanzasLineChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}€`
                    }
                  }
                }
              }}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Projects summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumen de Proyectos</CardTitle>
          </div>
          <Building className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Proyectos</div>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Proyectos Activos</div>
                <div className="text-2xl font-bold text-blue-600">{proyectosActivos}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Proyectos Completados</div>
                <div className="text-2xl font-bold text-green-600">{proyectosCompletados}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Proyectos Pendientes</div>
                <div className="text-2xl font-bold text-amber-600">
                  {projects.filter(p => p.estado === 'pendiente').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelControl;
