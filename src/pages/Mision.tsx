
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const Mision = () => {
  return (
    <PageLayout 
      title="Misión y Visión" 
      subtitle="Nuestro compromiso con el medio ambiente y la sociedad"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-asram-800 mb-4">Nuestra Misión</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Transformar la gestión del aceite usado en Madrid a través de un modelo 
                sostenible y socialmente responsable, creando conciencia ambiental y 
                generando valor para la comunidad.
              </p>
              
              <h2 className="text-2xl font-bold text-asram-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-700 leading-relaxed">
                Ser referentes en la economía circular en Madrid, liderando la 
                transformación hacia una sociedad más sostenible y consciente del 
                impacto ambiental.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-asram-800 mb-4">Nuestros Valores</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-asram-700 mb-2">Sostenibilidad</h3>
                  <p className="text-gray-600">Compromiso con el medio ambiente y las generaciones futuras.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-asram-700 mb-2">Innovación</h3>
                  <p className="text-gray-600">Búsqueda constante de soluciones creativas y eficientes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-asram-700 mb-2">Comunidad</h3>
                  <p className="text-gray-600">Trabajo colaborativo con vecinos y organizaciones locales.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-asram-700 mb-2">Transparencia</h3>
                  <p className="text-gray-600">Gestión clara y honesta en todas nuestras operaciones.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Mision;
