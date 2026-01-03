import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  RecycleIcon, 
  Award, 
  MapPin, 
  Box, 
  Handshake, 
  GraduationCap, 
  TreePine, 
  Leaf,
  ArrowRight,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const mainPrograms = [
    {
      title: "Alianza Verde Escolar",
      description: "Programa educativo integral para centros escolares. Formamos a las nuevas generaciones en la importancia del reciclaje y la economía circular a través de talleres, actividades y materiales didácticos.",
      icon: GraduationCap,
      link: "/alianza-verde",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "+150 colegios",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "ASRAM Kids",
      description: "Talleres divertidos y educativos para los más pequeños. Aprenden jugando sobre reciclaje, medio ambiente y sostenibilidad con actividades adaptadas a cada edad.",
      icon: Users,
      link: "/asram-kids",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "+5.000 niños",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Puntos Verdes",
      description: "Red de más de 1.500 puntos de recogida distribuidos por toda la Comunidad de Madrid. Comercios, instituciones y espacios públicos comprometidos con el reciclaje.",
      icon: MapPin,
      link: "/puntos-verdes",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "+1.500 puntos",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "ASRAM Rural",
      description: "Llevamos el reciclaje a zonas rurales de la Comunidad de Madrid. Adaptamos nuestros servicios a las necesidades de pueblos y municipios pequeños.",
      icon: TreePine,
      link: "/asram-rural",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "+50 municipios",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const additionalServices = [
    {
      title: "Apadrina una Calle",
      description: "Colabora instalando contenedores de reciclaje en tu comunidad o comercio",
      icon: Handshake,
      link: "/apadrina",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Detergente Solidario",
      description: "Producción de detergente ecológico elaborado con aceite reciclado",
      icon: Box,
      link: "/detergente",
      color: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      title: "Convocatorias y Ayudas",
      description: "Subvenciones y bonificaciones para comunidades participantes",
      icon: Award,
      link: "/convocatorias",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Sé Voluntario",
      description: "Únete a nuestro equipo y colabora activamente en nuestros proyectos",
      icon: Leaf,
      link: "/voluntarios",
      color: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#ee970d]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-green-200/30 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee970d]/10 rounded-full text-[#ee970d] mb-4"
          >
            <RecycleIcon className="h-5 w-5" />
            <span className="font-medium">Nuestros programas</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-800"
          >
            Iniciativas que <span className="text-[#ee970d]">transforman</span> Madrid
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg"
          >
            Descubre cómo trabajamos en múltiples frentes para crear un Madrid más sostenible. 
            Desde la educación hasta la acción directa, cada programa tiene un impacto real.
          </motion.p>
        </div>
        
        {/* Programas principales - Grid de cards grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainPrograms.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Imagen de fondo */}
              <div className="h-56 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              
              {/* Badge de estadísticas */}
              <div className={`absolute top-4 right-4 bg-gradient-to-r ${program.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                {program.stats}
              </div>
              
              {/* Contenido */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-gradient-to-r ${program.color} rounded-xl`}>
                    <program.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {program.description}
                </p>
                <Link 
                  to={program.link} 
                  className="inline-flex items-center gap-2 text-[#ee970d] font-semibold hover:gap-3 transition-all"
                >
                  Descubre más
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Servicios adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Más formas de <span className="text-[#ee970d]">colaborar</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Link 
                to={service.link}
                className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all hover:-translate-y-1 group h-full"
              >
                <div className={`${service.color} rounded-xl w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{service.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <span className="text-[#ee970d] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver más <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#ee970d]/10 to-green-50 rounded-2xl p-8 md:p-12 border border-[#ee970d]/20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              ¿Quieres que llevemos nuestros programas a tu comunidad?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ya sea un colegio, una empresa, una comunidad de vecinos o un ayuntamiento, 
              tenemos un programa adaptado a tus necesidades.
            </p>
            <Button className="bg-[#ee970d] hover:bg-[#d88a0c] text-white px-8 py-6 text-lg rounded-xl" asChild>
              <Link to="/contacto">
                Solicitar información
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
