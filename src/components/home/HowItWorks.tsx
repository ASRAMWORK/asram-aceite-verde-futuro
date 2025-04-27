
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Calendar, Recycle } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Cómo funcionan nuestros servicios?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="futuristic-card">
            <CardHeader>
              <Container className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Instalación gratuita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                ASRAM proporciona los contenedores adaptados y pequeños envases para que cada hogar almacene el aceite antes de su entrega.
              </p>
            </CardContent>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <Calendar className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Calendario mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se establece un calendario de vaciado por distrito para garantizar un servicio ordenado y regular.
              </p>
            </CardContent>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <Recycle className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Tipo de aceite</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se recoge aceite vegetal usado de cocina (girasol, oliva…) siempre que esté libre de restos sólidos, agua o contaminantes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
