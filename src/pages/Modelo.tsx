
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Recycle, Droplet, Leaf, TrendingUp } from "lucide-react";

const Modelo = () => {
  return (
    <PageLayout 
      title="Modelo de Economía Circular" 
      subtitle="Transformando residuos en recursos para un futuro sostenible"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md mb-8">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              ASRAM recoge el aceite usado y lo procesa para obtener biodiésel u otros productos, reinvirtiendo
              los ingresos generados en ampliar servicios y programas de sensibilización, de modo que el propio 
              residuo financia su gestión y promueve la sostenibilidad.
            </p>
          </CardContent>
        </Card>

        <div className="relative py-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-full bg-gradient-to-b from-asram-100 via-asram to-asram-100"></div>
          </div>
          
          <div className="relative z-10 space-y-16">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-asram-700 mb-2">1. Recolección</h3>
                  <p>Recogemos el aceite usado en hogares, comunidades de vecinos y centros educativos mediante nuestro servicio gratuito.</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-6">
              <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-asram-700 mb-2">2. Procesamiento</h3>
                  <p>El aceite se filtra y procesa adecuadamente para convertirlo en biodiésel u otros productos sostenibles.</p>
                </CardContent>
              </Card>
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                <Recycle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-asram-700 mb-2">3. Generación de Recursos</h3>
                  <p>La venta de estos productos genera ingresos que permiten financiar las operaciones de ASRAM.</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-6">
              <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-asram-700 mb-2">4. Reinversión</h3>
                  <p>Estos ingresos se reinvierten en ampliar nuestros servicios, programas educativos y de sensibilización.</p>
                </CardContent>
              </Card>
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                <RefreshCcw className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-asram-700 mb-2">5. Cierre del Ciclo</h3>
                  <p>El círculo se cierra cuando la sostenibilidad económica del sistema permite seguir ampliando el impacto positivo en el medio ambiente y la sociedad.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Modelo;
