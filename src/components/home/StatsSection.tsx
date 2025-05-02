import { motion } from "framer-motion";
import { RecycleIcon, Droplet, MapPin, Users } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      value: "25,000+",
      label: "Litros reciclados",
      description: "Aceite recogido anualmente",
      icon: RecycleIcon,
      color: "text-asram"
    },
    {
      value: "25M",
      label: "Litros de agua",
      description: "Contaminación evitada",
      icon: Droplet,
      color: "text-blue-600"
    },
    {
      value: "120+",
      label: "Puntos verdes",
      description: "En la Comunidad de Madrid",
      icon: MapPin,
      color: "text-green-600"
    },
    {
      value: "5,000+",
      label: "Usuarios activos",
      description: "Colaborando con nosotros",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-asram-50 to-white opacity-70 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Nuestro <span className="text-asram">impacto</span> en cifras
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Cada gota de aceite reciclado marca la diferencia. Estos números 
            representan nuestro compromiso con el medio ambiente y la comunidad.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-lg font-medium text-asram">{stat.label}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
