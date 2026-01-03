import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, Target, Leaf } from "lucide-react";

const ImpactSection = () => {
  const barData = [
    { name: "Centro", value: 4500, fill: "#ee970d" },
    { name: "Salamanca", value: 3800, fill: "#f5a623" },
    { name: "Chamberí", value: 4200, fill: "#ee970d" },
    { name: "Retiro", value: 3500, fill: "#f5a623" },
    { name: "Chamartín", value: 3900, fill: "#ee970d" },
    { name: "Tetuán", value: 3200, fill: "#f5a623" },
    { name: "Arganzuela", value: 2900, fill: "#ee970d" },
  ];

  const pieData = [
    { name: "Biodiesel", value: 65, color: "#22c55e" },
    { name: "Detergentes", value: 20, color: "#3b82f6" },
    { name: "Jabones", value: 10, color: "#a855f7" },
    { name: "Otros", value: 5, color: "#f59e0b" },
  ];

  const achievements = [
    { icon: TrendingUp, value: "+35%", label: "Crecimiento anual" },
    { icon: Award, value: "Premio", label: "Madrid Verde 2024" },
    { icon: Target, value: "95%", label: "Tasa de reciclaje" },
    { icon: Leaf, value: "0", label: "Residuos a vertedero" },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-white" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#ee970d]/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 mb-4"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Resultados medibles</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-800"
          >
            Impacto por <span className="text-[#ee970d]">distritos</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg"
          >
            Cada distrito de Madrid contribuye a un futuro más sostenible. 
            Observa cómo tu zona aporta al reciclaje y descubre en qué se transforma el aceite.
          </motion.p>
        </div>

        {/* Logros destacados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex p-3 bg-[#ee970d]/10 rounded-xl mb-3">
                <achievement.icon className="h-6 w-6 text-[#ee970d]" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{achievement.value}</p>
              <p className="text-sm text-gray-600">{achievement.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Gráfico de barras */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Litros recogidos por distrito</h3>
                <p className="text-gray-500 text-sm">Datos del último trimestre</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                +12% vs anterior
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `${value/1000}k`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} litros`, 'Recogidos']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#ee970d" 
                    radius={[0, 8, 8, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Gráfico circular + Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">¿En qué se transforma?</h3>
              <p className="text-gray-500 text-sm mb-4">Destino del aceite reciclado</p>
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card destacada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Producción de biodiesel" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h4 className="font-bold text-lg mb-1">Del residuo al recurso</h4>
                <p className="text-white/80 text-sm">
                  Cada litro de aceite reciclado produce 0.9 litros de biodiesel, 
                  reduciendo hasta un 85% las emisiones de CO₂.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Distrito destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-[#ee970d]/10 via-yellow-50 to-green-50 rounded-2xl p-8 border border-[#ee970d]/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#ee970d] p-4 rounded-2xl">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Distrito del mes</p>
                <h3 className="text-2xl font-bold text-gray-800">Centro</h3>
                <p className="text-gray-600">¡4.500 litros recogidos este trimestre!</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Objetivo mensual</p>
                  <p className="text-xl font-bold text-gray-800">1.500L / 2.000L</p>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      stroke="#ee970d" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-[#ee970d]">75%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;
