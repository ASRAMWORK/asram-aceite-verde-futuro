
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComunidadVecinos } from '@/types';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';

interface EstadisticasGeneralesProps {
  adminId?: string;
  comunidades: ComunidadVecinos[];
}

const EstadisticasGenerales = ({ adminId, comunidades }: EstadisticasGeneralesProps) => {
  // Generar datos para el gráfico basado en las comunidades
  const procesarDatosPorMes = () => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const datos = meses.map(mes => ({
      name: mes,
      recogidas: 0,
      litros: 0
    }));

    // Para cada comunidad, procesar su historial de recogidas
    comunidades.forEach(comunidad => {
      if (comunidad.historialRecogidas) {
        comunidad.historialRecogidas.forEach(recogida => {
          const fecha = new Date(recogida.fecha);
          const mes = fecha.getMonth();
          datos[mes].recogidas += 1;
          datos[mes].litros += recogida.litros || 0;
        });
      }
    });

    return datos;
  };

  const data = procesarDatosPorMes();
  
  // Calcular totales para métricas
  const mejorMes = [...data].sort((a, b) => b.litros - a.litros)[0];
  const totalLitros = data.reduce((sum, item) => sum + item.litros, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución anual de recogidas</CardTitle>
        <CardDescription>
          Análisis de recogidas y litros por mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="recogidas"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Número de recogidas"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="litros" 
                stroke="#82ca9d" 
                name="Litros recogidos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm text-gray-500 mb-1">Mejor mes</h3>
            <p className="font-bold text-xl">
              {mejorMes ? `${mejorMes.name} (${mejorMes.litros}L)` : 'Sin datos'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm text-gray-500 mb-1">Total anual</h3>
            <p className="font-bold text-xl">{totalLitros}L recogidos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadisticasGenerales;
