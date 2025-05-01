
import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';

interface GestionComunidadesProps {
  adminId?: string;
}

const GestionComunidades = ({ adminId }: GestionComunidadesProps) => {
  const { comunidades, loading } = useComunidadesVecinos();
  
  if (loading) {
    return <div>Cargando comunidades...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestión de Comunidades</h2>
      
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Mis comunidades ({comunidades.length})</h3>
        
        {comunidades.length > 0 ? (
          <div className="space-y-3">
            {comunidades.map(comunidad => (
              <div key={comunidad.id} className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{comunidad.nombre}</h4>
                    <p className="text-sm text-gray-500">{comunidad.direccion}, {comunidad.ciudad}</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                    {comunidad.numViviendas || 0} viviendas
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            No hay comunidades registradas. Cree una nueva comunidad para empezar.
          </p>
        )}
      </div>
    </div>
  );
};

export default GestionComunidades;
