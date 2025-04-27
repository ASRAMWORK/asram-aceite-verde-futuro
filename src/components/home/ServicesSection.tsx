
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RecycleIcon, Award, MapPin, Box, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      title: "Alianza Verde Escolar",
      description: "Programa educativo para centros escolares sobre la importancia del reciclaje",
      icon: Award,
      link: "/alianza-verde",
      color: "from-green-50 to-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Puntos Verdes",
      description: "Puntos de recogida de aceite usado en toda la Comunidad de Madrid",
      icon: MapPin,
      link: "/puntos-verdes",
      color: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Apadrina una Calle",
      description: "Colabora instalando contenedores de reciclaje en tu comunidad",
      icon: Handshake,
      link: "/apadrina",
      color: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Detergente Solidario",
      description: "Producción de detergente ecológico con impacto social positivo",
      icon: Box,
      link: "/detergente",
      color: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-gray-50" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-asram-100 opacity-20" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-asram-200 opacity-20" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block p-2 bg-asram-50 rounded-lg text-asram mb-4"
          >
            <RecycleIcon className="h-6 w-6" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Nuestros Programas
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Descubre cómo trabajamos para crear un Madrid más sostenible 
            a través de nuestras iniciativas de economía circular.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              <div className={`bg-gradient-to-r ${service.color} p-6`}>
                <div className={`${service.iconBg} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link 
                  to={service.link} 
                  className="text-asram font-medium hover:underline flex items-center"
                >
                  Más información
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button className="bg-asram hover:bg-asram-700" asChild>
            <Link to="/contacto">
              Únete a nuestros programas
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
