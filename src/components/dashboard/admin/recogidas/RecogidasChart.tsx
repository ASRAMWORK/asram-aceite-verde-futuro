
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface RecogidasChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const RecogidasChart: React.FC<RecogidasChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter',
          },
          color: '#64748b',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
          color: '#64748b',
        },
      },
    },
    animation: {
      duration: 1000,
      // Fix: Using a valid easing function name from Chart.js
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="h-[400px] w-full p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RecogidasChart;
