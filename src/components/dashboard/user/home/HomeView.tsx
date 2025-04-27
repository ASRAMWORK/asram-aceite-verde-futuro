
import React from "react";
import HeroSection from "./components/HeroSection";
import StatsOverview from "./components/StatsOverview";
import ImpactCharts from "./components/ImpactCharts";
import ServiceFeatures from "./components/ServiceFeatures";

const HomeView = () => {
  return (
    <div className="space-y-12">
      <HeroSection />
      <StatsOverview />
      <ImpactCharts />
      <ServiceFeatures />
    </div>
  );
};

export default HomeView;
