
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AdministradorEstadisticasProps {
  adminId?: string;
}

const AdministradorEstadisticas: React.FC<AdministradorEstadisticasProps> = ({ adminId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Estadísticas</h2>
        <p className="text-gray-500">Análisis de tus comunidades y recogidas</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>
            Visión general del rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Funcionalidad en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradorEstadisticas;
