
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';
import { useUsuarios } from '@/hooks/useUsuarios';
import GoogleMapLocations from '@/components/maps/GoogleMapLocations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
}

const MapaLocalizaciones = () => {
  const [filtro, setFiltro] = useState<string>('todos');
  const [locations, setLocations] = useState<Location[]>([]);
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  
  useEffect(() => {
    if (!loadingPuntos && !loadingUsuarios) {
      const allLocations: Location[] = [];
      
      // Add puntos verdes
      puntosVerdes.forEach(punto => {
        if (punto.latitud && punto.longitud) {
          allLocations.push({
            id: punto.id,
            name: punto.nombre || punto.direccion,
            address: punto.direccion,
            lat: punto.latitud,
            lng: punto.longitud,
            type: 'punto_verde'
          });
        }
      });
      
      // Add usuarios with addresses (only if they have coordinates)
      usuarios.forEach(usuario => {
        if (usuario.latitud && usuario.longitud) {
          allLocations.push({
            id: usuario.id,
            name: usuario.nombre,
            address: usuario.direccion,
            lat: usuario.latitud,
            lng: usuario.longitud,
            type: usuario.tipo || usuario.role
          });
        }
      });
      
      setLocations(allLocations);
    }
  }, [puntosVerdes, usuarios, loadingPuntos, loadingUsuarios]);
  
  const filteredLocations = filtro === 'todos' 
    ? locations
    : locations.filter(loc => loc.type === filtro);
  
  if (loadingPuntos || loadingUsuarios) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Cargando datos del mapa...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mapa de Localizaciones</h2>
          <p className="text-muted-foreground">
            Visualización geográfica de puntos registrados en el sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="punto_verde">Puntos Verdes</SelectItem>
              <SelectItem value="cliente">Clientes</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="comercial">Comerciales</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge>{filteredLocations.length} ubicaciones</Badge>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Mapa de ubicaciones registradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GoogleMapLocations 
            locations={filteredLocations} 
            height="600px" 
            zoom={12}
            title="Ubicaciones registradas en el sistema"
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Puntos Verdes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{locations.filter(l => l.type === 'punto_verde').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{locations.filter(l => l.type === 'cliente').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{locations.filter(l => l.type === 'admin').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Comerciales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{locations.filter(l => l.type === 'comercial').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapaLocalizaciones;
