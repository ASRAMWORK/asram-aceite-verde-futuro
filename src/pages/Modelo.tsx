
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecycleIcon, TreePalm, Star } from "lucide-react";

const Modelo = () => {
  return (
    <PageLayout 
      title="Modelo Circular" 
      subtitle="Transformando el aceite usado en recursos sostenibles"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed text-gray-700">
              Nuestro modelo circular se basa en la transformación del aceite usado en 
              recursos valiosos, creando un ciclo sostenible que beneficia tanto al 
              medio ambiente como a la comunidad.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Pilares del modelo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <RecycleIcon className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Recolección Eficiente</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema organizado de recogida de aceite usado en hogares, comercios e instituciones, 
                  maximizando el volumen recuperado.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <TreePalm className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Transformación Sostenible</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Procesamiento del aceite usado en biodiesel y otros productos ecológicos, 
                  minimizando el impacto ambiental.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Impacto Social</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Creación de empleo local y beneficios directos para la comunidad a través 
                  de programas sociales y educativos.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Beneficios del Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-asram-700">Beneficios Ambientales</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Reducción de la contaminación del agua</li>
                  <li>Disminución de emisiones de CO2</li>
                  <li>Preservación de recursos naturales</li>
                  <li>Mejora de la calidad del aire</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-asram-700">Beneficios Sociales</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Creación de empleo verde</li>
                  <li>Educación ambiental</li>
                  <li>Fortalecimiento comunitario</li>
                  <li>Desarrollo económico local</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Modelo;
