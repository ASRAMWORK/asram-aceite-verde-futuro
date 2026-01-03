import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

const ContactCta = () => {
  const benefits = [
    "Instalación gratuita de contenedores",
    "Recogida programada sin coste",
    "Certificado de reciclaje mensual",
    "Formación para la comunidad"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background con imagen */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Naturaleza" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ee970d]/95 to-green-700/90" />
      </div>
      
      {/* Decorations */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50/20 to-transparent" />
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white mb-6">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Contacta con nosotros</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Listo para unirte a la <span className="text-yellow-300">revolución verde</span>?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Más de 300.000 familias ya reciclan su aceite con nosotros. 
              Contáctanos hoy y descubre cómo tu comunidad puede formar parte 
              de este proyecto de economía circular.
            </p>
            
            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button 
                size="lg" 
                className="bg-white text-[#ee970d] hover:bg-gray-100 font-semibold px-8"
                asChild
              >
                <Link to="/contacto">
                  Solicitar información
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
                asChild
              >
                <Link to="/voluntarios">
                  Ser voluntario
                </Link>
              </Button>
            </div>
            
            {/* Información de contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl p-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Teléfono</p>
                  <p className="font-semibold">695 831 784</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl p-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="font-semibold">info@asramadrid.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl p-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Ubicación</p>
                  <p className="font-semibold">Madrid, España</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl p-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Horario</p>
                  <p className="font-semibold">L-V: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Card derecha */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="relative h-64">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Recogida de aceite" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#ee970d] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Servicio gratuito
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Recogida a domicilio
              </h3>
              <p className="text-gray-600 mb-6">
                Ofrecemos un servicio completamente gratuito de recogida de aceite usado 
                para comunidades de vecinos y establecimientos. Nosotros nos encargamos 
                de todo: contenedores, recogida y certificación.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Sin costes de instalación ni mantenimiento</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Calendario de recogida personalizado</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Informe de impacto ambiental mensual</span>
                </div>
              </div>

              <Button className="w-full bg-[#ee970d] hover:bg-[#d88a0c] text-white py-6 text-lg rounded-xl" asChild>
                <Link to="/contacto">
                  Solicitar recogida gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCta;
