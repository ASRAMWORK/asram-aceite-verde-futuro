
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface InformesPanelProps {
  adminId?: string;
}

const InformesPanel: React.FC<InformesPanelProps> = ({ adminId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Informes y Contratos</h2>
        <p className="text-gray-500">Gestiona la documentación de tus comunidades</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentación</CardTitle>
          <CardDescription>
            Accede a los informes y contratos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Funcionalidad en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformesPanel;
