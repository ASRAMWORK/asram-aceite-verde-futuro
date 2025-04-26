
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, FileText, ArrowRight, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PuntosVerdes = () => {
  return (
    <PageLayout 
      title="Puntos Verdes" 
      subtitle="Red de contenedores para el reciclaje de aceite usado"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              Los Puntos Verdes son contenedores gratuitos instalados en comunidades de vecinos, 
              centros escolares y entidades colaboradoras para depositar aceite de cocina usado 
              de forma segura e higiénica, facilitando su posterior reciclaje.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="calendario">Calendario de Recogidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacion" className="space-y-8 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">¿Cómo funciona?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">Instalación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">ASRAM instala gratuitamente contenedores especiales en la ubicación designada, junto con pequeños recipientes para cada hogar.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">Formación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Se imparte una sesión informativa para explicar el correcto uso del sistema y resolver dudas.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">Recogida periódica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">ASRAM se encarga del vaciado periódico según la programación establecida para cada zona.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Requisitos para la instalación</h2>
              <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-asram mt-1 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold text-lg">Espacio adecuado</h3>
                      <p>Zona cubierta, de fácil acceso para residentes y con posibilidad de acceso para el personal de recogida.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-asram mt-1 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold text-lg">Acuerdo comunitario</h3>
                      <p>Aprobación en junta de vecinos o por parte de la administración del edificio/entidad.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-asram mt-1 flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold text-lg">Compromiso mínimo</h3>
                      <p>Compromiso de mantener el punto verde activo durante al menos 6 meses.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">¿Cómo solicitar un Punto Verde?</h2>
              <Card className="bg-gradient-to-br from-asram-50 to-asram-100/50 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-grow space-y-4">
                      <h3 className="text-lg font-semibold">Solicita la instalación gratuita de un Punto Verde en tu comunidad</h3>
                      <p>Completa el formulario de solicitud y nuestro equipo se pondrá en contacto contigo en 48 horas.</p>
                    </div>
                    <button className="bg-asram hover:bg-asram-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                      Solicitar ahora
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Beneficios</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                  <CardHeader>
                    <ThumbsUp className="w-6 h-6 text-asram mb-2" />
                    <CardTitle className="text-lg">Para la comunidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Solución higiénica y cómoda para un residuo problemático</p>
                    <p>• Mejora de la imagen del edificio como espacio comprometido</p>
                    <p>• Prevención de atascos y problemas de fontanería</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                  <CardHeader>
                    <ThumbsUp className="w-6 h-6 text-asram mb-2" />
                    <CardTitle className="text-lg">Para el medio ambiente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Prevención de la contaminación de aguas</p>
                    <p>• Reducción de la huella de carbono</p>
                    <p>• Transformación de un residuo en recurso valioso</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendario" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de recogidas por distrito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-asram-50">
                        <th className="p-3 text-left">Distrito</th>
                        <th className="p-3 text-left">1ª Semana</th>
                        <th className="p-3 text-left">2ª Semana</th>
                        <th className="p-3 text-left">3ª Semana</th>
                        <th className="p-3 text-left">4ª Semana</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-3 font-medium">Centro</td>
                        <td className="p-3">Lunes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Lunes</td>
                        <td className="p-3">-</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="p-3 font-medium">Chamberí</td>
                        <td className="p-3">Martes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Martes</td>
                        <td className="p-3">-</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-3 font-medium">Salamanca</td>
                        <td className="p-3">Miércoles</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Miércoles</td>
                        <td className="p-3">-</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="p-3 font-medium">Retiro</td>
                        <td className="p-3">Jueves</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Jueves</td>
                        <td className="p-3">-</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-3 font-medium">Chamartín</td>
                        <td className="p-3">Viernes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Viernes</td>
                        <td className="p-3">-</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="p-3 font-medium">Tetuán</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Lunes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Lunes</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-3 font-medium">Moncloa</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Martes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Martes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  * Este calendario es orientativo y puede estar sujeto a modificaciones por festividades o incidencias.
                  Los usuarios registrados recibirán notificaciones con antelación sobre cualquier cambio.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default PuntosVerdes;
