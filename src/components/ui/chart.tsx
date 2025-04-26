
"use client"

import React from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
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
  Legend,
  ChartOptions
} from "chart.js";

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
  type: "bar" | "line" | "pie" | "doughnut";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: ChartOptions<"bar" | "line" | "pie" | "doughnut">;
  className?: string;
}

export function Chart({ type, data, options, className }: ChartProps) {
  let chartComponent;

  switch (type) {
    case "bar":
      chartComponent = <Bar data={data} options={options} />;
      break;
    case "line":
      chartComponent = <Line data={data} options={options} />;
      break;
    case "pie":
      chartComponent = <Pie data={data} options={options} />;
      break;
    case "doughnut":
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
