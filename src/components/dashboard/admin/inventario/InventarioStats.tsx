
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { StatsCard } from "@/components/dashboard/admin/stats/StatsCard";
import { useInventario } from "@/hooks/useInventario";
import { Box, PackagePlus, AlertTriangle, Package } from "lucide-react";

interface InventarioStatsProps {
  className?: string;
}

export const InventarioStats: React.FC<InventarioStatsProps> = ({ className }) => {
  const { stats, getStockPorCategoria, getStockData, getStockMinimumComparisonData } = useInventario();

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
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
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Productos"
          value={stats.totalProductos}
          icon={Package}
          className="bg-gradient-to-br from-[#FFF8F0] to-[#FFEDD8]"
        />
        <StatsCard
          title="Total de Unidades"
          value={stats.totalStockActual}
          icon={Box}
          className="bg-gradient-to-br from-[#FFF8F0] to-[#FFEDD8]"
        />
        <StatsCard
          title="Productos con Stock Bajo"
          value={stats.productosStockBajo}
          icon={AlertTriangle}
          className="bg-gradient-to-br from-[#FFF8F0] to-[#FFEDD8]"
        />
        <StatsCard
          title="% de Stock Bajo"
          value={`${stats.porcentajeStockBajo.toFixed(1)}%`}
          icon={PackagePlus}
          className="bg-gradient-to-br from-[#FFF8F0] to-[#FFEDD8]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Distribución de Stock por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {stats.totalProductos > 0 ? (
                <Chart type="pie" data={getStockData()} options={pieChartOptions} />
              ) : (
                <p className="text-muted-foreground text-center">
                  No hay productos registrados para mostrar estadísticas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Comparación de Stock Actual vs Mínimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {stats.totalProductos > 0 ? (
                <Chart type="bar" data={getStockMinimumComparisonData()} options={barChartOptions} />
              ) : (
                <p className="text-muted-foreground text-center">
                  No hay productos registrados para mostrar estadísticas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
