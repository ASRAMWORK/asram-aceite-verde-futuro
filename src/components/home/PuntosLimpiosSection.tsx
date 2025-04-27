
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface PuntoLimpio {
  title: string;
  address: {
    street: string;
    locality: string;
    postal_code: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuntosLimpios = async () => {
      try {
        const response = await fetch('https://datos.madrid.es/egob/catalogo/200284-0-puntos-limpios-fijos.json');
        if (!response.ok) throw new Error('Error al cargar los datos');
        
        const data = await response.json();
        setPuntosLimpios(data['@graph'] || []);
      } catch (err) {
        setError('Error al cargar los puntos limpios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntosLimpios();
  }, []);

  if (loading) return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse text-center">Cargando puntos limpios...</div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-red-500 text-center">{error}</div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Puntos Limpios Fijos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra los puntos limpios fijos de Madrid donde puedes depositar tus residuos de manera responsable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puntosLimpios.map((punto, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-asram" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{punto.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {punto.address.street}<br />
                      {punto.address.postal_code} {punto.address.locality}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Horario:</span><br />
                      {punto.organization.schedule}
                    </p>
                  </div>
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
