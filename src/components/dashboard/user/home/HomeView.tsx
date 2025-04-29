
import React from "react";
import HeroSection from "./components/HeroSection";
import StatsOverview from "./components/StatsOverview";
import ImpactCharts from "./components/ImpactCharts";
import ServiceFeatures from "./components/ServiceFeatures";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";

const HomeView = () => {
  return (
    <div className="space-y-12">
      <HeroSection />
      <StatsOverview />
      <ImpactCharts />
      <section>
        <h2 className="text-2xl font-bold mb-6">Calendario de Recogidas</h2>
        <RecogidaCalendar />
      </section>
      <ServiceFeatures />
    </div>
  );
};

export default HomeView;
