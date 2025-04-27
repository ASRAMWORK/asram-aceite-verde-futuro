import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Heart, Leaf, Users, Lightbulb, Globe } from "lucide-react";
import { useEffect } from "react";

const Mision = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PageLayout 
      title="Misión y Visión" 
      subtitle="Nuestro compromiso con el medio ambiente y la sociedad"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Misión y Visión */}
          <Card className="bg-white/70 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-asram-100 rounded-full">
                      <Lightbulb className="h-5 w-5 text-asram-700" />
                    </span>
                    <h2 className="text-2xl font-bold text-asram-800">Nuestra Misión</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Transformar la gestión del aceite usado en Madrid a través de un modelo 
                    sostenible y socialmente responsable, creando conciencia ambiental y 
                    generando valor para la comunidad.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Buscamos implementar soluciones innovadoras que conecten a la ciudadanía 
                    con la economía circular, facilitando el reciclaje y promoviendo hábitos 
                    sostenibles en los hogares madrileños.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-asram-100 rounded-full">
                      <Globe className="h-5 w-5 text-asram-700" />
                    </span>
                    <h2 className="text-2xl font-bold text-asram-800">Nuestra Visión</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Ser referentes en la economía circular en Madrid, liderando la 
                    transformación hacia una sociedad más sostenible y consciente del 
                    impacto ambiental.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Aspiramos a crear una red integral de reciclaje que sea accesible 
                    para todos los ciudadanos, contribuyendo significativamente a la 
                    reducción de la contaminación y al desarrollo de una economía 
                    local basada en la sostenibilidad.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Valores */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-asram-800 mb-6">Nuestros Valores</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div variants={fadeIn} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-asram-700 text-lg mb-2">Sostenibilidad</h3>
                      <p className="text-gray-600">
                        Compromiso con el medio ambiente y las generaciones futuras a través 
                        de prácticas responsables y un modelo de negocio que prioriza el 
                        impacto positivo sobre el beneficio económico.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeIn} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-asram-700 text-lg mb-2">Innovación</h3>
                      <p className="text-gray-600">
                        Búsqueda constante de soluciones creativas y eficientes que 
                        permitan mejorar nuestros procesos y ofrecer alternativas 
                        accesibles para el reciclaje de aceite usado.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeIn} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-asram-700 text-lg mb-2">Comunidad</h3>
                      <p className="text-gray-600">
                        Trabajo colaborativo con vecinos y organizaciones locales para 
                        crear una red de apoyo que fortalezca el tejido social y 
                        promueva la participación ciudadana en el cuidado del entorno.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeIn} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-asram-700 text-lg mb-2">Transparencia</h3>
                      <p className="text-gray-600">
                        Gestión clara y honesta en todas nuestras operaciones, 
                        compartiendo información sobre nuestros procesos, resultados e 
                        impacto ambiental con todos nuestros colaboradores.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Objetivos */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Card className="bg-white/70 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-asram-800 mb-6">Objetivos Estratégicos</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 rounded-full bg-asram-100 items-center justify-center">
                      <span className="text-asram-700 font-semibold">01</span>
                    </div>
                    <p className="font-medium">Implementar una red completa de puntos de recogida en toda la ciudad</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 rounded-full bg-asram-100 items-center justify-center">
                      <span className="text-asram-700 font-semibold">02</span>
                    </div>
                    <p className="font-medium">Reducir la contaminación de aguas en Madrid en un 15% para 2026</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 rounded-full bg-asram-100 items-center justify-center">
                      <span className="text-asram-700 font-semibold">03</span>
                    </div>
                    <p className="font-medium">Crear 50 nuevos empleos verdes en comunidades vulnerables</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 rounded-full bg-asram-100 items-center justify-center">
                      <span className="text-asram-700 font-semibold">04</span>
                    </div>
                    <p className="font-medium">Desarrollar programas educativos que lleguen a 100 escuelas</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 rounded-full bg-asram-100 items-center justify-center">
                      <span className="text-asram-700 font-semibold">05</span>
                    </div>
                    <p className="font-medium">Establecer alianzas con 20 empresas para reutilizar el aceite reciclado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Mision;
