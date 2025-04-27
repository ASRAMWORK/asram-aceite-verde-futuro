
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PuntoLimpio {
  title: string;
  address: {
    "street-address": string; // Added quotes around property names with hyphens
    "postal-code": string;    // Added quotes around property names with hyphens
    district: {
      id: string;
      title: string;
    };
  };
  organization: {
    schedule: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

const PuntosLimpiosSection = () => {
  const [puntosLimpios, setPuntosLimpios] = useState<PuntoLimpio[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPuntosLimpios = async () => {
      try {
        // Usar un proxy o servidor alternativo si hay problemas de CORS
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://datos.madrid.es/egob/catalogo/200284-0-puntos-limpios-fijos.json', {
          headers: {
            'Origin': window.location.origin
          },
        });
        
        if (!response.ok) throw new Error('Error al cargar los datos');
        
        const data = await response.json();
        if (data && data['@graph'] && Array.isArray(data['@graph'])) {
          setPuntosLimpios(data['@graph']);
          console.log("Puntos limpios cargados:", data['@graph'].length);
        } else {
          // Si no encontramos los datos en el formato esperado, usamos datos estáticos
          setPuntosLimpios(puntosLimpiosMock);
          toast({
            title: "Usando datos locales",
            description: "No se pudieron cargar datos de la API. Mostrando información local.",
            variant: "warning"
          });
        }
      } catch (err) {
        console.error("Error al cargar puntos limpios:", err);
        setError("Error al cargar los puntos limpios");
        // Usamos datos mock en caso de error
        setPuntosLimpios(puntosLimpiosMock);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con la API de datos. Mostrando información local.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPuntosLimpios();
  }, [toast]);

  if (loading) return <div className="text-center py-8">Cargando puntos limpios...</div>;
  if (error && puntosLimpios.length === 0) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Puntos Limpios de Madrid</h2>
        <p className="text-center text-gray-600 mb-12">
          Encuentra el punto limpio más cercano para reciclar tus residuos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puntosLimpios.map((punto, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-asram" />
                  <span className="text-lg">{punto.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Dirección:</strong> {punto.address && punto.address["street-address"]}</p>
                  <p><strong>Código Postal:</strong> {punto.address && punto.address["postal-code"]}</p>
                  <p><strong>Distrito:</strong> {punto.address && punto.address.district?.title}</p>
                  <p><strong>Horario:</strong> {punto.organization?.schedule}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Datos mock para casos en que la API falle
const puntosLimpiosMock = [
  {
    title: "Punto Limpio Las Dehesillas",
    address: {
      "street-address": "Calle Las Dehesillas s/n",
      "postal-code": "28032",
      district: {
        id: "20",
        title: "San Blas-Canillejas"
      }
    },
    organization: {
      schedule: "Lunes a Sábado: 08:00 a 20:00, Domingos: 09:00 a 14:00"
    },
    location: {
      latitude: 40.4378693,
      longitude: -3.6214156
    }
  },
  {
    title: "Punto Limpio Vallecas",
    address: {
      "street-address": "Calle Arroyo del Olivar, 57",
      "postal-code": "28038",
      district: {
        id: "13",
        title: "Puente de Vallecas"
      }
    },
    organization: {
      schedule: "Lunes a Sábado: 08:00 a 20:00, Domingos: 09:00 a 14:00"
    },
    location: {
      latitude: 40.387975,
      longitude: -3.6557905
    }
  },
  {
    title: "Punto Limpio Vicálvaro",
    address: {
      "street-address": "Calle Villablanca, 75",
      "postal-code": "28032",
      district: {
        id: "19",
        title: "Vicálvaro"
      }
    },
    organization: {
      schedule: "Lunes a Sábado: 08:00 a 20:00, Domingos: 09:00 a 14:00"
    },
    location: {
      latitude: 40.4022638,
      longitude: -3.6121118
    }
  }
];

export default PuntosLimpiosSection;
