
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import HowItWorks from "@/components/home/HowItWorks";
import OilDestination from "@/components/home/OilDestination";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16">
        <Hero />
        <Benefits />
        <HowItWorks />
        <OilDestination />
      </main>
    </div>
  );
};

export default Index;
