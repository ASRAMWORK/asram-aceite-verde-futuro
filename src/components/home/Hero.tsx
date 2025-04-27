
import { Button } from "@/components/ui/button";
import { ArrowRight, RecycleIcon, Droplet, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-asram-50 to-white opacity-70 z-0" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-asram-100 filter blur-3xl opacity-70" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-asram-200 filter blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Reciclaje de Aceite</span>
              <span className="block text-asram">para un Madrid Sostenible</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Transformamos el aceite usado de cocina en recursos sostenibles, 
              impulsando la economía circular y protegiendo el medio ambiente.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-asram hover:bg-asram-700 group" asChild>
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
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-asram-400/20 to-asram-600/20 z-0" />
              <img 
                src="https://images.unsplash.com/photo-1613585535485-26083eea6e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Reciclaje de aceite" 
                className="w-full h-full object-cover rounded-2xl opacity-90"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
                <h3 className="text-xl font-bold">Impacto positivo</h3>
                <p>Cada gota de aceite reciclado cuenta para nuestro planeta</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-2 text-asram font-semibold">
                <RecycleIcon className="h-5 w-5" />
                <span>+2500 L reciclados este mes</span>
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
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4">
            <div className="bg-asram/10 p-3 rounded-lg">
              <RecycleIcon className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Servicio gratuito</h3>
              <p className="text-sm text-gray-500">Recogida sin coste para hogares y empresas</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4">
            <div className="bg-asram/10 p-3 rounded-lg">
              <Droplet className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Alto impacto</h3>
              <p className="text-sm text-gray-500">1L de aceite evita contaminar 1000L de agua</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4">
            <div className="bg-asram/10 p-3 rounded-lg">
              <Award className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Economía circular</h3>
              <p className="text-sm text-gray-500">Convertimos residuos en recursos sostenibles</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
