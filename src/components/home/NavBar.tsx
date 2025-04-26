
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, X } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-asram">ASRAM</Link>
          
          <div className="hidden md:block">
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
                      <ShoppingCart className="w-4 h-4" />
                      <span>Tienda</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Sobre Nosotros</h3>
              <nav className="space-y-2">
                <Link 
                  to="/about"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ASRAM Madrid
                </Link>
                <Link 
                  to="/mision"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Misión y Visión
                </Link>
                <Link 
                  to="/modelo"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Modelo Circular
                </Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Programas</h3>
              <nav className="space-y-2">
                <Link 
                  to="/alianza-verde"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Alianza Verde Escolar
                </Link>
                <Link 
                  to="/asram-kids"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ASRAM Kids
                </Link>
                <Link 
                  to="/puntos-verdes"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Puntos Verdes
                </Link>
                <Link 
                  to="/asram-rural"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ASRAM Rural
                </Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Colabora</h3>
              <nav className="space-y-2">
                <Link 
                  to="/apadrina"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Apadrina una Calle
                </Link>
                <Link 
                  to="/detergente"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Detergente Solidario
                </Link>
                <Link 
                  to="/contacto"
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
              </nav>
            </div>
            
            <div>
              <Link 
                to="/tienda"
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Tienda</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

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

export default NavBar;
