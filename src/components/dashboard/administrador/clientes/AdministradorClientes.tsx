
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useClientes } from '@/hooks/useClientes';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AdministradorClientesProps {
  adminId?: string;
}

const AdministradorClientes: React.FC<AdministradorClientesProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
        <p className="text-gray-500">Administra los clientes asociados a tus comunidades</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí irá el listado de clientes */}
          <p className="text-gray-500">Funcionalidad en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradorClientes;
