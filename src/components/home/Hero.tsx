
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-asram-100 to-asram-50 opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-asram-800 to-asram bg-clip-text text-transparent animate-fade-in">
            Reciclaje de Aceite en Madrid
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 animate-fade-in delay-200">
            Transformando residuos en recursos para un futuro más sostenible
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
            <Button size="lg" className="group" asChild>
              <Link to="/contacto">
                Solicitar Recogida
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/alianza-verde">
                Conoce Nuestros Programas
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in delay-400">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-200">
              <h3 className="text-4xl font-bold text-asram mb-2">90%</h3>
              <p className="text-gray-600">del aceite usado no se recicla</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-200">
              <h3 className="text-4xl font-bold text-asram mb-2">1000L</h3>
              <p className="text-gray-600">de agua contaminada por 1L de aceite</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-200">
              <h3 className="text-4xl font-bold text-asram mb-2">100%</h3>
              <p className="text-gray-600">servicio gratuito</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
