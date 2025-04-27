
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { useRecogidas } from '@/hooks/useRecogidas';

const InformesPanel = () => {
  const { recogidas } = useRecogidas();

  // Organize data by month
  const monthlyData = recogidas.reduce((acc, recogida) => {
    const date = new Date(recogida.fecha);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey] += recogida.litrosRecogidos || 0;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const months = Object.keys(monthlyData).sort();
  const chartData = {
    labels: months.map(month => {
      const [year, monthNum] = month.split('-');
      return `${monthNum}/${year}`;
    }),
    datasets: [
      {
        label: 'Litros Recogidos',
        data: months.map(month => monthlyData[month]),
        backgroundColor: '#ee970d',
        borderColor: '#ee970d',
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico Mensual de Recogidas</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            type="line"
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
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.y} litros`
                  }
                }
              }
            }}
            className="h-[400px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InformesPanel;
