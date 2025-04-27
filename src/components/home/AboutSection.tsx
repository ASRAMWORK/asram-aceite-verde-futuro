
import { Link } from "react-router-dom";
import { ArrowRight, Info, Circle, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AboutSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.5 }
    })
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-100 to-white" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-asram-50 opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-white" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Sobre <span className="text-asram">ASRAM Madrid</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Transformando el aceite usado en recursos sostenibles y generando 
            un impacto positivo en nuestra comunidad.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            custom={1}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="bg-gradient-to-r from-asram-50 to-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">ASRAM Madrid</h3>
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                <Info className="h-5 w-5 text-asram" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Asociación para el Reciclaje de Aceite en Madrid, dedicada a la 
                gestión sostenible del aceite de cocina usado.
              </p>
              <Link to="/about" className="flex items-center text-asram font-medium hover:underline group">
                Conocer más <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            custom={2}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="bg-gradient-to-r from-asram-50 to-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Misión y Visión</h3>
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                <Book className="h-5 w-5 text-asram" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Trabajamos para crear un sistema circular sostenible y 
                concienciar sobre el reciclaje de aceite de cocina.
              </p>
              <Link to="/mision" className="flex items-center text-asram font-medium hover:underline group">
                Descubrir <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            custom={3}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="bg-gradient-to-r from-asram-50 to-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Modelo Circular</h3>
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                <Circle className="h-5 w-5 text-asram" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Convertimos un residuo doméstico en un recurso valioso, generando 
                beneficios ambientales, sociales y económicos.
              </p>
              <Link to="/modelo" className="flex items-center text-asram font-medium hover:underline group">
                Ver proceso <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button className="bg-asram hover:bg-asram-700" asChild>
            <Link to="/about">
              Más sobre nosotros
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
