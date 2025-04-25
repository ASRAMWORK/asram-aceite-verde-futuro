
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Water, Recycle, Book } from "lucide-react";

const Benefits = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Beneficios e impacto ambiental
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="futuristic-card">
            <CardHeader>
              <Water className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Reducción de la contaminación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un solo litro de aceite usado puede llegar a contaminar hasta 1.000 L de agua.
              </p>
            </CardContent>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <Recycle className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Economía circular</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Convierte un residuo doméstico en recurso útil, generando empleo verde y apoyando a personas en riesgo de exclusión social.
              </p>
            </CardContent>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <Book className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Concienciación educativa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A través de talleres y campañas vinculadas a los Puntos Verdes, se fomenta la responsabilidad ambiental en toda la comunidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
