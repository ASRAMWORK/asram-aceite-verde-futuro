
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';

interface AdminStatusToggleProps {
  admin: Usuario;
}

const AdminStatusToggle: React.FC<AdminStatusToggleProps> = ({ admin }) => {
  const { updateUsuario } = useUsuarios();
  const [isLoading, setIsLoading] = useState(false);

  const handleActivarDesactivar = async () => {
    if (!admin.id) return;
    
    setIsLoading(true);
    try {
      await updateUsuario(admin.id, { activo: !admin.activo });
      toast.success(`Administrador ${admin.activo ? 'desactivado' : 'activado'} correctamente`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado del administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{admin.activo ? 'Activo' : 'Inactivo'}</span>
      <Switch
        checked={admin.activo}
        onCheckedChange={handleActivarDesactivar}
        disabled={isLoading}
      />
    </div>
  );
};

export default AdminStatusToggle;
