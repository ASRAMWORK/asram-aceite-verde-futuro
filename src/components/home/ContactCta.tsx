
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactCta = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-asram-600 to-asram-800 opacity-90" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-asram-500 opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-asram-800 opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para unirte a la revolución del reciclaje?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Contáctanos hoy y descubre cómo puedes formar parte de 
              nuestro proyecto de economía circular. Cada gota cuenta.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-white text-asram hover:bg-gray-100"
                asChild
              >
                <Link to="/contacto">
                  Solicitar información
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contacto">
                  Contactar ahora
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/10 p-2 rounded-full">
                  <Phone className="h-5 w-5" />
                </div>
                <span>695831784</span>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/10 p-2 rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <span>info@asramadrid.com</span>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Madrid, España</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <img 
              src= "https://s11.aconvert.com/convert/p3r68-cdx67/7sd6k-tjg3c.webp" 
              alt="Reciclaje de aceite" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Recogida a domicilio
              </h3>
              <p className="text-gray-600 mb-4">
                Ofrecemos un servicio gratuito de recogida de aceite usado. 
                Ponte en contacto con nosotros y te indicaremos cuándo pasaremos 
                por tu domicilio.
              </p>
              <Button className="w-full bg-asram hover:bg-asram-700" asChild>
                <Link to="/contacto">
                  Solicitar recogida
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
