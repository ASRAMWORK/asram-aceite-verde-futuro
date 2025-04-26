
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import HowItWorks from "@/components/home/HowItWorks";
import OilDestination from "@/components/home/OilDestination";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already authenticated, redirect to the appropriate dashboard
        const email = user.email || "";
        if (email.includes("admin")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  
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
