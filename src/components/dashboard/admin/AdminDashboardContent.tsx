
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RutasDistritos from './RutasDistritos';
import MapaLocalizaciones from './MapaLocalizaciones';
import GestionRecogidas from './GestionRecogidas';
import TiendaAdmin from './tienda/TiendaAdmin';
import GestionComercialesView from './comercial/GestionComercialesView';

interface AdminDashboardContentProps {
  activeTab?: string;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({ activeTab = 'rutas' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="rutas">Rutas y Distritos</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Localizaciones</TabsTrigger>
          <TabsTrigger value="recogidas">Gestión de Recogidas</TabsTrigger>
          <TabsTrigger value="tienda">Tienda</TabsTrigger>
          <TabsTrigger value="comerciales">Comerciales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rutas">
          <RutasDistritos />
        </TabsContent>
        
        <TabsContent value="mapa">
          <MapaLocalizaciones />
        </TabsContent>
        
        <TabsContent value="recogidas">
          <GestionRecogidas />
        </TabsContent>
        
        <TabsContent value="tienda">
          <TiendaAdmin />
        </TabsContent>
        
        <TabsContent value="comerciales">
          <GestionComercialesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardContent;
