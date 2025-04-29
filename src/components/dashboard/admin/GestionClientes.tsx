
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserRound, Edit, Ban, CheckCircle, Droplet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ClienteForm from './ClienteForm';
import ClienteHistorialRecogidas from './ClienteHistorialRecogidas';
import { toast } from 'sonner';

const AdministradorClientes = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const { usuarios, loadUsuariosData, updateUsuario } = useUsuarios();
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [selectedUsuarioToEdit, setSelectedUsuarioToEdit] = useState<Usuario | null>(null);
  const [showRecogerAceite, setShowRecogerAceite] = useState(false);
  
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

  const handleToggleActivoUsuario = async (usuario: Usuario) => {
    try {
      await updateUsuario(usuario.id, { activo: !usuario.activo });
      toast.success(`Cliente ${usuario.activo ? 'desactivado' : 'activado'} correctamente`);
    } catch (error) {
      console.error("Error toggling usuario activo:", error);
      toast.error("Error al cambiar el estado del cliente");
    }
  };

  // Add a new function to render Punto Verde specific information
const PuntoVerdeInfo = ({ usuario }: { usuario: Usuario }) => {
  if (usuario.tipo !== "punto_verde") return null;
  
  return (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <h3 className="font-semibold mb-2">Información de Punto Verde</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Distrito</p>
          <p>{usuario.distrito || 'No especificado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Barrio</p>
          <p>{usuario.barrio || 'No especificado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Nº de Viviendas</p>
          <p>{usuario.numViviendas || 0}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Nº de Contenedores</p>
          <p>{usuario.numContenedores || 0}</p>
        </div>
        {usuario.puntoVerdeId && (
          <div>
            <p className="text-sm text-muted-foreground">ID Punto Verde</p>
            <p>{usuario.puntoVerdeId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

  // Add a tab for Puntos Verdes in the component
const clienteTabs = [
  { value: "todos", label: "Todos" },
  { value: "particulares", label: "Particulares" },
  { value: "negocios", label: "Negocios" },
  { value: "administradores", label: "Administradores" },
  { value: "puntos_verdes", label: "Puntos Verdes" },
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" }
];

  const clientes = usuarios;

  // Update the filtering function to handle Puntos Verdes
const filteredClientes = clientes.filter(cliente => {
  // Filter by search term
  const matchesSearchTerm = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Filter by tab
  let matchesTab = false;
  switch (activeTab) {
    case "todos":
      matchesTab = true;
      break;
    case "particulares":
      matchesTab = cliente.tipo === "particular";
      break;
    case "negocios":
      matchesTab = cliente.tipo === "negocio";
      break;
    case "administradores":
      matchesTab = cliente.tipo === "administrador";
      break;
    case "puntos_verdes":
      matchesTab = cliente.tipo === "punto_verde";
      break;
    case "activos":
      matchesTab = cliente.activo === true;
      break;
    case "inactivos":
      matchesTab = cliente.activo === false;
      break;
  }
  
  return matchesSearchTerm && matchesTab;
}).sort((a, b) => a.nombre.localeCompare(b.nombre));

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
            <ClienteForm onCancel={() => setShowForm(false)} onSubmit={handleClienteSubmit} />
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
              {clienteTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {filteredClientes.map(cliente => (
              <div key={cliente.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                    <p className="text-sm text-muted-foreground">{cliente.email || 'No email'}</p>
                  </div>
                </div>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedUsuario(cliente)}>
                    Ver detalles
                  </Button>
                </SheetTrigger>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update the user detail view to show Punto Verde information */}
<Sheet open={!!selectedUsuario} onOpenChange={() => setSelectedUsuario(null)}>
  <SheetContent className="sm:max-w-lg">
    <SheetHeader className="mb-4">
      <SheetTitle>Detalles del Cliente</SheetTitle>
      <SheetDescription>
        Información de contacto y gestión del cliente
      </SheetDescription>
    </SheetHeader>
    
    {selectedUsuario && (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{selectedUsuario.nombre}</h2>
            <p className="text-muted-foreground">
              {selectedUsuario.tipo === "punto_verde" ? "Punto Verde" : 
               selectedUsuario.tipo === "particular" ? "Cliente particular" : 
               selectedUsuario.tipo === "negocio" ? "Negocio" : 
               selectedUsuario.tipo === "administrador" ? "Administrador de fincas" : 
               "Cliente"}
            </p>
          </div>
          
          <Badge 
            variant={selectedUsuario.activo ? "default" : "outline"}
            className={selectedUsuario.activo ? "bg-green-500" : ""}
          >
            {selectedUsuario.activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{selectedUsuario.email || "No especificado"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
            <p>{selectedUsuario.telefono || "No especificado"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Dirección</h3>
            <p>{selectedUsuario.direccion || "No especificada"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Ciudad/Provincia</h3>
            <p>{selectedUsuario.ciudad || "Madrid"}, {selectedUsuario.provincia || "Madrid"}</p>
          </div>
          
          {selectedUsuario.contacto && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Persona de contacto</h3>
              <p>{selectedUsuario.contacto}</p>
            </div>
          )}
          
          {selectedUsuario.role && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rol</h3>
              <p>{selectedUsuario.role}</p>
            </div>
          )}
        </div>
        
        {selectedUsuario.tipo === "punto_verde" && (
          <PuntoVerdeInfo usuario={selectedUsuario} />
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Acciones</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedUsuarioToEdit(selectedUsuario);
                setSelectedUsuario(null);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar información
            </Button>
            
            <Button 
              variant={selectedUsuario.activo ? "default" : "secondary"} 
              onClick={() => handleToggleActivoUsuario(selectedUsuario)}
              className={selectedUsuario.activo ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {selectedUsuario.activo ? 
                <><Ban className="mr-2 h-4 w-4" /> Desactivar cliente</> : 
                <><CheckCircle className="mr-2 h-4 w-4" /> Activar cliente</>
              }
            </Button>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={() => {
            setShowRecogerAceite(true);
            setSelectedUsuario(null);
          }}
        >
          <Droplet className="mr-2 h-4 w-4" />
          Programar recogida de aceite
        </Button>
        
        <ClienteHistorialRecogidas cliente={selectedUsuario} />
      </div>
    )}
  </SheetContent>
</Sheet>

      {/* Formulario de edición */}
      <Sheet open={!!selectedUsuarioToEdit} onOpenChange={() => setSelectedUsuarioToEdit(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Cliente</SheetTitle>
            <SheetDescription>
              Modifica la información del cliente.
            </SheetDescription>
          </SheetHeader>
          {selectedUsuarioToEdit && (
            <ClienteForm
              usuario={selectedUsuarioToEdit}
              onCancel={() => setSelectedUsuarioToEdit(null)}
              onSubmit={async () => {
                await loadUsuariosData();
                setSelectedUsuarioToEdit(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdministradorClientes;
