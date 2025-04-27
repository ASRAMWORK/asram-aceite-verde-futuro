
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, CircleDollarSign, PiggyBank, Receipt } from 'lucide-react';
import { Ingreso, Gasto } from '@/types';
import { Chart } from '@/components/ui/chart';

interface Props {
  ingresos?: Ingreso[];
  gastos?: Gasto[];
  ingresosMes?: number;
  gastosMes?: number;
  diasEnMes?: number;
  proyectoId?: string;
  pendienteCobro?: number;
  onClose?: () => void;
}

const InformeFinanciero: React.FC<Props> = ({ 
  ingresos = [], 
  gastos = [], 
  ingresosMes = 0, 
  gastosMes = 0, 
  diasEnMes = 30,
  proyectoId,
  pendienteCobro = 0,
  onClose 
}) => {
  // Filtramos los ingresos y gastos por proyecto si se proporciona un proyectoId
  const ingresosProyecto = proyectoId 
    ? ingresos.filter(ingreso => ingreso.origen === proyectoId)
    : ingresos;
    
  const gastosProyecto = proyectoId
    ? gastos.filter(gasto => gasto.tipo === proyectoId)
    : gastos;
  
  // Calculate totals from arrays if direct values aren't provided
  const totalIngresos = proyectoId
    ? ingresosProyecto.reduce((sum, ingreso) => sum + ingreso.cantidad, 0)
    : ingresosMes || ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
    
  const totalGastos = proyectoId
    ? gastosProyecto.reduce((sum, gasto) => sum + gasto.cantidad, 0)
    : gastosMes || gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  
  // Calcula el promedio diario de ingresos y gastos
  const promedioDiarioIngresos = totalIngresos / diasEnMes;
  const promedioDiarioGastos = totalGastos / diasEnMes;

  // Proyecta los ingresos y gastos para el mes completo
  const proyeccionIngresos = promedioDiarioIngresos * 30;
  const proyeccionGastos = promedioDiarioGastos * 30;

  // Calcula el balance mensual
  const balanceMensual = totalIngresos - totalGastos;
  
  // Si tenemos datos suficientes, creamos un gráfico de evolución
  const chartData = {
    labels: ['Ingresos', 'Gastos', 'Balance'],
    datasets: [
      {
        data: [totalIngresos, totalGastos, balanceMensual],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)', // verde para ingresos
          'rgba(239, 68, 68, 0.7)',  // rojo para gastos
          balanceMensual >= 0 ? 'rgba(238, 151, 13, 0.7)' : 'rgba(249, 115, 22, 0.7)', // naranja para balance
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  // Datos para el gráfico de distribución de ingresos por categoría
  const categoriasIngresos = ingresosProyecto.reduce((acc: Record<string, number>, ingreso) => {
    const categoria = ingreso.categoria || 'Sin categoría';
    acc[categoria] = (acc[categoria] || 0) + ingreso.cantidad;
    return acc;
  }, {});
  
  const categoriasGastos = gastosProyecto.reduce((acc: Record<string, number>, gasto) => {
    const categoria = gasto.categoria || 'Sin categoría';
    acc[categoria] = (acc[categoria] || 0) + gasto.cantidad;
    return acc;
  }, {});
  
  const chartCategoriasIngresos = {
    labels: Object.keys(categoriasIngresos),
    datasets: [
      {
        data: Object.values(categoriasIngresos),
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(248, 113, 113, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(238, 151, 13, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIngresos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {promedioDiarioIngresos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} / día
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalGastos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {promedioDiarioGastos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} / día
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Mensual</CardTitle>
            <ArrowUp className={balanceMensual >= 0 ? "h-4 w-4 text-green-500" : "h-4 w-4 text-red-500"} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanceMensual >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {balanceMensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Balance actual del mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Cobro</CardTitle>
            <Receipt className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {pendienteCobro.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Facturas pendientes de cobro
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráfico financiero */}
      {(ingresos.length > 0 || gastos.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
              <CardDescription>Comparativa de ingresos, gastos y balance</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                type="bar"
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.y.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`;
                        }
                      }
                    }
                  },
                }}
                className="h-[200px]"
              />
            </CardContent>
          </Card>
          
          {Object.keys(categoriasIngresos).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ingresos</CardTitle>
                <CardDescription>Por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  type="doughnut"
                  data={chartCategoriasIngresos}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                        }
                      }
                    },
                    cutout: '60%'
                  }}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InformeFinanciero;
