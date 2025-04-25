
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, CircleDollarSign, PiggyBank } from 'lucide-react';
import { Ingreso, Gasto } from '@/types';

interface Props {
  ingresos?: Ingreso[];
  gastos?: Gasto[];
  ingresosMes?: number;
  gastosMes?: number;
  diasEnMes?: number;
  onClose?: () => void;
}

const InformeFinanciero: React.FC<Props> = ({ 
  ingresos = [], 
  gastos = [], 
  ingresosMes = 0, 
  gastosMes = 0, 
  diasEnMes = 30,
  onClose 
}) => {
  // Calculate totals from arrays if direct values aren't provided
  const totalIngresos = ingresosMes || ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastos = gastosMes || gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  
  // Calcula el promedio diario de ingresos y gastos
  const promedioDiarioIngresos = totalIngresos / diasEnMes;
  const promedioDiarioGastos = totalGastos / diasEnMes;

  // Proyecta los ingresos y gastos para el mes completo
  const proyeccionIngresos = promedioDiarioIngresos * 30;
  const proyeccionGastos = promedioDiarioGastos * 30;

  // Calcula el balance mensual
  const balanceMensual = totalIngresos - totalGastos;

  return (
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
          <CardTitle className="text-sm font-medium">Proyección Mensual</CardTitle>
          <PiggyBank className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {proyeccionIngresos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </div>
          <p className="text-xs text-muted-foreground">
            Proyección basada en el promedio diario
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformeFinanciero;
