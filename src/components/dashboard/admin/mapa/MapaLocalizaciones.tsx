
import React, { useEffect, useState } from "react";
import GoogleMapLocations from "@/components/maps/GoogleMapLocations";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MapLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

const MapaLocalizaciones = () => {
  const { instalaciones, loading: loadingInstalaciones } = useInstalaciones();
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [mapTab, setMapTab] = useState<string>("all");
  
  // Process instalaciones and puntos verdes
  useEffect(() => {
    const allLocations: MapLocation[] = [];
    
    // Add instalaciones (if not loading and have valid coordinates)
    if (!loadingInstalaciones) {
      instalaciones.forEach(inst => {
        if (inst.latitud && inst.longitud) {
          allLocations.push({
            id: inst.id,
            name: inst.nombre || "Instalación sin nombre",
            address: `${inst.direccion}, ${inst.ciudad}, ${inst.provincia}`,
            lat: inst.latitud,
            lng: inst.longitud,
            type: inst.tipo || "instalación",
          });
        }
      });
    }
    
    // Add puntos verdes (if not loading and have valid coordinates)
    if (!loadingPuntos) {
      puntosVerdes.forEach(punto => {
        if (punto.latitud && punto.longitud) {
          allLocations.push({
            id: punto.id,
            name: punto.nombre || "Punto Verde sin nombre",
            address: `${punto.direccion}, ${punto.distrito}, ${punto.barrio}`,
            lat: punto.latitud,
            lng: punto.longitud,
            type: "punto_verde",
          });
        }
      });
    }
    
    setLocations(allLocations);
  }, [instalaciones, puntosVerdes, loadingInstalaciones, loadingPuntos]);
  
  // Filter locations based on selected tab
  const getFilteredLocations = () => {
    if (mapTab === "all") return locations;
    if (mapTab === "instalaciones") return locations.filter(loc => loc.type !== "punto_verde");
    if (mapTab === "puntos") return locations.filter(loc => loc.type === "punto_verde");
    return locations;
  };
  
  const filteredLocations = getFilteredLocations();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mapa de Localizaciones</h2>
          <p className="text-muted-foreground">
            Vista general de todas las direcciones registradas en el sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background px-3 py-1">
            Total: {locations.length}
          </Badge>
          <Badge variant="outline" className="bg-background px-3 py-1">
            Instalaciones: {locations.filter(loc => loc.type !== "punto_verde").length}
          </Badge>
          <Badge variant="outline" className="bg-background px-3 py-1">
            Puntos Verdes: {locations.filter(loc => loc.type === "punto_verde").length}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={mapTab} onValueChange={setMapTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas las ubicaciones</TabsTrigger>
          <TabsTrigger value="instalaciones">Instalaciones</TabsTrigger>
          <TabsTrigger value="puntos">Puntos Verdes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <GoogleMapLocations
            locations={filteredLocations}
            title={`Todas las ubicaciones (${filteredLocations.length})`}
            height="600px"
          />
        </TabsContent>
        
        <TabsContent value="instalaciones" className="mt-6">
          <GoogleMapLocations
            locations={filteredLocations}
            title={`Instalaciones (${filteredLocations.length})`}
            height="600px"
          />
        </TabsContent>
        
        <TabsContent value="puntos" className="mt-6">
          <GoogleMapLocations
            locations={filteredLocations}
            title={`Puntos Verdes (${filteredLocations.length})`}
            height="600px"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapaLocalizaciones;
