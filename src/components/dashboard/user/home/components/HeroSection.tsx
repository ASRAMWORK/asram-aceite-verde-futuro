
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { RecycleIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 bg-gradient-to-r from-[#ee970d]/10 to-orange-100 rounded-xl p-12"
    >
      <div className="flex justify-center">
        <RecycleIcon className="h-16 w-16 text-[#ee970d]" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-[#ee970d] tracking-tight">
        ASRAM
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Juntos por un futuro más sostenible. Tu contribución marca la diferencia.
      </p>
    </motion.section>
  );
};

export default HeroSection;
