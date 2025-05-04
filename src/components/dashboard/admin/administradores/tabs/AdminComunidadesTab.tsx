
import React from 'react';
import { Usuario } from '@/types';

export interface AdminComunidadesTabProps {
  admin: Usuario;
}

const AdminComunidadesTab: React.FC<AdminComunidadesTabProps> = ({ admin }) => {
  return (
    <div>
      {admin.comunidades && admin.comunidades.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Comunidades administradas ({admin.comunidades.length})</h3>
          <div className="space-y-4">
            {admin.comunidades.map((comunidad) => (
              <div key={comunidad.id} className="border p-4 rounded-md">
                <h4 className="font-bold">{comunidad.nombre}</h4>
                <p className="text-sm text-gray-600">{comunidad.direccion}</p>
                <div className="mt-2 text-sm">
                  <span className="mr-4">Viviendas: {comunidad.numViviendas || 0}</span>
                  <span>Contenedores: {comunidad.numContenedores || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Este administrador no tiene comunidades asignadas
        </div>
      )}
    </div>
  );
};

export default AdminComunidadesTab;
