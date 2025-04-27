
import React from "react";
import HeroSection from "./components/HeroSection";
import StatsOverview from "./components/StatsOverview";
import ImpactCharts from "./components/ImpactCharts";
import ServiceFeatures from "./components/ServiceFeatures";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const HomeView = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatsOverview />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Impacto Medioambiental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImpactCharts />
          </CardContent>
        </Card>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Calendario de Recogidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecogidaCalendar />
          </CardContent>
        </Card>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ServiceFeatures />
      </motion.div>
    </div>
  );
};

export default HomeView;
