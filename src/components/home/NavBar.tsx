
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import NavigationItems from "./components/NavigationItems";
import MobileMenu from "./components/MobileMenu";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-asram">ASRAM</Link>
          
          <div className="hidden md:block">
            <NavigationItems />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Acceder</Link>
            </Button>
            <Button asChild>
              <Link to="/contacto">Contáctanos</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default NavBar;
