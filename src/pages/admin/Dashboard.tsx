
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import PuntosVerdes from "@/components/dashboard/admin/PuntosVerdes";
import AlianzaEscolar from "@/components/dashboard/admin/AlianzaEscolar";
import CallesApadrinadas from "@/components/dashboard/admin/CallesApadrinadas";
import GestionClientes from "@/components/dashboard/admin/GestionClientes";
import GestionRecogidas from "@/components/dashboard/admin/GestionRecogidas";
import RutasDistritos from "@/components/dashboard/admin/RutasDistritos";
import VoluntariosView from "@/components/dashboard/admin/voluntarios/VoluntariosView";
import SimuladorImpacto from "@/components/dashboard/admin/simulador/SimuladorImpacto";
import FacturacionView from "@/components/dashboard/admin/facturacion/FacturacionView";
import TrabajadoresView from "@/components/dashboard/admin/trabajadores/TrabajadoresView";
import InstalacionesView from "@/components/dashboard/admin/instalaciones/InstalacionesView";
import GestionRetiradas from "@/pages/admin/GestionRetiradas";
import TiendaAdmin from "@/components/dashboard/admin/tienda/TiendaAdmin";
import MiSitioWeb from "@/components/dashboard/admin/sitio-web/MiSitioWeb";
import ComercialView from "@/components/dashboard/admin/comercial/ComercialView";
import { toast } from "sonner";
import { isAdminEmail, ADMIN_EMAILS } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  Activity, 
  Users, 
  Truck, 
  MapPin, 
  Building, 
  GraduationCap, 
  User,
  Calculator, 
  Receipt,
  Briefcase,
  Container,
  ShoppingCart,
  Globe,
  Box,
  CalendarDays,
  Trophy
} from "lucide-react";

import InventarioView from "@/components/dashboard/admin/inventario/InventarioView";
import ReunionesView from "@/components/dashboard/admin/reuniones/ReunionesView";
import ClienteRankingWrapper from "@/components/dashboard/admin/rankings/ClienteRankingWrapper";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("panel-control");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const createAdminIfNeeded = async () => {
      try {
        await createUserWithEmailAndPassword(auth, "colabora@asramadrid.com", "Hola3030");
        console.log("Admin user created");
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log("Admin user already exists");
        } else {
          console.error("Error creating admin user:", error);
        }
      }
    };
    
    createAdminIfNeeded();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      if (!isAdminEmail(user.email)) {
        toast.error("No tienes permisos para acceder al panel de administración");
        navigate("/user/dashboard");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dash-gradient flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "panel-control":
        return <AdminDashboard />;
      case "gestion-clientes":
        return <GestionClientes />;
      case "gestion-recogidas":
        return <GestionRecogidas />;
      case "gestion-retiradas":
        return <GestionRetiradas />;
      case "rutas-distritos":
        return <RutasDistritos />;
      case "trabajadores":
        return <TrabajadoresView />;
      case "voluntarios":
        return <VoluntariosView />;
      case "simulador":
        return <SimuladorImpacto />;
      case "facturacion":
        return <FacturacionView />;
      case "instalaciones":
        return <InstalacionesView />;
      case "alianza-escolar":
        return <AlianzaEscolar />;  
      case "calles-apadrinadas":
        return <CallesApadrinadas />;
      case "puntos-verdes":
        return <PuntosVerdes />;
      case "tienda":
        return <TiendaAdmin />;
      case "mi-sitio-web":
        return <MiSitioWeb />;
      case "comerciales":
        return <ComercialView />;
      case "inventario":
        return <InventarioView />;
      case "reuniones":
        return <ReunionesView />;
      case "ranking":
        return <ClienteRankingWrapper adminId={auth.currentUser?.uid} />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-asram">ASRAM Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          <Button
            variant={activeTab === "panel-control" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "panel-control" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("panel-control")}
          >
            <Activity className="mr-2 h-4 w-4" />
            Panel de Control
          </Button>
          
          <Button
            variant={activeTab === "gestion-clientes" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "gestion-clientes" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("gestion-clientes")}
          >
            <Users className="mr-2 h-4 w-4" />
            Gestión de Clientes
          </Button>
          
          <Button
            variant={activeTab === "ranking" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "ranking" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("ranking")}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Ranking Clientes
          </Button>
          
          <Button
            variant={activeTab === "gestion-recogidas" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "gestion-recogidas" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("gestion-recogidas")}
          >
            <Truck className="mr-2 h-4 w-4" />
            Gestión de Recogidas
          </Button>
          
          <Button
            variant={activeTab === "gestion-retiradas" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "gestion-retiradas" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("gestion-retiradas")}
          >
            <Container className="mr-2 h-4 w-4" />
            Retiradas de Contenedores
          </Button>
          
          <Button
            variant={activeTab === "rutas-distritos" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "rutas-distritos" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("rutas-distritos")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Rutas por Distritos
          </Button>
          
          <Button
            variant={activeTab === "instalaciones" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "instalaciones" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("instalaciones")}
          >
            <Building className="mr-2 h-4 w-4" />
            Instalaciones
          </Button>
          
          <Button
            variant={activeTab === "trabajadores" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "trabajadores" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("trabajadores")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Trabajadores
          </Button>
          
          <Button
            variant={activeTab === "voluntarios" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "voluntarios" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("voluntarios")}
          >
            <User className="mr-2 h-4 w-4" />
            Gestión Voluntarios
          </Button>
          
          <Button
            variant={activeTab === "simulador" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "simulador" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("simulador")}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Simulador Impacto
          </Button>
          
          <Button
            variant={activeTab === "facturacion" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "facturacion" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("facturacion")}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Facturación
          </Button>
          
          <Separator className="my-4" />
          
          <Button
            variant={activeTab === "alianza-escolar" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "alianza-escolar" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("alianza-escolar")}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Alianza Escolar
          </Button>
          
          <Button
            variant={activeTab === "calles-apadrinadas" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "calles-apadrinadas" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("calles-apadrinadas")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Calles Apadrinadas
          </Button>
          
          <Button
            variant={activeTab === "puntos-verdes" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "puntos-verdes" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("puntos-verdes")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Puntos Verdes
          </Button>
          
          <Button
            variant={activeTab === "tienda" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "tienda" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("tienda")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Tienda
          </Button>
          
          <Button
            variant={activeTab === "mi-sitio-web" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "mi-sitio-web" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("mi-sitio-web")}
          >
            <Globe className="mr-2 h-4 w-4" />
            Mi Sitio Web
          </Button>
          
          <Separator className="my-4" />
          
          <Button
            variant={activeTab === "comerciales" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "comerciales" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("comerciales")}
          >
            <User className="mr-2 h-4 w-4" />
            Comerciales
          </Button>
          
          <Button
            variant={activeTab === "inventario" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "inventario" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("inventario")}
          >
            <Box className="mr-2 h-4 w-4" />
            Control de Inventario
          </Button>
          
          <Button
            variant={activeTab === "reuniones" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "reuniones" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("reuniones")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Reuniones y Eventos
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            Cerrar sesión
          </Button>
        </nav>
      </div>
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container flex items-center justify-between h-16 px-4">
            <h2 className="text-lg font-medium md:hidden">ASRAM Admin</h2>
            
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                admin@asramadrid.com
              </span>
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={handleSignOut}
              >
                Salir
              </Button>
            </div>
          </div>
        </header>
        
        <main className="container py-8 px-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
