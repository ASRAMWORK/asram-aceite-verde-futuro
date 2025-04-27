
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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

  useEffect(() => {
    const fetchPuntosLimpios = async () => {
      try {
        const response = await fetch('https://datos.madrid.es/egob/catalogo/200284-0-puntos-limpios-fijos.json');
        if (!response.ok) throw new Error('Error al cargar los datos');
        
        const data = await response.json();
        setPuntosLimpios(data['@graph'] || []);
      } catch (err) {
        setError("Error al cargar los puntos limpios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntosLimpios();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando puntos limpios...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

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
                  <p><strong>Dirección:</strong> {punto.address["street-address"]}</p>
                  <p><strong>Código Postal:</strong> {punto.address["postal-code"]}</p>
                  <p><strong>Distrito:</strong> {punto.address.district?.title}</p>
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

export default PuntosLimpiosSection;
