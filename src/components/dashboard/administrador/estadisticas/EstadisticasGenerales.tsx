
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Ene', recogidas: 12, litros: 65 },
  { name: 'Feb', recogidas: 15, litros: 59 },
  { name: 'Mar', recogidas: 18, litros: 80 },
  { name: 'Abr', recogidas: 17, litros: 81 },
  { name: 'May', recogidas: 14, litros: 56 },
  { name: 'Jun', recogidas: 16, litros: 55 },
  { name: 'Jul', recogidas: 10, litros: 40 },
  { name: 'Ago', recogidas: 8, litros: 30 },
  { name: 'Sep', recogidas: 12, litros: 45 },
  { name: 'Oct', recogidas: 16, litros: 70 },
  { name: 'Nov', recogidas: 19, litros: 85 },
  { name: 'Dic', recogidas: 20, litros: 90 },
];

const EstadisticasGenerales = () => {
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
            <p className="font-bold text-xl">Diciembre (90L)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm text-gray-500 mb-1">Total anual</h3>
            <p className="font-bold text-xl">756L recogidos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadisticasGenerales;
