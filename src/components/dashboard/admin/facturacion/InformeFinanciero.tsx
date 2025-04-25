import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, CircleDollarSign, PiggyBank } from 'lucide-react';

interface Props {
  ingresosMes: number;
  gastosMes: number;
  diasEnMes: number;
}

const InformeFinanciero: React.FC<Props> = ({ ingresosMes, gastosMes, diasEnMes }) => {
  // Calcula el promedio diario de ingresos y gastos
  const promedioDiarioIngresos = ingresosMes / diasEnMes;
  const promedioDiarioGastos = gastosMes / diasEnMes;

  // Proyecta los ingresos y gastos para el mes completo
  const proyeccionIngresos = promedioDiarioIngresos * 30;
  const proyeccionGastos = promedioDiarioGastos * 30;

  // Calcula el balance mensual
  const balanceMensual = ingresosMes - gastosMes;

  const promedioDiario = ingresosMes > 0 && diasEnMes > 0 ? Number(ingresosMes) / Number(diasEnMes) : 0;
  const proyeccion = Number(promedioDiario) * 30;

  const promedioDiarioGastosCalculado = gastosMes > 0 && diasEnMes > 0 ? Number(gastosMes) / Number(diasEnMes) : 0;
  const proyeccionGastosCalculada = Number(promedioDiarioGastosCalculado) * 30;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ingresosMes.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
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
            {gastosMes.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </div>
          <p className="text-xs text-muted-foreground">
            {promedioDiarioGastosCalculado.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} / día
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
            {proyeccion.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
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
