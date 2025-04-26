
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Recycle, BarChart4 } from "lucide-react";

const Detergente = () => {
  return (
    <PageLayout 
      title="Detergente Solidario" 
      subtitle="Proyecto de emergencia social para comunidades vulnerables"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              El proyecto "Detergente Solidario" convierte aceite usado en detergente sostenible, 
              donándolo en zonas afectadas por catástrofes naturales como la DANA y otras situaciones 
              de emergencia, para ayudar a comunidades vulnerables en momentos de crisis.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">¿Cómo funciona?</h2>
          
          <div className="relative py-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-gradient-to-b from-asram-100 via-asram to-asram-100"></div>
            </div>
            
            <div className="relative z-10 space-y-16">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-asram-700 mb-2">1. Recolección y transformación</h3>
                    <p>Recolectamos aceite usado a través de nuestra red de Puntos Verdes y lo procesamos en nuestros laboratorios para crear un detergente ecológico y biodegradable.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-6">
                <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-asram-700 mb-2">2. Identificación de necesidades</h3>
                    <p>Trabajamos con organizaciones locales y servicios de emergencia para identificar comunidades afectadas por catástrofes o en situación de vulnerabilidad.</p>
                  </CardContent>
                </Card>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-asram-700 mb-2">3. Distribución</h3>
                    <p>Entregamos el detergente solidario directamente a las familias afectadas, junto con información sobre su uso y beneficios medioambientales.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-6">
                <Card className="flex-grow bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-asram-700 mb-2">4. Seguimiento e impacto</h3>
                    <p>Realizamos un seguimiento posterior para evaluar el impacto del proyecto y mejorar continuamente nuestros procesos y alcance.</p>
                  </CardContent>
                </Card>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-asram flex items-center justify-center shadow-lg">
                  <BarChart4 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Nuestro impacto hasta la fecha</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm shadow-md text-center p-6">
              <div className="text-4xl font-bold text-asram mb-2">2,500</div>
              <p className="text-gray-700">Litros de detergente donados</p>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md text-center p-6">
              <div className="text-4xl font-bold text-asram mb-2">15</div>
              <p className="text-gray-700">Comunidades asistidas</p>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md text-center p-6">
              <div className="text-4xl font-bold text-asram mb-2">850</div>
              <p className="text-gray-700">Familias beneficiadas</p>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Áreas de actuación reciente</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle>Zona DANA - Comunidad Valenciana</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Tras las devastadoras inundaciones de 2023, distribuimos más de 1,000 litros de detergente 
                  entre las familias afectadas en Valencia, Utiel y poblaciones cercanas.
                </p>
                <img 
                  src="https://via.placeholder.com/500x300" 
                  alt="Distribución de detergente en Valencia" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle>Madrid Sur - Programas comunitarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Colaboración con asociaciones vecinales para proporcionar detergente a familias 
                  en situación de vulnerabilidad económica en varios distritos del sur de Madrid.
                </p>
                <img 
                  src="https://via.placeholder.com/500x300" 
                  alt="Programa comunitario en Madrid Sur" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">¿Cómo colaborar?</h2>
          
          <Card className="bg-white/50 backdrop-blur-sm shadow-md overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-asram-700">Únete al proyecto</h3>
                <p>
                  Puedes colaborar con este proyecto solidario de varias formas. Cada aportación, 
                  por pequeña que sea, contribuye a que podamos seguir ayudando a quienes más lo necesitan.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-asram"></div>
                    <p>Donando aceite usado en nuestros Puntos Verdes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-asram"></div>
                    <p>Realizando una aportación económica</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-asram"></div>
                    <p>Participando como voluntario en la elaboración o distribución</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-asram"></div>
                    <p>Difundiendo el proyecto en tus redes</p>
                  </div>
                </div>
                <Button className="mt-4 flex items-center gap-2">
                  Quiero colaborar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-asram-50 p-6 flex flex-col justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-asram-700 mb-4">Donaciones directas</h3>
                  <p className="mb-6">
                    Si prefieres hacer una donación económica para apoyar este proyecto:
                  </p>
                  <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                    <p className="font-semibold mb-1">BIZUM:</p>
                    <p className="text-lg">01234</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="font-semibold mb-1">Cuenta bancaria:</p>
                    <p className="text-lg">ES12 3456 7890 1234 5678 9012</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Detergente;
