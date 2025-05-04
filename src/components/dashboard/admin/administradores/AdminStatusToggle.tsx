
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { useComerciales } from '@/hooks/useComerciales';

interface AdminStatusToggleProps {
  user: Usuario;
  userType?: 'admin' | 'comercial';
}

const AdminStatusToggle: React.FC<AdminStatusToggleProps> = ({ user, userType = 'admin' }) => {
  const { updateUsuario } = useUsuarios();
  const { toggleComercialStatus } = useComerciales();
  const [isLoading, setIsLoading] = useState(false);

  const handleActivarDesactivar = async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    try {
      if (userType === 'comercial') {
        await toggleComercialStatus(user.id, !user.activo);
      } else {
        await updateUsuario(user.id, { activo: !user.activo });
      }
      toast.success(`${userType === 'comercial' ? 'Comercial' : 'Administrador'} ${user.activo ? 'desactivado' : 'activado'} correctamente`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error(`Error al cambiar el estado del ${userType === 'comercial' ? 'comercial' : 'administrador'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.activo ? 'Activo' : 'Inactivo'}</span>
      <Switch
        checked={user.activo}
        onCheckedChange={handleActivarDesactivar}
        disabled={isLoading}
      />
    </div>
  );
};

export default AdminStatusToggle;
