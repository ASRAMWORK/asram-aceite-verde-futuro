
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Building, Droplet, Home, Route, BarChart4, LineChart } from 'lucide-react';
import { Chart } from '@/components/ui/chart';
import { useRutas } from '@/hooks/useRutas';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';
import { useRecogidas } from '@/hooks/useRecogidas';

const PanelControl = () => {
  const { comunidades } = useComunidadesVecinos();
  const { rutas } = useRutas();
  const { puntosVerdes } = usePuntosVerdes();
  const { getTotalLitrosRecogidos } = useRecogidas();

  // Datos de comunidades
  const totalLitros = getTotalLitrosRecogidos();
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  
  // Total contenedores instalados
  const totalContenedores = puntosVerdes.reduce((acc, punto) => acc + (punto.numContenedores || 0), 0);
  
  // Datos de rutas
  const rutasPendientes = rutas.filter(r => !r.completada).length;

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
        data: [rutas.filter(r => r.completada).length, rutasPendientes],
        backgroundColor: ['#4CAF50', '#ee970d'],
        borderColor: ['#4CAF50', '#ee970d'],
      }
    ]
  };
  
  // Prepare monthly data for charts
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  
  // Get data for the last 6 months
  const last6Months = Array(6).fill(0).map((_, i) => {
    const month = (currentMonth - i + 12) % 12;
    return month;
  }).reverse();
  
  const last6MonthsLabels = last6Months.map(month => monthLabels[month]);
  
  // Calculate monthly collection data based on recogidas
  const monthlyData = last6Months.map(month => {
    const litrosMes = comunidades.reduce((total, com) => {
      // Mock data - in a real scenario, you'd filter actual recogidas by month
      return total + ((com.litrosRecogidos || 0) / 6); // Simple distribution for demonstration
    }, 0);
    
    return {
      litros: Math.round(litrosMes)
    };
  });
  
  // Chart data for litros recogidos por mes
  const litrosLineChartData = {
    labels: last6MonthsLabels,
    datasets: [
      {
        label: 'Litros Recogidos',
        data: monthlyData.map(d => d.litros),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
            <CardTitle className="text-sm font-medium">Contenedores Instalados</CardTitle>
            <Home className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContenedores}</div>
            <p className="text-xs text-muted-foreground">
              Total de contenedores instalados
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Evolución de Recogidas</CardTitle>
            </div>
            <LineChart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={litrosLineChartData}
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
          <CardHeader>
            <CardTitle>Resumen de Comunidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Comunidades Activas</div>
                  <div className="text-2xl font-bold text-blue-600">{comunidades.filter(c => c.activo).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Comunidades Pendientes</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {comunidades.filter(c => !c.activo).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PanelControl;
