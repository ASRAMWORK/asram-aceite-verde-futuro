
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="text-center space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
      <h1 className="text-4xl font-bold text-asram">ASRAM</h1>
      <p className="text-xl text-gray-600">
        Juntos por un futuro más sostenible
      </p>
    </section>
  );
};

export default HeroSection;
