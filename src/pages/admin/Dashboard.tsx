import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
  User,  // Replaced UserHard with User
  Calculator, 
  Receipt,
  UserRound  // Added another user icon option
} from "lucide-react";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("panel-control");
  const [activeSubTab, setActiveSubTab] = useState("vista-general");
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-asram">ASRAM Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1">
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
            variant={activeTab === "trabajadores" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "trabajadores" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("trabajadores")}
          >
            <User className="mr-2 h-4 w-4" />
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
          {activeTab === "panel-control" && (
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
              </div>
              
              <TabsList>
                <TabsTrigger value="vista-general">Vista General</TabsTrigger>
                <TabsTrigger value="puntos-verdes">Puntos Verdes</TabsTrigger>
                <TabsTrigger value="alianza-escolar">Alianza Escolar</TabsTrigger>
                <TabsTrigger value="calles-apadrinadas">Calles Apadrinadas</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vista-general">
                <AdminDashboard />
              </TabsContent>
              
              <TabsContent value="puntos-verdes">
                <PuntosVerdes />
              </TabsContent>
              
              <TabsContent value="alianza-escolar">
                <AlianzaEscolar />
              </TabsContent>
              
              <TabsContent value="calles-apadrinadas">
                <CallesApadrinadas />
              </TabsContent>
              
              <TabsContent value="estadisticas">
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Estadísticas y reportes</h3>
                  <p className="text-muted-foreground">
                    Esta sección está actualmente en desarrollo. Próximamente podrás visualizar estadísticas
                    detalladas y generar reportes avanzados para monitorizar el rendimiento de la organización.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {activeTab === "gestion-clientes" && <GestionClientes />}
          
          {activeTab === "gestion-recogidas" && <GestionRecogidas />}
          
          {activeTab === "rutas-distritos" && <RutasDistritos />}
          
          {activeTab === "trabajadores" && <TrabajadoresView />}
          
          {activeTab === "voluntarios" && <VoluntariosView />}
          
          {activeTab === "simulador" && <SimuladorImpacto />}
          
          {activeTab === "facturacion" && <FacturacionView />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
