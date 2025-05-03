
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useUsuarios } from '@/hooks/useUsuarios';
import { UserCog } from 'lucide-react';
import AdministradoresList from './AdministradoresList';
import AddAdministradorForm from './AddAdministradorForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/useIsMobile';
import { mobileHeadingSize, mobileTextSize, mobilePadding } from '@/utils/mobileStyles';

const AdministradoresManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { usuarios, loading } = useUsuarios();
  const isMobile = useIsMobile();

  // Filtrar solo administradores
  const administradores = usuarios.filter(usuario => 
    usuario?.role?.toLowerCase() === 'administrador'
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className={mobilePadding()}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={mobileHeadingSize()}>Gestión de Administradores</CardTitle>
              <CardDescription className={mobileTextSize()}>
                Administra los usuarios con rol de administrador de fincas
              </CardDescription>
            </div>
            <UserCog className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent className={mobilePadding()}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="list" className={isMobile ? "text-xs py-2" : ""}>Lista de Administradores</TabsTrigger>
              <TabsTrigger value="add" className={isMobile ? "text-xs py-2" : ""}>Añadir Administrador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <AdministradoresList administradores={administradores} />
              )}
            </TabsContent>
            
            <TabsContent value="add">
              <AddAdministradorForm onSuccess={() => setActiveTab("list")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default AdministradoresManagement;
