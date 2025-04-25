
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
import { toast } from "sonner";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("panel-control");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      // Normally we would check in Firestore if the user has admin role
      // For now, we'll just check the email as per the specification
      if (user.email !== "admin@asramadrid.com") {
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
      {/* Sidebar */}
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
            Panel de Control
          </Button>
          
          <Button
            variant={activeTab === "gestion-clientes" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "gestion-clientes" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("gestion-clientes")}
          >
            Gestión de Clientes
          </Button>
          
          <Button
            variant={activeTab === "gestion-recogidas" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "gestion-recogidas" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("gestion-recogidas")}
          >
            Gestión de Recogidas
          </Button>
          
          <Button
            variant={activeTab === "rutas-distritos" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "rutas-distritos" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => setActiveTab("rutas-distritos")}
          >
            Rutas por Distritos
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
      
      {/* Main content */}
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
          {activeTab === "panel-control" && <AdminDashboard />}
          {activeTab === "gestion-clientes" && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
              <p className="text-muted-foreground">Esta sección está en desarrollo</p>
            </div>
          )}
          {activeTab === "gestion-recogidas" && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Gestión de Recogidas</h2>
              <p className="text-muted-foreground">Esta sección está en desarrollo</p>
            </div>
          )}
          {activeTab === "rutas-distritos" && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Rutas por Distritos</h2>
              <p className="text-muted-foreground">Esta sección está en desarrollo</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
