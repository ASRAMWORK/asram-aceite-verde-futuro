
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data
const data = [
  { name: 'Ene', litros: 65 },
  { name: 'Feb', litros: 59 },
  { name: 'Mar', litros: 80 },
  { name: 'Abr', litros: 81 },
  { name: 'May', litros: 56 },
  { name: 'Jun', litros: 55 },
  { name: 'Jul', litros: 40 },
  { name: 'Ago', litros: 30 },
  { name: 'Sep', litros: 45 },
  { name: 'Oct', litros: 70 },
  { name: 'Nov', litros: 85 },
  { name: 'Dic', litros: 90 },
];

const RecogidasChart = () => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} litros`, 'Cantidad']}
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Bar dataKey="litros" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecogidasChart;
