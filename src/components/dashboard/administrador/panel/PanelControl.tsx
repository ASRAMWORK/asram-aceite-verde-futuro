
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Building, Droplet, Home } from 'lucide-react';
import { Chart } from '@/components/ui/chart';

const PanelControl = () => {
  const { comunidades } = useComunidadesVecinos();

  const totalLitros = comunidades.reduce((acc, com) => acc + (com.litrosRecogidos || 0), 0);
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  const totalPuntosVerdes = comunidades.reduce((acc, com) => acc + 1, 0);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="text-2xl font-bold">{totalPuntosVerdes}</div>
            <p className="text-xs text-muted-foreground">
              Total de puntos verdes instalados
            </p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default PanelControl;
