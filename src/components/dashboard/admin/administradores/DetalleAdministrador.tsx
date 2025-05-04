
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Usuario } from '@/types';
import AdminStatusToggle from './AdminStatusToggle';
import AdminPerfilTab from './tabs/AdminPerfilTab';
import AdminComunidadesTab from './tabs/AdminComunidadesTab';
import AdminEstadisticasTab from './tabs/AdminEstadisticasTab';
import { useAdministradorComunidades } from '@/hooks/useAdministradorComunidades';

interface DetalleAdministradorProps {
  admin: Usuario;
}

const DetalleAdministrador: React.FC<DetalleAdministradorProps> = ({ admin }) => {
  const [activeTab, setActiveTab] = useState("perfil");
  const { comunidades, totalViviendas, totalContenedores, loading } = useAdministradorComunidades(admin.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{admin.nombre} {admin.apellidos}</h3>
          <p className="text-sm text-muted-foreground">ID: {admin.id}</p>
        </div>
        <AdminStatusToggle admin={admin} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="comunidades">Comunidades ({comunidades.length})</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-4 pt-4">
          <AdminPerfilTab admin={admin} />
        </TabsContent>
        
        <TabsContent value="comunidades" className="pt-4">
          <AdminComunidadesTab comunidades={comunidades} />
        </TabsContent>
        
        <TabsContent value="estadisticas" className="space-y-6 pt-4">
          <AdminEstadisticasTab 
            comunidades={comunidades}
            totalViviendas={totalViviendas}
            totalContenedores={totalContenedores}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalleAdministrador;
