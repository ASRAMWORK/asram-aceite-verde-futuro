
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Recycle, Percent, Droplet } from "lucide-react";
import { motion } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";

const StatsOverview = () => {
  const { profile } = useUserProfile();
  const litrosAportados = profile?.litrosAportados || 0;

  // Calculate impact metrics
  const aguaAhorrada = litrosAportados * 1000; // Each liter of oil saves 1000L of water
  const participacionPorcentaje = 15; // This would ideally come from real data

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="space-y-6">
      <motion.h2 
        className="text-2xl font-semibold text-[#ee970d]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Impacto en Madrid
      </motion.h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10 h-full">
            <CardHeader className="pb-2">
              <Users className="w-10 h-10 text-[#ee970d]" />
              <CardTitle className="text-lg">Población Impactada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#ee970d]">7M</div>
              <p className="text-gray-600">Habitantes en Madrid</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10 h-full">
            <CardHeader className="pb-2">
              <Recycle className="w-10 h-10 text-[#ee970d]" />
              <CardTitle className="text-lg">Aceite Reciclado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#ee970d]">
                {litrosAportados > 0 ? 
                  `${profile?.litrosAportados}L` : 
                  '25,000L'
                }
              </div>
              <p className="text-gray-600">Total de aceite recuperado</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10 h-full">
            <CardHeader className="pb-2">
              <Percent className="w-10 h-10 text-[#ee970d]" />
              <CardTitle className="text-lg">Participación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#ee970d]">{participacionPorcentaje}%</div>
              <p className="text-gray-600">De hogares participando</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10 h-full">
            <CardHeader className="pb-2">
              <Droplet className="w-10 h-10 text-[#ee970d]" />
              <CardTitle className="text-lg">Agua Ahorrada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#ee970d]">
                {litrosAportados > 0 ? 
                  `${aguaAhorrada.toLocaleString()}L` : 
                  '25M L'
                }
              </div>
              <p className="text-gray-600">Contaminación evitada</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StatsOverview;
