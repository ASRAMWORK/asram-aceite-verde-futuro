
import React from 'react';

interface InformesPanelProps {
  adminId?: string;
}

const InformesPanel = ({ adminId }: InformesPanelProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informes y Documentación</h2>
      
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Informes disponibles</h3>
        
        <div className="space-y-3">
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Informe mensual de recogidas</h4>
                <p className="text-sm text-gray-500">Resumen de recogidas del último mes</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                Descargar
              </span>
            </div>
          </div>
          
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Certificados medioambientales</h4>
                <p className="text-sm text-gray-500">Documentación oficial de ASRAM</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                Ver documentos
              </span>
            </div>
          </div>
          
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Estadísticas anuales</h4>
                <p className="text-sm text-gray-500">Impacto medioambiental generado</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                Generar informe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformesPanel;
