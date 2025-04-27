import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientesList from './ClientesList';
import ClienteForm from './ClienteForm';
import { useUsuarios } from '@/hooks/useUsuarios';

const AdministradorClientes = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const { usuarios, loadUsuariosData } = useUsuarios();
  
  // Calculate statistics
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.activo).length;
  const usuariosInactivos = usuarios.filter(u => !u.activo).length;

  const handleClienteSubmit = async () => {
    // After successful client creation, refresh the list
    try {
      await loadUsuariosData();
      setShowForm(false);
    } catch (error) {
      console.error("Error loading usuarios data:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Total: {totalUsuarios} | Activos: {usuariosActivos} | Inactivos: {usuariosInactivos}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Cliente
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nuevo Cliente</CardTitle>
            <CardDescription>Ingrese los datos del cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ClienteForm 
              onSubmit={handleClienteSubmit} 
              onCancel={() => setShowForm(false)} 
              initialData={{}}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Mis Clientes</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="activos">Activos</TabsTrigger>
              <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="todos" className="mt-0">
            <ClientesList searchTerm={searchTerm} filter="todos" />
          </TabsContent>
          <TabsContent value="activos" className="mt-0">
            <ClientesList searchTerm={searchTerm} filter="activos" />
          </TabsContent>
          <TabsContent value="inactivos" className="mt-0">
            <ClientesList searchTerm={searchTerm} filter="inactivos" />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradorClientes;
