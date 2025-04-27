
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ImpactSection = () => {
  const data = [
    { name: "Centro", value: 2500 },
    { name: "Salamanca", value: 1800 },
    { name: "Chamberí", value: 2200 },
    { name: "Retiro", value: 1900 },
    { name: "Chamartín", value: 2100 },
    { name: "Tetuán", value: 1750 },
    { name: "Arganzuela", value: 1600 },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-white" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Impacto por <span className="text-asram">distritos</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Nuestra labor de reciclaje tiene un efecto tangible en toda la ciudad. 
              Observa cómo cada distrito contribuye a un Madrid más sostenible 
              con sus donaciones de aceite usado.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Distrito destacado</h3>
                  <p className="text-asram font-medium">Centro</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Aceite reciclado</p>
                  <p className="text-2xl font-bold text-gray-800">2,500L</p>
                </div>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-asram rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                75% del objetivo mensual alcanzado
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Litros recogidos por distrito</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ border: '1px solid #eee', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value} litros`, 'Cantidad']}
                  />
                  <Bar dataKey="value" fill="#ee970d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
