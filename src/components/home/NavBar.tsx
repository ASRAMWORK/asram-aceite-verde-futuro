
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold text-asram">ASRAM</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-1">
            {/* About Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-asram hover:bg-gray-100">
                <span>Sobre Nosotros</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/about" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Madrid
                </Link>
                <Link to="/mision" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Misión y Visión
                </Link>
                <Link to="/modelo" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Modelo Circular
                </Link>
              </div>
            </div>
            
            {/* Programs Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-asram hover:bg-gray-100">
                <span>Programas</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/alianza-verde" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Alianza Verde Escolar
                </Link>
                <Link to="/asram-kids" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Kids
                </Link>
                <Link to="/puntos-verdes" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Puntos Verdes
                </Link>
                <Link to="/asram-rural" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Rural
                </Link>
              </div>
            </div>
            
            {/* Collaborate Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-asram hover:bg-gray-100">
                <span>Colabora</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/apadrina" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Apadrina una Calle
                </Link>
                <Link to="/detergente" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Detergente Solidario
                </Link>
                <Link to="/contacto" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Contacto
                </Link>
              </div>
            </div>
            
            <Link to="/tienda" className="px-3 py-2 rounded-md text-gray-700 hover:text-asram hover:bg-gray-100">
              Tienda
            </Link>
          </nav>
          
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" asChild className="border-asram text-asram hover:bg-asram-50">
              <Link to="/login">Acceder</Link>
            </Button>
            <Button className="bg-asram hover:bg-asram-700" asChild>
              <Link to="/contacto">Solicitar Recogida</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden bg-white border-t border-gray-200"
        >
          <div className="container mx-auto py-4 px-4 space-y-4">
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Sobre Nosotros</h3>
              <div className="space-y-2">
                <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Madrid
                </Link>
                <Link to="/mision" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Misión y Visión
                </Link>
                <Link to="/modelo" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Modelo Circular
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Programas</h3>
              <div className="space-y-2">
                <Link to="/alianza-verde" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Alianza Verde Escolar
                </Link>
                <Link to="/asram-kids" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Kids
                </Link>
                <Link to="/puntos-verdes" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Puntos Verdes
                </Link>
                <Link to="/asram-rural" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  ASRAM Rural
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Colabora</h3>
              <div className="space-y-2">
                <Link to="/apadrina" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Apadrina una Calle
                </Link>
                <Link to="/detergente" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Detergente Solidario
                </Link>
                <Link to="/contacto" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Contacto
                </Link>
              </div>
            </div>
            
            <Link to="/tienda" className="block px-3 py-2 rounded-md hover:bg-gray-100">
              Tienda
            </Link>
            
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Acceder</Link>
              </Button>
              <Button className="w-full bg-asram hover:bg-asram-700" asChild>
                <Link to="/contacto">Solicitar Recogida</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default NavBar;
