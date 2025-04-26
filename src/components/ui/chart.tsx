
"use client"

import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  options?: any;
  className?: string;
}

export function Chart({ type, data, options, className }: ChartProps) {
  let chartComponent;
  
  switch (type) {
    case 'bar':
      chartComponent = <Bar data={data} options={options} />;
      break;
    case 'line':
      chartComponent = <Line data={data} options={options} />;
      break;
    case 'pie':
      chartComponent = <Pie data={data} options={options} />;
      break;
    case 'doughnut':
      chartComponent = <Doughnut data={data} options={options} />;
      break;
    default:
      chartComponent = <Bar data={data} options={options} />;
  }
  
  return (
    <div className={className}>
      {chartComponent}
    </div>
  );
}

export const ChartContainer = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export const ChartTooltip = ({ 
  children 
}: { 
  children: React.ReactNode
}) => {
  return (
    <div className="bg-background p-2 rounded-md shadow-md border">
      {children}
    </div>
  )
}

export const ChartTooltipContent = ({ 
  content 
}: { 
  content: {
    label?: string
    value?: string | number
    color?: string
  }[] 
}) => {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {content.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.color && (
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="font-medium">{item.label}</span>
          {item.value && <span className="ml-auto">{item.value}</span>}
        </div>
      ))}
    </div>
  )
}
