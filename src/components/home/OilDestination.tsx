
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHelping, Environment } from "lucide-react";

const OilDestination = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Destino del aceite recogido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="futuristic-card">
            <CardHeader>
              <HandHelping className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Iniciativas solidarias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Proyectos de elaboración de detergente sostenible y otras iniciativas sociales.
              </p>
            </CardContent>
          </Card>

          <Card className="futuristic-card">
            <CardHeader>
              <Environment className="w-12 h-12 text-asram mb-4" />
              <CardTitle>Gestión autorizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Transformación en biodiésel u otros productos a través de gestoras de residuos autorizadas.
              </p>
            </CardContent>
          </Card>
        </div>
        <p className="text-center mt-8 text-gray-600">
          Los fondos obtenidos financian nuevas actividades medioambientales y educativas de ASRAM.
        </p>
      </div>
    </section>
  );
};

export default OilDestination;
