
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useNavigate, useParams } from 'react-router-dom';
import { Usuario } from '@/types';
import AdminPerfilTab from './tabs/AdminPerfilTab';
import AdminComunidadesTab from './tabs/AdminComunidadesTab';
import AdminEstadisticasTab from './tabs/AdminEstadisticasTab';
import { toast } from 'sonner';
import AdminStatusToggle from '@/components/shared/AdminStatusToggle';

const DetalleAdministrador = () => {
  const { id } = useParams<{ id: string }>();
  const { getUsuarioById, aprobarAdministrador } = useUsuarios();
  const [admin, setAdmin] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const adminData = await getUsuarioById(id);
          setAdmin(adminData);
        }
      } catch (error) {
        console.error('Error al cargar datos del administrador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getUsuarioById]);

  const handleAprobar = async () => {
    if (admin && admin.id) {
      try {
        await aprobarAdministrador(admin.id);
        setAdmin({ ...admin, aprobado: true });
        toast.success('Administrador aprobado correctamente');
      } catch (error) {
        console.error('Error al aprobar administrador:', error);
        toast.error('Error al aprobar administrador');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-t-asram rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center p-6">
        <p>No se encontró el administrador</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          {admin && !admin.aprobado && (
            <Button 
              onClick={handleAprobar}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <UserCheck className="h-4 w-4" />
              <span>Aprobar como administrador</span>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-xl font-bold">
            {admin.nombre} {admin.apellidos || ''}
          </CardTitle>
          {admin && <AdminStatusToggle user={admin} />}
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="comunidades">Comunidades</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="perfil" className="p-4">
              <AdminPerfilTab admin={admin} />
            </TabsContent>
            
            <TabsContent value="comunidades" className="p-4">
              <AdminComunidadesTab admin={admin} />
            </TabsContent>
            
            <TabsContent value="estadisticas" className="p-4">
              <AdminEstadisticasTab admin={admin} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalleAdministrador;
