
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  Truck, 
  MapPin, 
  Building, 
  ShoppingCart,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab = 'rutas' }) => {
  return (
    <div className="w-64 bg-white border-r h-full">
      <div className="p-4 border-b">
        <h2 className="font-bold text-xl">ASRAM Admin</h2>
      </div>
      
      <div className="p-4 space-y-2">
        <Link to="/admin/dashboard?tab=rutas">
          <Button 
            variant={activeTab === 'rutas' ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Rutas y Distritos
          </Button>
        </Link>
        
        <Link to="/admin/dashboard?tab=mapa">
          <Button 
            variant={activeTab === 'mapa' ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Mapa de Localizaciones
          </Button>
        </Link>
        
        <Link to="/admin/dashboard?tab=recogidas">
          <Button 
            variant={activeTab === 'recogidas' ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Truck className="mr-2 h-4 w-4" />
            Gestión de Recogidas
          </Button>
        </Link>
        
        <Link to="/admin/dashboard?tab=tienda">
          <Button 
            variant={activeTab === 'tienda' ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Tienda
          </Button>
        </Link>
        
        <Link to="/admin/dashboard?tab=comerciales">
          <Button 
            variant={activeTab === 'comerciales' ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <User className="mr-2 h-4 w-4" />
            Comerciales
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
