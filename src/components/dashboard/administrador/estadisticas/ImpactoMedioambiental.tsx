
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ImpactoMedioambiental = () => {
  const { comunidades, loading } = useComunidadesVecinos();
  
  // Calculate total environmental metrics
  const totalMetrics = comunidades.reduce(
    (acc, comunidad) => {
      const beneficios = comunidad.beneficiosMedioambientales || {};
      return {
        co2: acc.co2 + (beneficios.co2 || 0),
        agua: acc.agua + (beneficios.agua || 0),
        energia: acc.energia + (beneficios.energia || 0)
      };
    },
    { co2: 0, agua: 0, energia: 0 }
  );
  
  // Chart data
  const chartData = [
    { name: 'CO2 evitado', value: totalMetrics.co2 },
    { name: 'Agua ahorrada', value: totalMetrics.agua },
    { name: 'Energía ahorrada', value: totalMetrics.energia }
  ];

  // Helper function to safely format numbers
  const formatNumber = (value: any): string => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impacto Medioambiental</CardTitle>
        <CardDescription>
          Beneficios ambientales de la recogida de aceite
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-muted-foreground text-sm">CO2 evitado</h3>
                    <p className="text-3xl font-bold text-blue-500">{formatNumber(totalMetrics.co2)} kg</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-muted-foreground text-sm">Agua ahorrada</h3>
                    <p className="text-3xl font-bold text-green-500">{formatNumber(totalMetrics.agua)} L</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-muted-foreground text-sm">Energía ahorrada</h3>
                    <p className="text-3xl font-bold text-amber-500">{formatNumber(totalMetrics.energia)} kWh</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => {
                    return typeof value === 'number' ? value.toFixed(2) : value;
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md mt-6 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">Impacto positivo</h3>
              <p className="text-green-700">
                La recogida de aceite ha evitado que {formatNumber(totalMetrics.agua)} litros de agua
                sean contaminados y ha reducido la emisión de {formatNumber(totalMetrics.co2)} kg de CO2
                a la atmósfera.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImpactoMedioambiental;
