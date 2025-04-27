
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Building, Droplet, Home, Euro, Route } from 'lucide-react';
import { Chart } from '@/components/ui/chart';
import { useFacturacion } from '@/hooks/useFacturacion';
import { useRutas } from '@/hooks/useRutas';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';

const PanelControl = () => {
  const { comunidades } = useComunidadesVecinos();
  const { ingresos, gastos } = useFacturacion();
  const { rutas } = useRutas();
  const { puntosVerdes } = usePuntosVerdes();

  // Datos de comunidades
  const totalLitros = comunidades.reduce((acc, com) => acc + (com.litrosRecogidos || 0), 0);
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  const totalPuntosVerdes = comunidades.reduce((acc, com) => acc + 1, 0);
  
  // Datos de rutas
  const rutasCompletadas = rutas.filter(r => r.completada).length;
  const rutasPendientes = rutas.filter(r => !r.completada).length;
  const litrosRecolectados = rutas.reduce((acc, ruta) => acc + (ruta.litrosTotales || 0), 0);
  
  // Cálculos financieros
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const ingresosMes = ingresos
    .filter(i => {
      const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + (i.cantidad || 0), 0);
    
  const gastosMes = gastos
    .filter(g => {
      const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, g) => sum + (g.cantidad || 0), 0);
    
  const balanceMes = ingresosMes - gastosMes;

  const chartData = {
    labels: comunidades.map(c => c.nombre),
    datasets: [
      {
        label: 'Litros Recogidos',
        data: comunidades.map(c => c.litrosRecogidos || 0),
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Litros Recogidos por Comunidad</CardTitle>
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
          <CardHeader>
            <CardTitle>Estado de Rutas</CardTitle>
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
    </div>
  );
};

export default PanelControl;
