
import { Button } from "@/components/ui/button";
import { ArrowRight, RecycleIcon, Droplet, Award, MapPin, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };
  
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background elements with improved gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-asram-50 to-white opacity-80 z-0" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-asram-100 filter blur-3xl opacity-70" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-asram-200 filter blur-3xl opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-100 filter blur-2xl opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-2">
              ASRAM Madrid • Reciclaje de aceite
            </Badge>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gray-800">Asociación para el Reciclaje de Aceite</span>
              <span className="block text-asram mt-2">en Madrid  </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-xl"
            >
              Transformamos el aceite usado de cocina en recursos sostenibles, 
              impulsando la economía circular y protegiendo el medio ambiente.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="pt-4 flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <Button size="lg" className="bg-asram hover:bg-asram-700 group shadow-lg" asChild>
                <Link to="/contacto">
                  Solicitar Recogida 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-asram text-asram hover:bg-asram-50" asChild>
                <Link to="/about">
                  Conocer más
                </Link>
              </Button>
            </motion.div>
            
            {/* Badges with key metrics */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.div 
                variants={scaleIn}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2"
              >
                <div className="bg-green-100 p-1 rounded-full">
                  <Droplet className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">1L puede contaminar más de 1000L de agua</span>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2"
              >
                <div className="bg-blue-100 p-1 rounded-full">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Presencia en 21 distritos de Madrid</span>
              </motion.div>
            </motion.div>
            
            {/* New impact stats */}
            <motion.div 
              variants={fadeInUp} 
              transition={{ delay: 0.6 }}
              className="pt-6 grid grid-cols-3 gap-4"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-asram">+1000</div>
                  <div className="text-xs text-center text-gray-1000">Puntos verdes</div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-asram">+10K</div>
                  <div className="text-xs text-center text-gray-500">Litros reciclados</div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-asram">-150T</div>
                  <div className="text-xs text-center text-gray-500">CO₂ no emitido</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-8">
              <img 
                src="/lovable-uploads/6ed9ed5f-1664-4fea-8130-f44cdedf4985.png"
                alt="ASRAM Logo" 
                className="w-full h-auto max-w-[400px] mx-auto"
              />
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40"></div>
              
              {/* Outline callouts */}
              <div className="absolute top-1/4 right-0 flex items-center">
                <div className="bg-white px-3 py-1 rounded-full shadow-md text-sm text-asram font-medium border-2 border-asram">
                  <CheckCircle className="inline-block h-3 w-3 mr-1" /> Ecológico
                </div>
                <div className="w-8 border-t-2 border-asram"></div>
              </div>
              
              <div className="absolute bottom-1/4 left-0 flex items-center">
                <div className="w-8 border-t-2 border-asram"></div>
                <div className="bg-white px-3 py-1 rounded-full shadow-md text-sm text-asram font-medium border-2 border-asram">
                  <CheckCircle className="inline-block h-3 w-3 mr-1" /> Sostenible
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-2 text-asram font-semibold">
                <RecycleIcon className="h-5 w-5" />
                <span>+2500 L reciclados este mes</span>
              </div>
            </div>
            
            {/* Award highlight */}
            <div className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 rotate-[-5deg]">
              <div className="flex items-center space-x-2 text-amber-600 font-semibold">
                <Star className="h-5 w-5 text-amber-500" />
                <span>Premio Innovación 2025</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20"
        >
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
            <div className="bg-asram/10 p-3 rounded-lg">
              <RecycleIcon className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Servicio gratuito</h3>
              <p className="text-sm text-gray-500">Recogida sin coste para hogares y empresas</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
            <div className="bg-asram/10 p-3 rounded-lg">
              <Droplet className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Alto impacto</h3>
              <p className="text-sm text-gray-500">1L puede contaminar mas 1000L de agua</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
            <div className="bg-asram/10 p-3 rounded-lg">
              <Award className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Economía circular</h3>
              <p className="text-sm text-gray-500">Convertimos residuos en recursos sostenibles</p>
            </div>
          </div>
        </motion.div>
        
        {/* New call to action section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-asram-50 to-green-50 p-8 rounded-2xl shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¿Tienes aceite usado? Recogemos gratis</h3>
              <p className="text-gray-600">Solicita recogida para tu hogar, comunidad, restaurante o empresa</p>
            </div>
            <Button className="bg-asram hover:bg-asram-700" size="lg" asChild>
              <Link to="/contacto">
                Contactar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
