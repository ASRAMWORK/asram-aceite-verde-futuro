
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div>
          <h3 className="font-medium text-gray-500 mb-2">Sobre Nosotros</h3>
          <nav className="space-y-2">
            <Link 
              to="/about"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              ASRAM Madrid
            </Link>
            <Link 
              to="/mision"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Misión y Visión
            </Link>
            <Link 
              to="/modelo"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Modelo Circular
            </Link>
            <Link 
              to="/ruta-dorada"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Ruta Dorada
            </Link>
          </nav>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-500 mb-2">Programas</h3>
          <nav className="space-y-2">
            <Link 
              to="/alianza-verde"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Alianza Verde Escolar
            </Link>
            <Link 
              to="/asram-kids"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              ASRAM Kids
            </Link>
            <Link 
              to="/puntos-verdes"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Puntos Verdes
            </Link>
            <Link 
              to="/asram-rural"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
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
              onClick={onClose}
            >
              Apadrina una Calle
            </Link>
            <Link 
              to="/detergente"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Detergente Solidario
            </Link>
            <Link 
              to="/voluntarios"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Sé Voluntario
            </Link>
            <Link 
              to="/contacto"
              className="block px-2 py-1 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Contacto
            </Link>
          </nav>
        </div>
        
        <div>
          <Link 
            to="/tienda"
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Tienda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
