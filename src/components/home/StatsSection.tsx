import { motion } from "framer-motion";
import { RecycleIcon, Droplet, MapPin, Users, Leaf, Building2, GraduationCap, Heart } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      value: "50,000+",
      label: "Litros reciclados",
      description: "Aceite recogido anualmente",
      icon: RecycleIcon,
      color: "text-[#ee970d]",
      bgColor: "bg-orange-50"
    },
    {
      value: "125M",
      label: "Litros de agua",
      description: "Protegidos de contaminación",
      icon: Droplet,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      value: "1,500+",
      label: "Puntos de recogida",
      description: "En toda la Comunidad de Madrid",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      value: "300,000+",
      label: "Familias colaboradoras",
      description: "Comprometidas con el reciclaje",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      value: "21",
      label: "Distritos cubiertos",
      description: "Servicio en todo Madrid",
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      value: "150+",
      label: "Centros educativos",
      description: "En el programa Alianza Verde",
      icon: GraduationCap,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      value: "500+",
      label: "Voluntarios activos",
      description: "Colaborando cada mes",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      value: "2,500 Tn",
      label: "CO₂ evitado",
      description: "Reducción de emisiones anual",
      icon: Leaf,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background con imagen */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Naturaleza" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-[#ee970d]/10" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee970d]/10 rounded-full text-[#ee970d] mb-4">
            <RecycleIcon className="h-5 w-5" />
            <span className="font-medium">Impacto real y medible</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
            Nuestro <span className="text-[#ee970d]">impacto</span> en cifras
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
            Cada litro de aceite que recogemos evita contaminar 1.000 litros de agua. 
            Estos números representan el compromiso de miles de madrileños con el medio ambiente.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * index }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`${stat.bgColor} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-base font-semibold text-[#ee970d]">{stat.label}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#ee970d]/10 via-green-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-[#ee970d]/20">
            <p className="text-xl md:text-2xl font-medium text-gray-800 mb-2">
              "Cada gota cuenta. Cada acción suma."
            </p>
            <p className="text-gray-600">
              Únete a los miles de madrileños que ya están haciendo la diferencia
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
