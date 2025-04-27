import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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

  const ListItem = ({ className, title, children, ...props }: any) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  };
  
  const NavigationItems = () => {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Sobre Nosotros</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-asram/50 to-asram p-6 no-underline outline-none focus:shadow-md"
                      to="/about"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium text-white">
                        ASRAM Madrid
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Asociación para el Reciclaje de Aceite en Madrid
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/mision" title="Misión y Visión">
                  Conoce nuestros objetivos y valores
                </ListItem>
                <ListItem href="/modelo" title="Modelo Circular">
                  Descubre cómo funciona nuestra economía circular
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
  
          <NavigationMenuItem>
            <NavigationMenuTrigger>Programas</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                <ListItem href="/alianza-verde" title="Alianza Verde Escolar">
                  Educación ambiental en centros educativos
                </ListItem>
                <ListItem href="/asram-kids" title="ASRAM Kids">
                  Actividades para los más pequeños
                </ListItem>
                <ListItem href="/puntos-verdes" title="Puntos Verdes">
                  Red de contenedores de reciclaje
                </ListItem>
                <ListItem href="/asram-rural" title="ASRAM Rural">
                  Llevamos el reciclaje a zonas rurales
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
  
          <NavigationMenuItem>
            <NavigationMenuTrigger>Colabora</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                <ListItem href="/apadrina" title="Apadrina una Calle">
                  Ayuda a expandir nuestra red de reciclaje
                </ListItem>
                <ListItem href="/detergente" title="Detergente Solidario">
                  Proyecto de emergencia social
                </ListItem>
                <ListItem href="/contacto" title="Contacto">
                  Únete a nosotros
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link 
                to="/tienda" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                <span>Puntos Limpios</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link 
                to="/tienda" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                {/*<ShoppingCart className="w-4 h-4" />*/}
                <span>Tienda</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold text-asram">ASRAM</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-1">
            <NavigationItems />
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
