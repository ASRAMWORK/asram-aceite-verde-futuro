
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Users, RecycleIcon, MapPin, GraduationCap } from "lucide-react";
import StatsSection from "@/components/home/StatsSection";
import ImpactMetrics from "@/components/home/ImpactMetrics";
import ServiceInfo from "@/components/home/ServiceInfo";
import ProgramHighlights from "@/components/home/ProgramHighlights";
import Hero from "@/components/home/Hero";
import NavBar from "@/components/home/NavBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <Hero />
      <main>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="mb-8 space-y-4">
            <StatsSection />
          </div>

          <Tabs defaultValue="alianza" className="space-y-6">
            <TabsList className="inline-flex h-auto p-1 bg-muted gap-2">
              <TabsTrigger value="alianza" className="flex items-center gap-2 px-4 py-2">
                <GraduationCap className="h-4 w-4" />
                <span>Alianza Verde</span>
              </TabsTrigger>
              <TabsTrigger value="apadrina" className="flex items-center gap-2 px-4 py-2">
                <MapPin className="h-4 w-4" />
                <span>Apadrina Calle</span>
              </TabsTrigger>
              <TabsTrigger value="recogida" className="flex items-center gap-2 px-4 py-2">
                <RecycleIcon className="h-4 w-4" />
                <span>Recogida</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alianza" className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Alianza Verde Escolar</CardTitle>
                  <CardDescription>Educación ambiental para un futuro sostenible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Nuestro programa educativo está diseñado para crear conciencia ambiental desde temprana edad,
                    implementando prácticas sostenibles en centros educativos y fomentando la participación activa
                    de estudiantes y profesores.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Educación Ambiental</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Talleres y actividades prácticas sobre reciclaje y sostenibilidad.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Proyectos Escolares</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Iniciativas de reciclaje lideradas por estudiantes.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Impacto Medible</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Seguimiento y métricas del aceite reciclado en escuelas.</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button size="lg" asChild>
                      <Link to="/alianza-verde">Ver más detalles</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <ImpactMetrics />
            </TabsContent>

            <TabsContent value="apadrina" className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Apadrina una Calle</CardTitle>
                  <CardDescription>Únete al cambio en tu comunidad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    El programa "Apadrina una Calle" permite a vecinos y empresas contribuir directamente
                    a la gestión sostenible del aceite usado en su área, mejorando el medio ambiente
                    y fortaleciendo el compromiso comunitario.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contenedores</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Instalación y mantenimiento de contenedores en tu zona.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Reconocimiento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Placa conmemorativa y certificado de participación.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Impacto Local</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Informes mensuales sobre el aceite reciclado en tu calle.</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button size="lg" asChild>
                      <Link to="/apadrina">Apadrina Ahora</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recogida" className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Servicio de Recogida</CardTitle>
                  <CardDescription>Gestión eficiente del aceite usado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Ofrecemos un servicio profesional de recogida de aceite usado, adaptado a las
                    necesidades de particulares y empresas, garantizando una gestión sostenible
                    y responsable.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Proceso Simple</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Solicitud online y recogida programada en 24-48h.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Seguimiento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Control y trazabilidad de cada recogida.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Certificación</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Documentación oficial de la gestión realizada.</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button size="lg" asChild>
                      <Link to="/contacto">Solicitar Recogida</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <ProgramHighlights />
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">¿Listo para unirte?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
