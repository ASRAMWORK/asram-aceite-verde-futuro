
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Ensure the logout function redirects to login
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div>
      {/* Dashboard content */}
      <Button 
        variant="destructive" 
        onClick={handleLogout}
        className="w-full"
      >
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default UserDashboard;
