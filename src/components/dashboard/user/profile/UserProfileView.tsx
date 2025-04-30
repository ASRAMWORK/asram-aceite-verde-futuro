
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/types';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Globe,
  Calendar, 
  Activity,
  Edit,
  Shield,
  Clock,
  Users,
  Hotel,
  Coffee,
  Home,
  Award,
  Droplet
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const UserProfileView = () => {
  const { profile, loading, error } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !profile) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error al cargar perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "No se pudo cargar la información del perfil"}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadge = (role: UserRole | string) => {
    const roleStyles: Record<string, string> = {
      'superadmin': 'bg-black text-white',
      'admin': 'bg-red-500 text-white',
      'administrador': 'bg-orange-500 text-white',
      'admin_finca': 'bg-amber-500 text-white',
      'user': 'bg-blue-500 text-white',
      'comunidad': 'bg-green-500 text-white',
      'comercial': 'bg-purple-500 text-white',
      'restaurante': 'bg-yellow-500 text-black',
      'hotel': 'bg-cyan-500 text-white',
      'asociacion': 'bg-indigo-500 text-white',
      'escolar': 'bg-pink-500 text-white',
      'punto_verde': 'bg-emerald-500 text-white',
      'client': 'bg-gray-500 text-white'
    };

    const style = roleStyles[role] || 'bg-gray-500 text-white';

    return (
      <Badge className={`${style}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getRoleIcon = (role: UserRole | string) => {
    switch (role) {
      case 'superadmin':
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'administrador':
      case 'admin_finca':
        return <Building className="h-4 w-4" />;
      case 'comercial':
        return <Activity className="h-4 w-4" />;
      case 'restaurante':
        return <Coffee className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'comunidad':
        return <Home className="h-4 w-4" />;
      case 'asociacion':
        return <Users className="h-4 w-4" />;
      case 'escolar':
        return <Calendar className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getInitials = () => {
    const name = profile.nombre || '';
    const surname = profile.apellidos || '';
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const userRole = profile?.role as string;
  const joinDate = profile.fechaRegistro ? new Date(profile.fechaRegistro) : new Date(profile.createdAt);
  const formattedDate = joinDate.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const handleUpdateProfile = () => {
    toast.info("Función de edición de perfil en desarrollo");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-1/3 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={profile.photoURL || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-[#ee970d] to-amber-500 text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-8 w-8 bg-white"
                  onClick={handleUpdateProfile}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-1">{profile.nombre} {profile.apellidos}</h2>
            <div className="mb-4">{getRoleBadge(profile.role)}</div>
            
            <div className="flex items-center justify-center text-sm text-gray-500 gap-1 mb-4">
              <Clock className="h-3 w-3" />
              <span>Miembro desde {formattedDate}</span>
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm text-gray-600 truncate">{profile.email}</span>
              </div>
              
              <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                <div className="bg-green-50 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm text-gray-600">{profile.telefono || 'No disponible'}</span>
              </div>
              
              <div className="flex items-center gap-2 border-t border-gray-100 pt-2 pb-2">
                <div className="bg-amber-50 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-sm text-gray-600">{profile.ciudad || 'Madrid'}, {profile.pais || 'España'}</span>
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-center pt-4 border-t border-gray-100 mt-4">
            <Button variant="outline" onClick={handleUpdateProfile}>Editar perfil</Button>
          </CardFooter>
        </Card>
        
        <div className="w-full md:w-2/3 space-y-6">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-gray-100/70">
              <TabsTrigger value="personal">Datos personales</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="settings">Ajustes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                  <CardDescription>Datos detallados de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderProfileFields()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Tus estadísticas</CardTitle>
                  <CardDescription>Resumen de tu actividad e impacto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Activity className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">Aceite reciclado</p>
                        <p className="text-2xl font-bold text-green-800">{profile.litrosAportados || 0} L</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">Puntos verdes</p>
                        <p className="text-2xl font-bold text-purple-800">{profile.puntosVerdes || 0} pts</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Droplet className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Agua ahorrada</p>
                        <p className="text-2xl font-bold text-blue-800">{(profile.litrosAportados || 0) * 1000} L</p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-amber-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-amber-700">Recogidas solicitadas</p>
                        <p className="text-2xl font-bold text-amber-800">{profile.numRecogidas || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Ajustes de cuenta</CardTitle>
                  <CardDescription>Configura tus preferencias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Notificaciones por correo</p>
                        <p className="text-sm text-gray-500">Recibe actualizaciones sobre recogidas y eventos</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Cambiar contraseña</p>
                        <p className="text-sm text-gray-500">Actualiza tu contraseña periódicamente</p>
                      </div>
                      <Button variant="outline">Cambiar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Cambiar email</p>
                        <p className="text-sm text-gray-500">Actualiza tu dirección de correo electrónico</p>
                      </div>
                      <Button variant="outline">Cambiar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Cerrar sesión en todos los dispositivos</p>
                        <p className="text-sm text-gray-500">Cierra todas las sesiones activas</p>
                      </div>
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Cerrar sesiones</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  function renderProfileFields() {
    switch (userRole) {
      case 'comunidad':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Viviendas</p>
              <p className="font-medium">{profile.numViviendas || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Contenedores</p>
              <p className="font-medium">{profile.numContenedores || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida || 'No disponible'}</p>
            </div>
          </div>
        );
        
      case 'restaurante':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Restaurante</p>
              <p className="font-medium">{profile.nombreRestaurante || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horario de Apertura</p>
              <p className="font-medium">{profile.horarioApertura || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Litros Estimados</p>
              <p className="font-medium">{profile.litrosEstimados || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida || 'No disponible'}</p>
            </div>
          </div>
        );

      case 'hotel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Hotel</p>
              <p className="font-medium">{profile.nombreHotel || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Habitaciones</p>
              <p className="font-medium">{profile.numHabitaciones || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Litros Estimados</p>
              <p className="font-medium">{profile.litrosEstimados || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida || 'No disponible'}</p>
            </div>
          </div>
        );

      case 'asociacion':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre de la Asociación</p>
              <p className="font-medium">{profile.nombreAsociacion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Asociación</p>
              <p className="font-medium">{profile.tipoAsociacion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Miembros</p>
              <p className="font-medium">{profile.numMiembros || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida || 'No disponible'}</p>
            </div>
          </div>
        );

      case 'escolar':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Centro</p>
              <p className="font-medium">{profile.nombreCentro || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Alumnos</p>
              <p className="font-medium">{profile.numAlumnos || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Centro</p>
              <p className="font-medium">{profile.tipoEscolar || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Participa en Alianza Verde</p>
              <p className="font-medium">{profile.participaAlianzaVerde ? "Sí" : "No"}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="font-medium">{profile.nombre || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Apellido</p>
              <p className="font-medium">{profile.apellidos || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código Postal</p>
              <p className="font-medium">{profile.codigoPostal || 'No disponible'}</p>
            </div>
          </div>
        );
    }
  };
};

export default UserProfileView;
