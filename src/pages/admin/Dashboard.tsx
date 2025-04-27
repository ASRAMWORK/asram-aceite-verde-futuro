
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");  // Explicitly navigate to login page
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return <AdminDashboard onSignOut={handleSignOut} />;
};

export default Dashboard;
