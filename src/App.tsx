import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ensureAdminUser, isAdminEmail, db } from "@/lib/firebase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import AdministradorDashboard from "./pages/administrador/Dashboard";
import NotFound from "./pages/NotFound";
import { doc, getDoc } from "firebase/firestore";

const queryClient = new QueryClient();

const ProtectedAdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminEmail(user.email)) {
        setIsAdmin(true);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    ensureAdminUser();

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAdmin ? <AdminDashboard /> : <Navigate to="/login" />;
};

const ProtectedAdministradorRoute = () => {
  const [isAdministrador, setIsAdministrador] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const checkRole = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists && userDoc.data().role === "administrador") {
              setIsAdministrador(true);
            } else {
              navigate("/login");
            }
          } catch (error) {
            console.error("Error checking role:", error);
            navigate("/login");
          } finally {
            setLoading(false);
          }
        };
        checkRole();
      } else {
        navigate("/login");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAdministrador ? <AdministradorDashboard /> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/administrador/dashboard" element={<ProtectedAdministradorRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
