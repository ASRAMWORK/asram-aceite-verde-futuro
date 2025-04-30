
import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMapsApi } from "@/lib/googleMaps";
import { Loader2, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
}

interface GoogleMapLocationsProps {
  locations: Location[];
  height?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
  title?: string;
}

const GoogleMapLocations: React.FC<GoogleMapLocationsProps> = ({
  locations,
  height = "600px",
  zoom = 12,
  center,
  title = "Ubicaciones en el sistema",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsApi();
        
        if (mapRef.current && !map) {
          // Default to Madrid center if no center provided
          const defaultCenter = center || { lat: 40.4168, lng: -3.7038 };
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });
          
          setMap(mapInstance);
        }
        
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Error al cargar el mapa. Por favor, recarga la página.");
      } finally {
        setLoading(false);
      }
    };
    
    initMap();
    
    return () => {
      // Clean up markers when component unmounts
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);
  
  // Add markers when locations or map changes
  useEffect(() => {
    if (!map || !locations.length) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Add new markers
    locations.forEach(location => {
      if (location.lat && location.lng) {
        const position = { lat: location.lat, lng: location.lng };
        
        // Create custom icon with ASRAM color
        const markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#EE970D",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
          scale: 8,
        };
        
        const marker = new google.maps.Marker({
          position,
          map,
          title: location.name,
          icon: markerIcon,
        });
        
        // Create info window with location details
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${location.name}</h3>
              <p class="text-sm">${location.address}</p>
              ${location.type ? `<p class="text-xs text-gray-500">Tipo: ${location.type}</p>` : ''}
            </div>
          `,
        });
        
        // Add click listener to show info window
        // Fix: Cast marker to any to resolve type issue with MVCObject
        marker.addListener("click", () => {
          infoWindow.open(map, marker as any);
        });
        
        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });
    
    // Fit map to show all markers if we have more than one
    if (locations.length > 1) {
      map.fitBounds(bounds);
    } else if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
    }
    
  }, [map, locations]);
  
  const handleRefreshMap = () => {
    if (!map || !locations.length) return;
    
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      if (location.lat && location.lng) {
        bounds.extend({ lat: location.lat, lng: location.lng });
      }
    });
    
    if (locations.length > 1) {
      map.fitBounds(bounds);
    } else if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(zoom);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshMap}
            className="flex items-center gap-1"
          >
            <Map className="h-4 w-4 mr-1" /> Ajustar mapa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center" style={{ height }}>
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
              <p>Cargando mapa...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center" style={{ height }}>
            <div className="text-center text-red-500">{error}</div>
          </div>
        ) : (
          <div 
            ref={mapRef} 
            className="rounded-md border border-border"
            style={{ height, width: "100%" }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMapLocations;
