
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Droplet, Recycle, Book, Earth, HandHelping } from "lucide-react";

const HomeView = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-asram">ASRAM</h1>
        <p className="text-xl text-gray-600">
          Juntos por un futuro más sostenible
        </p>
      </section>

      {/* How it Works Section */}
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

      {/* Benefits Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Beneficios e impacto ambiental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Droplet className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Reducción de contaminación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un litro de aceite usado puede contaminar hasta 1.000 L de agua.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Recycle className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Economía circular</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Convertimos residuos en recursos útiles, generando empleo verde.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Book className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Concienciación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fomentamos la responsabilidad ambiental mediante talleres y campañas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Oil Destination Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Destino del aceite recogido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <HandHelping className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Iniciativas solidarias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Proyectos de elaboración de detergente sostenible y otras iniciativas sociales.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Earth className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Gestión autorizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Transformación en biodiésel u otros productos a través de gestoras autorizadas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
