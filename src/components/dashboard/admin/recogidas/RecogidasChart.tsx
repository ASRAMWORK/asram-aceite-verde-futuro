
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
            weight: 500
          },
          color: '#64748b',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        bodyFont: {
          family: 'Inter'
        },
        borderColor: 'rgba(220, 220, 220, 1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}L`;
          }
        }
      }
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
            size: 11,
          },
          color: '#64748b',
          padding: 8,
        },
        border: {
          dash: [4, 4],
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
          },
          color: '#64748b',
        },
        border: {
          display: false,
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
    elements: {
      bar: {
        borderRadius: 6,
      }
    }
  };

  return (
    <div className="h-[400px] w-full p-4 bg-white rounded-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RecogidasChart;
