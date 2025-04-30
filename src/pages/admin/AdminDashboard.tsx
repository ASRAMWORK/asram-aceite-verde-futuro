
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import AdminDashboardContent from '@/components/dashboard/admin/AdminDashboardContent';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rutas';
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminPermission = async () => {
      setLoading(true);
      try {
        // Wait for auth to be checked
        if (authLoading) return;
        
        if (!user) {
          navigate('/login?redirect=/admin/dashboard');
          return;
        }
        
        // Check if user is admin
        if (user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin permissions:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminPermission();
  }, [user, authLoading, navigate]);
  
  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#ee970d]" />
        <p className="mt-4 text-lg font-medium text-gray-600">
          {loading ? "Verificando permisos de administrador..." : "Cargando..."}
        </p>
      </div>
    );
  }
  
  if (isAdmin === false) {
    return null; // User will be redirected by the useEffect
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} />
      <div className="flex-1 overflow-auto">
        <AdminDashboardContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AdminDashboard;
