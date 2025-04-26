
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const Detergente = () => {
  return (
    <PageLayout 
      title="Detergente Solidario" 
      subtitle="Proyecto de emergencia social y sostenibilidad"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-asram-800 mb-4">
              Sobre el Proyecto
            </h2>
            <p className="text-gray-700 leading-relaxed">
              El proyecto Detergente Solidario transforma el aceite usado en productos 
              de limpieza eco-friendly que son distribuidos a familias en situación 
              de vulnerabilidad y organizaciones sociales.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-asram-700 mb-3">
                Impacto Social
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Ayuda a familias vulnerables</li>
                <li>• Creación de empleo social</li>
                <li>• Formación en economía circular</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-asram-700 mb-3">
                Beneficios Ambientales
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Reducción de residuos</li>
                <li>• Productos eco-friendly</li>
                <li>• Menor huella de carbono</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-asram-800 mb-4">
              ¿Cómo Colaborar?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-asram-700 mb-2">Dona Aceite</h3>
                <p className="text-gray-600">
                  Lleva tu aceite usado a nuestros puntos de recogida.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-asram-700 mb-2">Voluntariado</h3>
                <p className="text-gray-600">
                  Participa en el proceso de producción y distribución.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-asram-700 mb-2">Aportación</h3>
                <p className="text-gray-600">
                  Contribuye económicamente al mantenimiento del proyecto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Detergente;
