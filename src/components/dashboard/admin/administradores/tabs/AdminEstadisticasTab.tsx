
import React from 'react';
import { Usuario } from '@/types';

export interface AdminEstadisticasTabProps {
  admin: Usuario;
}

const AdminEstadisticasTab: React.FC<AdminEstadisticasTabProps> = ({ admin }) => {
  // Calculate total stats from admin comunidades
  const totalComunidades = admin.comunidades?.length || 0;
  const totalViviendas = admin.comunidades?.reduce((total, com) => total + (com.numViviendas || 0), 0) || 0;
  const totalContenedores = admin.comunidades?.reduce((total, com) => total + (com.numContenedores || 0), 0) || 0;
  const totalLitros = admin.litrosAportados || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-700">Comunidades</h3>
          <p className="text-2xl font-bold">{totalComunidades}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-700">Viviendas</h3>
          <p className="text-2xl font-bold">{totalViviendas}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-amber-700">Contenedores</h3>
          <p className="text-2xl font-bold">{totalContenedores}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-700">Litros recogidos</h3>
          <p className="text-2xl font-bold">{totalLitros}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Actividad reciente</h3>
        <div className="text-center py-8 text-gray-500">
          No hay datos de actividad reciente disponibles
        </div>
      </div>
    </div>
  );
};

export default AdminEstadisticasTab;
