
import React from 'react';
import { Chart } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/admin/stats/StatsCard";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useRecogidas } from "@/hooks/useRecogidas";
import { Building, MapPin, Users, Droplet, BarChart4 } from "lucide-react";

export const InstalacionesStats = () => {
  const { instalaciones, getEstadisticasByDistrito } = useInstalaciones();
  const { puntosVerdes } = usePuntosVerdes();
  const { usuarios } = useUsuarios();
  const { recogidas } = useRecogidas();

  // Filter clients
  const clientes = usuarios.filter(u => 
    u.tipo === 'cliente' || u.tipo === 'comunidad' || u.tipo === 'punto_verde'
  );

  // Calculate statistics
  const totalInstalaciones = instalaciones.length;
  const totalPuntosVerdes = puntosVerdes.length;
  const totalClientes = clientes.length;
  const totalRecogidas = recogidas.length;
  
  const recogidasCompletadas = recogidas.filter(r => 
    r.completada || r.estadoRecogida === 'completada'
  ).length;
  
  const porcentajeCompletadas = totalRecogidas > 0 
    ? (recogidasCompletadas / totalRecogidas) * 100 
    : 0;

  // Get unique districts for chart
  const distritos = [...new Set([
    ...instalaciones.map(i => i.distrito),
    ...puntosVerdes.map(p => p.distrito),
  ])].filter(Boolean).sort();

  // Prepare data for charts
  const distribucionPorDistrito = () => {
    const distribucion = distritos.map(distrito => {
      const instCount = instalaciones.filter(i => i.distrito === distrito).length;
      const puntosCount = puntosVerdes.filter(p => p.distrito === distrito).length;
      
      return {
        distrito,
        instalaciones: instCount,
        puntosVerdes: puntosCount,
        total: instCount + puntosCount
      };
    });

    return {
      labels: distribucion.map(d => d.distrito),
      datasets: [
        {
          label: 'Instalaciones',
          data: distribucion.map(d => d.instalaciones),
          backgroundColor: '#EE970D',
          borderColor: '#EE970D',
        },
        {
          label: 'Puntos Verdes',
          data: distribucion.map(d => d.puntosVerdes),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
        }
      ]
    };
  };

  const recogidasPorDistrito = () => {
    const recogidaPorDistrito = distritos.map(distrito => {
      const recogidasEnDistrito = recogidas.filter(r => r.distrito === distrito);
      const completadas = recogidasEnDistrito.filter(r => 
        r.completada || r.estadoRecogida === 'completada'
      ).length;
      const pendientes = recogidasEnDistrito.length - completadas;
      
      return {
        distrito,
        completadas,
        pendientes
      };
    });

    return {
      labels: recogidaPorDistrito.map(d => d.distrito),
      datasets: [
        {
          label: 'Completadas',
          data: recogidaPorDistrito.map(d => d.completadas),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
        },
        {
          label: 'Pendientes',
          data: recogidaPorDistrito.map(d => d.pendientes),
          backgroundColor: '#F59E0B',
          borderColor: '#F59E0B',
        }
      ]
    };
  };

  const litrosRecogidosPorDistrito = () => {
    const litrosPorDistrito = {};

    // Sum up liters by district
    puntosVerdes.forEach(punto => {
      if (punto.distrito && punto.litrosRecogidos) {
        if (!litrosPorDistrito[punto.distrito]) {
          litrosPorDistrito[punto.distrito] = 0;
        }
        litrosPorDistrito[punto.distrito] += punto.litrosRecogidos;
      }
    });

    // Add liters from recogidas if they have the data
    recogidas.forEach(recogida => {
      if (recogida.distrito && recogida.litrosRecogidos) {
        if (!litrosPorDistrito[recogida.distrito]) {
          litrosPorDistrito[recogida.distrito] = 0;
        }
        litrosPorDistrito[recogida.distrito] += recogida.litrosRecogidos;
      }
    });

    // Convert to array for chart
    const data = Object.entries(litrosPorDistrito).map(([distrito, litros]) => ({
      distrito,
      litros
    }));

    return {
      labels: data.map(d => d.distrito),
      datasets: [
        {
          label: 'Litros Recogidos',
          data: data.map(d => d.litros),
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
        }
      ]
    };
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estadísticas de Instalaciones</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Instalaciones"
          value={totalInstalaciones}
          icon={Building}
          className="bg-gradient-to-br from-orange-50 to-orange-100"
        />
        <StatsCard
          title="Puntos Verdes"
          value={totalPuntosVerdes}
          icon={MapPin}
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatsCard
          title="Clientes Registrados"
          value={totalClientes}
          icon={Users}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatsCard
          title="Recogidas Completadas"
          value={`${recogidasCompletadas}/${totalRecogidas}`}
          icon={Droplet}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
          valueColor={porcentajeCompletadas > 80 ? "text-green-600" : porcentajeCompletadas > 50 ? "text-amber-600" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Distrito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Chart 
                type="bar" 
                data={distribucionPorDistrito()} 
                options={barChartOptions}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recogidas por Distrito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Chart 
                type="bar" 
                data={recogidasPorDistrito()} 
                options={barChartOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Litros Recogidos por Distrito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <Chart 
              type="bar" 
              data={litrosRecogidosPorDistrito()} 
              options={barChartOptions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstalacionesStats;
