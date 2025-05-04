
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  BadgeCheck,
  Building2, 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User,
  Building,
  Container,
  PlusCircle,
  Droplet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Usuario, ComunidadVecinos } from '@/types';
import { useUsuarios } from '@/hooks/useUsuarios';
import { formatDate } from '@/utils/dates';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DetalleAdministradorProps {
  admin: Usuario;
}

const DetalleAdministrador: React.FC<DetalleAdministradorProps> = ({ admin }) => {
  const { updateUsuario } = useUsuarios();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const navigate = useNavigate();
  
  // Usar el hook useComunidadesVecinos para cargar las comunidades del administrador
  const { comunidades, loading: loadingComunidades } = useComunidadesVecinos(admin.id);
  
  // Estado para el diálogo de añadir litros recogidos
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComunidad, setSelectedComunidad] = useState<ComunidadVecinos | null>(null);
  const [litrosRecogidos, setLitrosRecogidos] = useState<number>(0);
  const [fechaRecogida, setFechaRecogida] = useState<string>(new Date().toISOString().split('T')[0]);

  // Calcular totales
  const totalViviendas = comunidades.reduce((sum, comunidad) => sum + (comunidad.numViviendas || 0), 0);
  const totalContenedores = comunidades.reduce((sum, comunidad) => sum + (comunidad.numContenedores || 0), 0);
  const totalLitrosRecogidos = comunidades.reduce((sum, comunidad) => sum + (comunidad.litrosRecogidos || 0), 0);

  const handleActivarDesactivar = async () => {
    if (!admin.id) return;
    
    setIsLoading(true);
    try {
      await updateUsuario(admin.id, { activo: !admin.activo });
      toast.success(`Administrador ${admin.activo ? 'desactivado' : 'activado'} correctamente`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado del administrador");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerComunidades = () => {
    // Almacenar el ID del administrador en sessionStorage
    sessionStorage.setItem('viewingAdminId', admin.id);
    sessionStorage.setItem('fromSuperAdmin', 'true');
    // Redirigir al panel del administrador
    navigate('/administrador/dashboard');
  };
  
  const handleOpenAddLitrosDialog = (comunidad: ComunidadVecinos) => {
    setSelectedComunidad(comunidad);
    setLitrosRecogidos(0);
    setFechaRecogida(new Date().toISOString().split('T')[0]);
    setDialogOpen(true);
  };
  
  const handleAddLitrosRecogidos = async () => {
    if (!selectedComunidad || litrosRecogidos <= 0) return;
    
    try {
      setIsLoading(true);
      
      // Determinar la colección correcta basada en dónde existe la comunidad
      let collectionName = 'comunidadesVecinos';
      
      // Crear el nuevo registro de historial
      const newHistoryEntry = {
        fecha: new Date(fechaRecogida),
        litros: litrosRecogidos,
        id: Date.now().toString()
      };
      
      // Actualizar la comunidad con los nuevos litros y el nuevo registro en el historial
      const comunidadRef = doc(db, collectionName, selectedComunidad.id);
      
      await updateDoc(comunidadRef, {
        litrosRecogidos: (selectedComunidad.litrosRecogidos || 0) + litrosRecogidos,
        historialRecogidas: arrayUnion(newHistoryEntry),
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Se han añadido ${litrosRecogidos}L a la comunidad ${selectedComunidad.nombre}`);
      setDialogOpen(false);
      
      // Intentar actualizar también en la otra colección si existe
      try {
        const otraColeccion = 'comunidades';
        const otraComunidadRef = doc(db, otraColeccion, selectedComunidad.id);
        await updateDoc(otraComunidadRef, {
          litrosRecogidos: (selectedComunidad.litrosRecogidos || 0) + litrosRecogidos,
          historialRecogidas: arrayUnion(newHistoryEntry),
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        // Si falla, simplemente ignoramos el error ya que podría no existir en la otra colección
        console.log("Nota: No se encontró la comunidad en la otra colección");
      }
      
    } catch (error) {
      console.error("Error al añadir litros recogidos:", error);
      toast.error("Error al añadir litros recogidos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{admin.nombre} {admin.apellidos}</h3>
          <p className="text-sm text-muted-foreground">ID: {admin.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{admin.activo ? 'Activo' : 'Inactivo'}</span>
          <Switch
            checked={admin.activo}
            onCheckedChange={handleActivarDesactivar}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="comunidades">Comunidades ({comunidades.length})</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{admin.nombre} {admin.apellidos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Teléfono:</span>
                  <span className="text-sm">{admin.telefono || "No especificado"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Fecha de registro:</span>
                  <span className="text-sm">
                    {admin.createdAt ? formatDate(admin.createdAt) : "No disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Estado cuenta:</span>
                  <span className={`text-sm ${admin.activo ? 'text-green-600' : 'text-red-600'}`}>
                    {admin.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Datos de la Administración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nombre de la administración:</span>
                  <span className="text-sm">{admin.nombreAdministracion || "No especificado"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dirección:</span>
                  <span className="text-sm">{admin.direccion || "No especificada"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ciudad:</span>
                  <span className="text-sm">{admin.ciudad || "No especificada"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Código Postal:</span>
                  <span className="text-sm">{admin.codigoPostal || "No especificado"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comunidades" className="pt-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Comunidades de {admin.nombre} {admin.apellidos}</h3>
            <Button 
              onClick={handleVerComunidades}
              variant="default"
            >
              <Building className="mr-2 h-4 w-4" />
              Ver en el panel del administrador
            </Button>
          </div>
          
          {loadingComunidades ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando comunidades...</p>
            </div>
          ) : comunidades.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">Este administrador no tiene comunidades asignadas</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Viviendas</TableHead>
                    <TableHead>Contenedores</TableHead>
                    <TableHead>Litros Recogidos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comunidades.map((comunidad) => (
                    <TableRow key={comunidad.id}>
                      <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                      <TableCell>
                        {comunidad.direccion}, {comunidad.codigoPostal} {comunidad.ciudad}
                      </TableCell>
                      <TableCell>{comunidad.numViviendas || 0}</TableCell>
                      <TableCell>{comunidad.numContenedores || 0}</TableCell>
                      <TableCell>{comunidad.litrosRecogidos || 0} L</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenAddLitrosDialog(comunidad)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Añadir litros
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="estadisticas" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Comunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{comunidades.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Viviendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Home className="h-8 w-8 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{totalViviendas}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Contenedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Container className="h-8 w-8 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{totalContenedores}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Litros Recogidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Droplet className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{totalLitrosRecogidos} L</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen de actividad</CardTitle>
              <CardDescription>
                Actividad del administrador en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  <span className="font-medium">Fecha de registro:</span> {admin.createdAt ? formatDate(admin.createdAt) : "No disponible"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Última actualización:</span> {admin.updatedAt ? formatDate(admin.updatedAt) : "No disponible"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Comunidades activas:</span> {comunidades.length}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Promedio de viviendas por comunidad:</span> {comunidades.length > 0 ? Math.round(totalViviendas / comunidades.length) : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para añadir litros recogidos */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir litros recogidos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedComunidad && (
              <p className="font-medium">
                Comunidad: {selectedComunidad.nombre}
              </p>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="fechaRecogida">Fecha de recogida</Label>
              <Input
                id="fechaRecogida"
                type="date"
                value={fechaRecogida}
                onChange={(e) => setFechaRecogida(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="litrosRecogidos">Litros recogidos</Label>
              <Input
                id="litrosRecogidos"
                type="number"
                value={litrosRecogidos}
                onChange={(e) => setLitrosRecogidos(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddLitrosRecogidos}
              disabled={isLoading || litrosRecogidos <= 0}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetalleAdministrador;
