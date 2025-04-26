
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
import { Menu } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Acceder</Link>
            </Button>
            <Button asChild>
              <Link to="/contacto">Colabora</Link>
            </Button>
          </div>
        </div>
      </div>
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
