
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Recycle, Droplet } from "lucide-react";

const ServiceFeatures = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">¿Cómo funcionan nuestros servicios?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Container className="w-10 h-10 text-asram" />
            <CardTitle className="text-lg">Instalación gratuita</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              ASRAM proporciona los contenedores adaptados y pequeños envases para que cada hogar almacene el aceite.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Recycle className="w-10 h-10 text-asram" />
            <CardTitle className="text-lg">Recogida mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Se establece un calendario de vaciado por distrito para garantizar un servicio ordenado.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Droplet className="w-10 h-10 text-asram" />
            <CardTitle className="text-lg">Tipo de aceite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Se recoge aceite vegetal usado de cocina libre de restos sólidos y contaminantes.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ServiceFeatures;
