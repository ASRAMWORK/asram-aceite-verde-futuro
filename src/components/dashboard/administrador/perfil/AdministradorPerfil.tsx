
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import DatosPerfilForm from './DatosPerfilForm';
import CambiarPasswordForm from './CambiarPasswordForm';
import TerminosCondiciones from './TerminosCondiciones';
import { User, Key, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface AdministradorPerfilProps {
  userId?: string;
}

const AdministradorPerfil: React.FC<AdministradorPerfilProps> = ({ userId }) => {
  const { profile, loading } = useUserProfile();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      
      <Tabs defaultValue="datos">
        <TabsList className="mb-4">
          <TabsTrigger value="datos">
            <User className="mr-2 h-4 w-4" /> Datos personales
          </TabsTrigger>
          <TabsTrigger value="password">
            <Key className="mr-2 h-4 w-4" /> Cambiar contraseña
          </TabsTrigger>
          <TabsTrigger value="terminos">
            <FileText className="mr-2 h-4 w-4" /> Términos y condiciones
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="datos">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>
                Actualiza tu información de contacto y detalles profesionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatosPerfilForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CambiarPasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terminos">
          <Card>
            <CardHeader>
              <CardTitle>Términos y condiciones</CardTitle>
              <CardDescription>
                Información sobre tu colaboración con ASRAM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TerminosCondiciones />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorPerfil;
