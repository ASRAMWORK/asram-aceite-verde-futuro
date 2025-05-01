
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import PanelControl from './panel/PanelControl';
import GestionComunidades from './comunidades/GestionComunidades';
import InformesPanel from './informes/InformesPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Usuario } from '@/types';

interface ComponentWithAdminIdProps {
  adminId?: string;
}

const PanelControlWithAdminId = (props: ComponentWithAdminIdProps) => <PanelControl {...props} />;
const GestionComunidadesWithAdminId = (props: ComponentWithAdminIdProps) => <GestionComunidades {...props} />;
const InformesPanelWithAdminId = (props: ComponentWithAdminIdProps) => <InformesPanel {...props} />;

const AdministradorPanel = () => {
  const [activeTab, setActiveTab] = useState("panel");
  const { profile, loading } = useUserProfile();
  const [viewingAdminData, setViewingAdminData] = useState<Usuario | null>(null);
  const [isViewingAsAdmin, setIsViewingAsAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Comprobar si estamos viendo el panel como superadmin
    const viewingAdminId = sessionStorage.getItem('viewingAdminId');
    const fromSuperAdmin = sessionStorage.getItem('fromSuperAdmin') === 'true';
    
    if (viewingAdminId && fromSuperAdmin) {
      setIsViewingAsAdmin(true);
      
      // Cargar datos del administrador que estamos visualizando
      const loadAdminData = async () => {
        try {
          const adminDoc = await getDoc(doc(db, "usuarios", viewingAdminId));
          if (adminDoc.exists()) {
            setViewingAdminData({
              id: adminDoc.id,
              ...adminDoc.data() as Omit<Usuario, 'id'>
            });
          }
        } catch (error) {
          console.error("Error al cargar datos del administrador:", error);
        }
      };
      
      loadAdminData();
    }
  }, []);
  
  const handleBackToAdminList = () => {
    // Limpiar datos de sesión
    sessionStorage.removeItem('viewingAdminId');
    sessionStorage.removeItem('fromSuperAdmin');
    // Volver a la lista de administradores
    navigate('/admin/dashboard');
  };
  
  // Determinar qué ID de administrador usar
  const adminIdToUse = viewingAdminData?.id || profile?.id;
  
  if (loading && !viewingAdminData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isViewingAsAdmin && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-yellow-800">
                Modo visualización de administrador
              </h2>
              <p className="text-sm text-yellow-600">
                Estás viendo el panel del administrador: {viewingAdminData?.nombre} {viewingAdminData?.apellidos}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-yellow-300 hover:bg-yellow-100"
              onClick={handleBackToAdminList}
            >
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Volver a lista de administradores
            </Button>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#ee970d]">Panel de Administrador de Fincas</h1>
        <p className="text-gray-600">
          {isViewingAsAdmin 
            ? `Panel de: ${viewingAdminData?.nombre || ''} ${viewingAdminData?.apellidos || ''}`
            : `Bienvenido, ${profile?.nombreAdministracion || profile?.nombre || 'Administrador'}`}
          {!isViewingAsAdmin && profile?.id && (
            <span className="text-xs text-gray-400 ml-2">(ID: {profile.id})</span>
          )}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-white border">
          <TabsTrigger 
            value="panel"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Panel de Control
          </TabsTrigger>
          <TabsTrigger 
            value="comunidades"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Gestión de Comunidades
          </TabsTrigger>
          <TabsTrigger 
            value="informes"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Informes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="panel" className="mt-6">
          <PanelControlWithAdminId adminId={adminIdToUse} />
        </TabsContent>
        
        <TabsContent value="comunidades" className="mt-6">
          <GestionComunidadesWithAdminId adminId={adminIdToUse} />
        </TabsContent>
        
        <TabsContent value="informes" className="mt-6">
          <InformesPanelWithAdminId adminId={adminIdToUse} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorPanel;
