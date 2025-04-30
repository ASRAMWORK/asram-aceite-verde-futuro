
import React from "react";
import { Droplet, Recycle, Book } from "lucide-react";
import { motion } from "framer-motion";

const Benefits = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Beneficios e impacto ambiental</h2>
          <div className="h-1 w-20 bg-asram mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="benefit-card"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 h-full border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Droplet className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Reducción de la contaminación</h3>
              <p className="text-gray-600 text-center">
                Un solo litro de aceite usado puede llegar a contaminar más de 1.000 L de agua. Tu acción marca la diferencia.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="benefit-card"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 h-full border-t-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Recycle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Economía circular</h3>
              <p className="text-gray-600 text-center">
                Convierte un residuo doméstico en recurso útil, generando empleo verde y apoyando a personas en riesgo de exclusión social.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="benefit-card"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 h-full border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Book className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Concienciación educativa</h3>
              <p className="text-gray-600 text-center">
                A través de talleres y campañas vinculadas a los Puntos Verdes, se fomenta la responsabilidad ambiental en toda la comunidad.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
