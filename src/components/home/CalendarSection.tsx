import { motion } from "framer-motion";
import { Calendar, BarChart3, Bell, MapPin } from "lucide-react";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CalendarSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -top-20 right-0 w-80 h-80 bg-[#ee970d]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-100/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee970d]/10 rounded-full text-[#ee970d] mb-4">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Planifica tu reciclaje</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
            Calendario de <span className="text-[#ee970d]">Recogidas</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
            Cada distrito de Madrid tiene asignado un día de la semana para la recogida de aceite. 
            Selecciona tu ubicación y descubre cuándo pasamos por tu zona.
          </p>
        </motion.div>
        
        {/* Calendario */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RecogidaCalendar />
        </motion.div>
        
        {/* Info cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-[#ee970d]/10 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-[#ee970d]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Recogida puntual</h3>
                <p className="text-gray-600 text-sm">
                  Pasamos por tu zona cada semana en el día asignado a tu distrito. 
                  La puntualidad es nuestra prioridad.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Recordatorios</h3>
                <p className="text-gray-600 text-sm">
                  Regístrate y te avisaremos el día antes de la recogida para que 
                  tengas tu aceite preparado.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">21 distritos</h3>
                <p className="text-gray-600 text-sm">
                  Cubrimos todos los distritos de Madrid capital con un calendario 
                  organizado de lunes a viernes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sabías que... */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-[#ee970d]/10 via-yellow-50 to-green-50 rounded-2xl p-8 border border-[#ee970d]/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <BarChart3 className="h-12 w-12 text-[#ee970d]" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">¿Sabías que...?</h3>
              <p className="text-gray-600 mb-4">
                Los distritos de <strong>Centro, Salamanca y Chamberí</strong> lideran el ranking 
                de reciclaje de la ciudad, superando los 4.000 litros mensuales cada uno. 
                ¡Descubre cómo tu barrio puede mejorar su impacto positivo!
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/puntos-verdes">
                  <Button variant="outline" className="border-[#ee970d] text-[#ee970d] hover:bg-[#ee970d] hover:text-white">
                    Ver puntos de recogida
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button className="bg-[#ee970d] hover:bg-[#d88a0c] text-white">
                    Solicitar servicio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendarSection;
