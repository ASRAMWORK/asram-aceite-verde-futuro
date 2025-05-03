import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  Trophy,
  UserCog,
  CalendarIcon
} from "lucide-react";

import InventarioView from "@/components/dashboard/admin/inventario/InventarioView";
import ReunionesView from "@/components/dashboard/admin/reuniones/ReunionesView";
import AdministradoresManagement from "@/components/dashboard/admin/administradores/AdministradoresManagement";
import ComunidadesViviendas from "@/components/dashboard/admin/administradores/ComunidadesViviendas";
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileStyles } from '@/utils/mobileStyles';

const AdminDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "panel-control");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { touchTarget, padding, fullGrid, compactGrid } = useMobileStyles();

  // Update state when URL changes
  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    } else if (!newTab && activeTab !== "panel-control") {
      setActiveTab("panel-control");
    }
  }, [searchParams, location.search]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== "panel-control") {
      searchParams.set("tab", activeTab);
      setSearchParams(searchParams);
    } else {
      if (searchParams.has("tab")) {
        searchParams.delete("tab");
        setSearchParams(searchParams);
      }
    }
  }, [activeTab, searchParams, setSearchParams]);

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

  // Función para manejar cambios de tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // On mobile, scroll to top after tab change for better UX
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dash-gradient flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  // Generate mobile navigation items - incluye todas las secciones que están en el sidebar de escritorio
  const generateMobileNavItems = () => {
    return [
      {
        label: "Panel de Control",
        href: "/admin/dashboard",
        icon: <Activity className="h-5 w-5" />,
        onClick: () => handleTabChange("panel-control"),
        active: activeTab === "panel-control"
      },
      {
        label: "Gestión de Clientes",
        href: "/admin/dashboard?tab=gestion-clientes",
        icon: <Users className="h-5 w-5" />,
        onClick: () => handleTabChange("gestion-clientes"),
        active: activeTab === "gestion-clientes"
      },
      {
        label: "Gestión de Recogidas",
        href: "/admin/dashboard?tab=gestion-recogidas",
        icon: <Truck className="h-5 w-5" />,
        onClick: () => handleTabChange("gestion-recogidas"),
        active: activeTab === "gestion-recogidas"
      },
      {
        label: "Retiradas de Contenedores",
        href: "/admin/dashboard?tab=gestion-retiradas",
        icon: <Container className="h-5 w-5" />,
        onClick: () => handleTabChange("gestion-retiradas"),
        active: activeTab === "gestion-retiradas"
      },
      {
        label: "Rutas por Distritos",
        href: "/admin/dashboard?tab=rutas-distritos",
        icon: <MapPin className="h-5 w-5" />,
        onClick: () => handleTabChange("rutas-distritos"),
        active: activeTab === "rutas-distritos"
      },
      {
        label: "Instalaciones",
        href: "/admin/dashboard?tab=instalaciones",
        icon: <Building className="h-5 w-5" />,
        onClick: () => handleTabChange("instalaciones"),
        active: activeTab === "instalaciones"
      },
      {
        label: "Trabajadores",
        href: "/admin/dashboard?tab=trabajadores",
        icon: <Briefcase className="h-5 w-5" />,
        onClick: () => handleTabChange("trabajadores"),
        active: activeTab === "trabajadores"
      },
      {
        label: "Gestión Voluntarios",
        href: "/admin/dashboard?tab=voluntarios",
        icon: <User className="h-5 w-5" />,
        onClick: () => handleTabChange("voluntarios"),
        active: activeTab === "voluntarios"
      },
      {
        label: "Simulador Impacto",
        href: "/admin/dashboard?tab=simulador",
        icon: <Calculator className="h-5 w-5" />,
        onClick: () => handleTabChange("simulador"),
        active: activeTab === "simulador"
      },
      {
        label: "Facturación",
        href: "/admin/dashboard?tab=facturacion",
        icon: <Receipt className="h-5 w-5" />,
        onClick: () => handleTabChange("facturacion"),
        active: activeTab === "facturacion"
      },
      {
        label: "Alianza Escolar",
        href: "/admin/dashboard?tab=alianza-escolar",
        icon: <GraduationCap className="h-5 w-5" />,
        onClick: () => handleTabChange("alianza-escolar"),
        active: activeTab === "alianza-escolar"
      },
      {
        label: "Calles Apadrinadas",
        href: "/admin/dashboard?tab=calles-apadrinadas",
        icon: <MapPin className="h-5 w-5" />,
        onClick: () => handleTabChange("calles-apadrinadas"),
        active: activeTab === "calles-apadrinadas"
      },
      {
        label: "Puntos Verdes",
        href: "/admin/dashboard?tab=puntos-verdes",
        icon: <MapPin className="h-5 w-5" />,
        onClick: () => handleTabChange("puntos-verdes"),
        active: activeTab === "puntos-verdes"
      },
      {
        label: "Tienda",
        href: "/admin/dashboard?tab=tienda",
        icon: <ShoppingCart className="h-5 w-5" />,
        onClick: () => handleTabChange("tienda"),
        active: activeTab === "tienda"
      },
      {
        label: "Mi Sitio Web",
        href: "/admin/dashboard?tab=mi-sitio-web",
        icon: <Globe className="h-5 w-5" />,
        onClick: () => handleTabChange("mi-sitio-web"),
        active: activeTab === "mi-sitio-web"
      },
      {
        label: "Gestión Administradores",
        href: "/admin/dashboard?tab=administradores-management",
        icon: <UserCog className="h-5 w-5" />,
        onClick: () => handleTabChange("administradores-management"),
        active: activeTab === "administradores-management"
      },
      {
        label: "Comunidades y Viviendas",
        href: "/admin/dashboard?tab=comunidades-viviendas",
        icon: <Building className="h-5 w-5" />,
        onClick: () => handleTabChange("comunidades-viviendas"),
        active: activeTab === "comunidades-viviendas"
      },
      {
        label: "Comerciales",
        href: "/admin/dashboard?tab=comerciales",
        icon: <User className="h-5 w-5" />,
        onClick: () => handleTabChange("comerciales"),
        active: activeTab === "comerciales"
      },
      {
        label: "Control de Inventario",
        href: "/admin/dashboard?tab=inventario",
        icon: <Box className="h-5 w-5" />,
        onClick: () => handleTabChange("inventario"),
        active: activeTab === "inventario"
      },
      {
        label: "Reuniones y Eventos",
        href: "/admin/dashboard?tab=reuniones",
        icon: <CalendarDays className="h-5 w-5" />,
        onClick: () => handleTabChange("reuniones"),
        active: activeTab === "reuniones"
      },
      {
        label: "Cerrar sesión",
        href: "/login",
        onClick: handleSignOut,
        icon: <User className="h-5 w-5 text-red-500" />,
      }
    ];
  };

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
      case "administradores-management":
        return <AdministradoresManagement />;
      case "comunidades-viviendas":
        return <ComunidadesViviendas />;
      case "settings":
        return <AdminDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Desktop sidebar */}
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
            variant={activeTab === "administradores-management" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "administradores-management" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("administradores-management")}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Gestión Administradores
          </Button>
          
          <Button
            variant={activeTab === "comunidades-viviendas" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "comunidades-viviendas" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("comunidades-viviendas")}
          >
            <Building className="mr-2 h-4 w-4" />
            Comunidades y Viviendas
          </Button>
          
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
      
      <div className="flex-1 overflow-hidden w-full">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container flex items-center justify-between h-16 px-4 md:px-6">
            {isMobile && (
              <MobileNavigation 
                items={generateMobileNavItems()} 
                title="ASRAM Admin" 
                logoComponent={
                  <div className="rounded-full bg-[#ee970d] w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                }
              />
            )}
            
            <h2 className="text-lg font-medium md:hidden truncate max-w-[200px]">
              {activeTab === "panel-control" ? "Panel Principal" : 
               activeTab === "gestion-clientes" ? "Gestión Clientes" :
               activeTab === "gestion-recogidas" ? "Recogidas" :
               activeTab === "facturacion" ? "Facturación" :
               activeTab === "trabajadores" ? "Trabajadores" :
               activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                admin@asramadrid.com
              </span>
              <Button
                variant="ghost"
                className={`md:hidden ${touchTarget}`}
                onClick={handleSignOut}
              >
                Salir
              </Button>
            </div>
          </div>
        </header>
        
        <main className={`container py-4 px-3 md:py-6 md:px-6 mb-0 ${isMobile ? 'overflow-x-hidden w-full' : ''}`}>
          <div className={fullGrid}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
