
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
  Container
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
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

interface DetalleAdministradorProps {
  admin: Usuario;
}

const DetalleAdministrador: React.FC<DetalleAdministradorProps> = ({ admin }) => {
  const { updateUsuario } = useUsuarios();
  const [isLoading, setIsLoading] = useState(false);
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [activeTab, setActiveTab] = useState("perfil");
  const [totalViviendas, setTotalViviendas] = useState(0);
  const [totalContenedores, setTotalContenedores] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadComunidades = async () => {
      try {
        if (!admin.id) return;
        
        const comunidadesQuery = query(
          collection(db, "comunidades"),
          where("administradorId", "==", admin.id)
        );
        
        const querySnapshot = await getDocs(comunidadesQuery);
        const comunidadesData: ComunidadVecinos[] = [];
        
        let viviendasCount = 0;
        let contenedoresCount = 0;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<ComunidadVecinos, 'id'>;
          const comunidad = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
          } as ComunidadVecinos;
          
          comunidadesData.push(comunidad);
          
          // Contar viviendas y contenedores
          if (comunidad.numViviendas) viviendasCount += comunidad.numViviendas;
          if (comunidad.numContenedores) contenedoresCount += comunidad.numContenedores;
        });
        
        setComunidades(comunidadesData);
        setTotalViviendas(viviendasCount);
        setTotalContenedores(contenedoresCount);
      } catch (error) {
        console.error("Error cargando comunidades:", error);
        toast.error("Error al cargar las comunidades");
      }
    };
    
    loadComunidades();
  }, [admin.id]);

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
          
          {comunidades.length === 0 ? (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              disabled={comunidades.length === 0}
            >
              Exportar datos
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="estadisticas" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen de actividad</CardTitle>
              <CardDescription>
                Actividad del administrador en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí podrían ir gráficos o más estadísticas avanzadas */}
              <p className="text-center py-4 text-muted-foreground">
                Las estadísticas detalladas estarán disponibles próximamente
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalleAdministrador;
