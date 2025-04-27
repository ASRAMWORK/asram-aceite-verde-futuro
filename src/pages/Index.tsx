
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import OilDestination from "@/components/home/OilDestination";
import Hero from "@/components/home/Hero";
import NavBar from "@/components/home/NavBar";
import ProgramHighlights from "@/components/home/ProgramHighlights";
import StatsSection from "@/components/home/StatsSection";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <Hero />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <StatsSection />
          </div>
          
          <div className="space-y-20">
            <HowItWorks />
            <Benefits />
            <OilDestination />
            <section className="py-16">
              <h2 className="text-3xl font-bold text-center mb-12">Calendario de Recogidas</h2>
              <RecogidaCalendar />
            </section>
            <ProgramHighlights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
