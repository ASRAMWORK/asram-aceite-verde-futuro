
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComunidadVecinos } from '@/types';

interface RankingComunidadesProps {
  comunidades: ComunidadVecinos[];
}

const RankingComunidades: React.FC<RankingComunidadesProps> = ({ comunidades }) => {
  // Preparar datos para el ranking
  const datosComunidades = [...comunidades]
    .sort((a, b) => (b.litrosRecogidos || 0) - (a.litrosRecogidos || 0))
    .slice(0, 10)
    .map(comunidad => ({
      name: comunidad.nombre.length > 15 ? `${comunidad.nombre.substring(0, 15)}...` : comunidad.nombre,
      litros: comunidad.litrosRecogidos || 0,
      contenedores: comunidad.numContenedores || 0,
      viviendas: comunidad.numViviendas || 0
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Comunidades</CardTitle>
        <CardDescription>
          Las comunidades con mayor recogida de aceite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datosComunidades}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 50,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => `${value} L`} />
              <Legend />
              <Bar dataKey="litros" name="Litros recogidos" fill="#82ca9d" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Métricas por comunidad</h3>
          <div className="overflow-auto max-h-60">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Comunidad</th>
                  <th className="px-4 py-2 text-right">Litros</th>
                  <th className="px-4 py-2 text-right">Contenedores</th>
                  <th className="px-4 py-2 text-right">Viviendas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {datosComunidades.map((comunidad, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{comunidad.name}</td>
                    <td className="px-4 py-2 text-right">{comunidad.litros} L</td>
                    <td className="px-4 py-2 text-right">{comunidad.contenedores}</td>
                    <td className="px-4 py-2 text-right">{comunidad.viviendas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingComunidades;
