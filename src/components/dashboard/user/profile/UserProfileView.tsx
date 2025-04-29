import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/types';

const UserProfileView = () => {
  const { profile, loading, error } = useUserProfile();
  
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

  const renderProfileFields = () => {
    switch (profile.role as UserRole) {
      case 'comunidad':
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Viviendas</p>
              <p className="font-medium">{profile.numViviendas}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Contenedores</p>
              <p className="font-medium">{profile.numContenedores}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida}</p>
            </div>
          </>
        );
        
      case 'restaurante':
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Restaurante</p>
              <p className="font-medium">{profile.nombreRestaurante}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horario de Apertura</p>
              <p className="font-medium">{profile.horarioApertura}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Litros Estimados</p>
              <p className="font-medium">{profile.litrosEstimados}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida}</p>
            </div>
          </>
        );

      case 'hotel':
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Hotel</p>
              <p className="font-medium">{profile.nombreHotel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Habitaciones</p>
              <p className="font-medium">{profile.numHabitaciones}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Litros Estimados</p>
              <p className="font-medium">{profile.litrosEstimados}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida}</p>
            </div>
          </>
        );

      case 'asociacion':
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre de la Asociación</p>
              <p className="font-medium">{profile.nombreAsociacion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Asociación</p>
              <p className="font-medium">{profile.tipoAsociacion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Miembros</p>
              <p className="font-medium">{profile.numMiembros}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frecuencia de Recogida</p>
              <p className="font-medium">{profile.frecuenciaRecogida}</p>
            </div>
          </>
        );

      case 'escolar':
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre del Centro</p>
              <p className="font-medium">{profile.nombreCentro}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Alumnos</p>
              <p className="font-medium">{profile.numAlumnos}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Centro</p>
              <p className="font-medium">{profile.tipoEscolar}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Participa en Alianza Verde</p>
              <p className="font-medium">{profile.participaAlianzaVerde ? "Sí" : "No"}</p>
            </div>
          </>
        );

      default:
        return (
          <>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="font-medium">{profile.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Apellido</p>
              <p className="font-medium">{profile.apellido}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{profile.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Distrito</p>
              <p className="font-medium">{profile.distrito}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Barrio</p>
              <p className="font-medium">{profile.barrio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile.telefono}</p>
            </div>
          </>
        );
    }
  };

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <CardTitle>Tus Datos Personales</CardTitle>
        <CardDescription>
          Información personal y de contacto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderProfileFields()}
        </div>
        
        <div className="pt-4">
          <Button variant="outline">Editar perfil</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileView;
