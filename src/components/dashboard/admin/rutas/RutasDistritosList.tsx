
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { useRutas } from '@/hooks/useRutas';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';

const RutasDistritosList = () => {
  const { rutas, loading: loadingRutas } = useRutas();
  const { getDistritosUnicos, loading: loadingPuntos } = usePuntosVerdes();
  
  if (loadingRutas || loadingPuntos) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Cargando rutas por distrito...</p>
      </div>
    );
  }

  const distritos = getDistritosUnicos();
  const rutasDistritos = rutas.filter(ruta => ruta.tipo === 'distrito');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Rutas por Distrito</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Ruta
        </Button>
      </div>

      {distritos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No hay distritos con puntos verdes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {distritos.map(distrito => {
            const rutasDelDistrito = rutasDistritos.filter(r => r.distrito === distrito);
            const tieneRutaActiva = rutasDelDistrito.some(r => !r.completada);
            
            return (
              <Card key={distrito}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Distrito: {distrito}</CardTitle>
                    {!tieneRutaActiva && (
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Crear ruta
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {rutasDelDistrito.length > 0 ? (
                    <div className="space-y-4">
                      {rutasDelDistrito.map(ruta => (
                        <div key={ruta.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                          <div>
                            <p className="font-medium">{ruta.nombre || `Ruta ${distrito}`}</p>
                            <p className="text-sm text-muted-foreground">
                              Puntos: {ruta.puntos?.length || 0} | 
                              Estado: {ruta.completada ? 'Completada' : 'Pendiente'}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Ver detalle
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No hay rutas creadas para este distrito
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RutasDistritosList;
