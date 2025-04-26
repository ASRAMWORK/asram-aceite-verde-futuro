
import React from 'react';
import { Chart } from '@/components/ui/chart';

const RecogidasChart = () => {
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Litros recogidos',
        data: [250, 300, 290, 340, 380, 420, 390, 360, 410, 430, 450, 400],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1,
      },
      {
        label: 'Objetivo',
        data: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderDash: [5, 5],
        type: 'line',
        fill: false,
        backgroundColor: 'transparent',
      }
    ]
  };

  const chartOptions = {
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
        title: {
          display: true,
          text: 'Litros',
        },
      },
    },
  };

  return (
    <div className="w-full h-[350px]">
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
};

export default RecogidasChart;
