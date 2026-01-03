import { Link } from "react-router-dom";
import { ArrowRight, Info, Target, RefreshCw, Users, Calendar, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AboutSection = () => {
  const features = [
    {
      icon: Truck,
      title: "Recogida gratuita",
      description: "Servicio de recogida a domicilio sin coste para comunidades de vecinos"
    },
    {
      icon: Calendar,
      title: "Calendario fijo",
      description: "Cada distrito tiene su día asignado para una recogida ordenada y puntual"
    },
    {
      icon: Shield,
      title: "Gestión certificada",
      description: "Cumplimos con toda la normativa medioambiental vigente"
    },
    {
      icon: RefreshCw,
      title: "Economía circular",
      description: "El aceite se transforma en biodiesel y productos de limpieza ecológicos"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#ee970d]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-white" />
      
      <div className="container mx-auto px-4 relative">
        {/* Título principal */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee970d]/10 rounded-full text-[#ee970d] mb-4"
          >
            <Info className="h-5 w-5" />
            <span className="font-medium">Conócenos</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-gray-800"
          >
            Sobre <span className="text-[#ee970d]">ASRAM Madrid</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg"
          >
            Somos la Asociación para el Reciclaje de Aceite de Madrid, líderes en la gestión 
            sostenible del aceite de cocina usado. Transformamos un residuo doméstico en recursos 
            valiosos mientras generamos empleo y cuidamos nuestro medio ambiente.
          </motion.p>
        </div>

        {/* Grid de contenido con imagen */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Reciclaje sostenible" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-lg font-medium">
                  Más de 10 años transformando residuos en recursos
                </p>
              </div>
            </div>
            {/* Badge flotante */}
            <div className="absolute -bottom-6 -right-6 bg-[#ee970d] text-white p-4 rounded-2xl shadow-lg">
              <p className="text-3xl font-bold">+10</p>
              <p className="text-sm">años de experiencia</p>
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800">
              ¿Por qué reciclar el aceite de cocina usado?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Un solo litro de aceite vertido por el desagüe puede contaminar hasta 
              <strong className="text-[#ee970d]"> 1.000 litros de agua</strong>. El aceite obstruye tuberías, 
              daña las depuradoras y contamina ríos y mares. Sin embargo, cuando se recicla correctamente, 
              se convierte en biodiesel, jabones y detergentes ecológicos.
            </p>
            <p className="text-gray-600 leading-relaxed">
              En ASRAM trabajamos cada día para que <strong>todo el aceite usado de Madrid</strong> tenga 
              una segunda vida. Nuestro modelo de economía circular genera empleo local, reduce emisiones 
              de CO₂ y protege nuestros recursos hídricos.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#ee970d]/5 transition-colors">
                  <div className="p-2 bg-[#ee970d]/10 rounded-lg">
                    <feature.icon className="h-5 w-5 text-[#ee970d]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cards de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Equipo ASRAM" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-[#ee970d]" />
                <h3 className="text-xl font-bold text-gray-800">Quiénes Somos</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Un equipo comprometido con la sostenibilidad, formado por profesionales y voluntarios 
                que creen en un Madrid más limpio.
              </p>
              <Link to="/about" className="flex items-center text-[#ee970d] font-medium hover:underline group/link">
                Conocer el equipo <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Misión y visión" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Misión y Visión</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Nuestra misión es liderar la transición hacia un modelo de economía circular 
                en la gestión de residuos domésticos en Madrid.
              </p>
              <Link to="/mision" className="flex items-center text-green-600 font-medium hover:underline group/link">
                Descubrir <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Modelo circular" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Modelo Circular</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Del aceite usado al biodiesel: descubre cómo transformamos un residuo 
                en un recurso valioso para la sociedad.
              </p>
              <Link to="/modelo" className="flex items-center text-blue-600 font-medium hover:underline group/link">
                Ver proceso <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button className="bg-[#ee970d] hover:bg-[#d88a0c] text-white px-8 py-6 text-lg rounded-xl" asChild>
            <Link to="/about">
              Conoce nuestra historia completa
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
