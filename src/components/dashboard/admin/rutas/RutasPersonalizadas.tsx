
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { useRutas } from '@/hooks/useRutas';

const RutasPersonalizadas = () => {
  const { rutas, loading } = useRutas();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Cargando rutas personalizadas...</p>
      </div>
    );
  }

  const rutasPersonalizadas = rutas.filter(ruta => ruta.tipo === 'personalizada');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Rutas Personalizadas</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Ruta
        </Button>
      </div>

      {rutasPersonalizadas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No hay rutas personalizadas creadas</p>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Crear primera ruta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {rutasPersonalizadas.map(ruta => (
            <Card key={ruta.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ruta.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Puntos: {ruta.puntos?.length || 0}</p>
                  <p>Estado: {ruta.completada ? 'Completada' : 'Pendiente'}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Ver detalle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RutasPersonalizadas;
