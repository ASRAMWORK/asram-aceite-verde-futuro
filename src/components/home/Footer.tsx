
import { Link } from "react-router-dom";
import { ExternalLink, Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-asram">ASRAM</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Asociación para el Reciclaje de Aceite en Madrid. Juntos por un futuro más sostenible.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-asram transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-asram transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-asram transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-asram transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Sobre Nosotros</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-asram">
                  ASRAM Madrid
                </Link>
              </li>
              <li>
                <Link to="/mision" className="text-gray-400 hover:text-asram">
                  Misión y Visión
                </Link>
              </li>
              <li>
                <Link to="/modelo" className="text-gray-400 hover:text-asram">
                  Modelo Circular
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Programas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/alianza-verde" className="text-gray-400 hover:text-asram">
                  Alianza Verde Escolar
                </Link>
              </li>
              <li>
                <Link to="/asram-kids" className="text-gray-400 hover:text-asram">
                  ASRAM Kids
                </Link>
              </li>
              <li>
                <Link to="/puntos-verdes" className="text-gray-400 hover:text-asram">
                  Puntos Verdes
                </Link>
              </li>
              <li>
                <Link to="/asram-rural" className="text-gray-400 hover:text-asram">
                  ASRAM Rural
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Colabora</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/apadrina" className="text-gray-400 hover:text-asram">
                  Apadrina una Calle
                </Link>
              </li>
              <li>
                <Link to="/detergente" className="text-gray-400 hover:text-asram">
                  Detergente Solidario
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-asram">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-gray-400 hover:text-asram">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ASRAM Madrid. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link to="/privacidad" className="hover:text-asram">
                Política de privacidad
              </Link>
              <Link to="/terminos" className="hover:text-asram">
                Términos y condiciones
              </Link>
              <Link to="/cookies" className="hover:text-asram">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
