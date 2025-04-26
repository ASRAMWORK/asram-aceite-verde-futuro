
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const Modelo = () => {
  return (
    <PageLayout 
      title="Modelo Circular" 
      subtitle="Un sistema integral de gestión sostenible"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-asram-800 mb-4">
                Nuestro Modelo de Economía Circular
              </h2>
              <p className="text-gray-700 leading-relaxed">
                ASRAM ha desarrollado un modelo innovador que transforma el aceite usado 
                en recursos valiosos, creando un ciclo sostenible que beneficia tanto al 
                medio ambiente como a la comunidad.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-asram-700 mb-3">Recolección</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Red de contenedores en puntos estratégicos</li>
                  <li>• Servicio gratuito para comunidades</li>
                  <li>• Sistema de recogida optimizado</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-asram-700 mb-3">Procesamiento</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Filtrado y tratamiento especializado</li>
                  <li>• Control de calidad riguroso</li>
                  <li>• Tecnología eco-eficiente</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-asram-700 mb-3">Transformación</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Producción de biodiesel</li>
                  <li>• Elaboración de productos de limpieza</li>
                  <li>• Investigación de nuevos usos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-asram-700 mb-3">Impacto Social</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Creación de empleo verde</li>
                  <li>• Programas educativos</li>
                  <li>• Apoyo a colectivos vulnerables</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Modelo;
