
import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const MisComunidades = () => {
  const { comunidades, loading, error } = useComunidadesVecinos();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Comunidades</h2>
      
      {comunidades.length === 0 ? (
        <p className="text-gray-500">No tienes comunidades registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comunidades.map((comunidad) => (
            <Card key={comunidad.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle>{comunidad.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p><span className="font-semibold">Dirección:</span> {comunidad.direccion}</p>
                <p><span className="font-semibold">CIF:</span> {comunidad.cif}</p>
                <p><span className="font-semibold">Ciudad:</span> {comunidad.ciudad}</p>
                <p><span className="font-semibold">Viviendas:</span> {comunidad.numViviendas}</p>
                <p><span className="font-semibold">Litros recogidos:</span> {comunidad.litrosRecogidos || 0}L</p>
                
                <div className="mt-2">
                  <p className="font-semibold">Beneficios medioambientales:</p>
                  <ul className="text-sm ml-4">
                    <li>CO2: {comunidad.beneficiosMedioambientales?.co2 || 0} kg</li>
                    <li>Agua: {comunidad.beneficiosMedioambientales?.agua || 0} L</li>
                    <li>Energía: {comunidad.beneficiosMedioambientales?.energia || 0} kWh</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisComunidades;
