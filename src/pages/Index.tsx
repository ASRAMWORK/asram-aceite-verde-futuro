
import { useEffect } from "react";
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import ImpactSection from "@/components/home/ImpactSection";
import CalendarSection from "@/components/home/CalendarSection";
import ContactCta from "@/components/home/ContactCta";
import Footer from "@/components/home/Footer";

const Index = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <Hero />
      <main className="overflow-hidden">
        <StatsSection />
        <AboutSection />
        <ServicesSection />
        <ImpactSection />
        <CalendarSection />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
