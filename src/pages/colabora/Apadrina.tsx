
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Users, Building, TreePine } from "lucide-react";

const Apadrina = () => {
  return (
    <PageLayout 
      title="Apadrina una Calle" 
      subtitle="Ayuda a expandir nuestra red de reciclaje"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              El programa "Apadrina una Calle" permite que cualquier persona, familia o empresa pueda "apadrinar" 
              una calle sin servicio de reciclaje, instalando un punto de recolección y formando a la comunidad 
              para su mantenimiento. Con tu aportación mensual, garantizamos la sostenibilidad de esta iniciativa.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Planes de suscripción</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-asram-200"></div>
              <CardHeader>
                <CardTitle>Plan Básico</CardTitle>
                <CardDescription>Para particulares y familias</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">15€</span>
                  <span className="text-sm text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instalación de 1 punto de recogida</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mantenimiento mensual</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Informe trimestral de impacto</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Placa con tu nombre en el punto de recogida</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Seleccionar Plan</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-xl transition-all relative overflow-hidden border-asram">
              <div className="absolute top-0 left-0 w-full h-2 bg-asram"></div>
              <div className="absolute top-2 right-2 bg-asram text-white text-xs px-2 py-1 rounded-full">Popular</div>
              <CardHeader>
                <CardTitle>Plan Comunitario</CardTitle>
                <CardDescription>Para comunidades y asociaciones</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">30€</span>
                  <span className="text-sm text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instalación de 2 puntos de recogida</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mantenimiento quincenal</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Taller formativo gratuito</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Informe mensual de impacto</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Certificado oficial de colaboración</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-asram hover:bg-asram-600">Seleccionar Plan</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-asram-800"></div>
              <CardHeader>
                <CardTitle>Plan Corporativo</CardTitle>
                <CardDescription>Para empresas comprometidas</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">50€</span>
                  <span className="text-sm text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instalación de 4 puntos de recogida</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mantenimiento semanal</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Pack completo de talleres formativos</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mención como entidad colaboradora</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Personalización de los puntos con logo</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Seleccionar Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">¿Por qué apadrinar una calle?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-asram" />
                </div>
                <CardTitle className="text-lg">Impacto local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Contribuyes directamente a mejorar la sostenibilidad de tu entorno más cercano.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-asram" />
                </div>
                <CardTitle className="text-lg">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Fomentas la conciencia ambiental y la participación ciudadana en tu barrio.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                  <Building className="w-6 h-6 text-asram" />
                </div>
                <CardTitle className="text-lg">Reconocimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Tu compromiso con el medio ambiente será visible y reconocido públicamente.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-asram" />
                </div>
                <CardTitle className="text-lg">Sostenibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Ayudas a crear un sistema autosostenible que genera un impacto positivo duradero.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Proceso de apadrinamiento</h2>
          
          <Card className="bg-white/50 backdrop-blur-sm shadow-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">1</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Selecciona tu plan</h3>
                  <p className="text-gray-600">Elige el plan que mejor se adapte a tus objetivos y capacidades.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">2</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Propón una ubicación</h3>
                  <p className="text-gray-600">Sugiere la calle o zona que te gustaría apadrinar o deja que te recomendemos áreas prioritarias.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Formaliza tu suscripción</h3>
                  <p className="text-gray-600">Completa el proceso de pago y recibe la confirmación de tu apadrinamiento.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">4</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">¡Comienza la transformación!</h3>
                  <p className="text-gray-600">En un plazo máximo de 15 días, instalaremos los puntos de recogida y comenzaremos con las actividades programadas.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button size="lg" className="bg-asram hover:bg-asram-600">
            Apadrina ahora
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Si tienes dudas o necesitas más información, escríbenos a <a href="mailto:apadrina@asramadrid.com" className="text-asram hover:underline">apadrina@asramadrid.com</a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Apadrina;
