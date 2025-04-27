
import { motion } from "framer-motion";
import { Calendar, BarChart3 } from "lucide-react";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";

const CalendarSection = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-gray-50" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-gray-50" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-asram-50 rounded-full text-asram mb-4">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Planifica tu reciclaje</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Calendario de Recogidas
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Consulta los días de recogida en tu distrito y barrio.
            Organizamos nuestras rutas para ofrecerte un servicio eficiente y regular.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <RecogidaCalendar />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-asram-50 rounded-xl p-6 border border-asram-100"
        >
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-asram" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sabías que...</h3>
              <p className="text-gray-600">
                Los distritos de Centro, Salamanca y Chamberí lideran el ranking de reciclaje 
                en la ciudad. ¡Descubre cómo tu barrio puede mejorar su impacto positivo!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendarSection;
