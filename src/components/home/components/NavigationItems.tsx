
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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
              <ListItem href="/ruta-dorada" title="Ruta Dorada">
                Evento para comercios locales sostenibles
              </ListItem>
              <ListItem href="/voluntarios" title="Sé Voluntario">
                Únete a nuestro equipo de voluntarios
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
  );
};

export default NavigationItems;
