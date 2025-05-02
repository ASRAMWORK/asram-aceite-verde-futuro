
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

const AdministradoresManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { usuarios, loading } = useUsuarios();

  // Filtrar solo administradores
  const administradores = usuarios.filter(usuario => 
    usuario?.role?.toLowerCase() === 'administrador'
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Gestión de Administradores</CardTitle>
              <CardDescription>
                Administra los usuarios con rol de administrador de fincas
              </CardDescription>
            </div>
            <UserCog className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Lista de Administradores</TabsTrigger>
              <TabsTrigger value="add">Añadir Administrador</TabsTrigger>
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
    </div>
  );
};

export default AdministradoresManagement;
