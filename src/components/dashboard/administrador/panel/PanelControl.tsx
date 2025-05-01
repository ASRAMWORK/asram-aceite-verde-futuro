
import React from 'react';

interface PanelControlProps {
  adminId?: string;
}

const PanelControl = ({ adminId }: PanelControlProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Panel de Control</h2>
      <p className="text-gray-600">Bienvenido al panel de control del administrador {adminId && <span className="font-medium">(ID: {adminId.substring(0, 8)}...)</span>}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-medium">Resumen</h3>
          <p className="text-sm text-gray-500">Gestione sus comunidades y propietarios</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-medium">Incidencias activas</h3>
          <p className="text-sm text-gray-500">Revise y gestione las incidencias abiertas</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-medium">Próximas reuniones</h3>
          <p className="text-sm text-gray-500">Calendario de reuniones programadas</p>
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
