
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RecogidaForm from "../RecogidaForm";
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
import { toast } from 'sonner';

interface RecogidaClienteButtonProps {
  cliente: Usuario;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const RecogidaClienteButton: React.FC<RecogidaClienteButtonProps> = ({
  cliente,
  variant = "default",
  size = "default"
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addRecogida } = useRecogidas();

  const handleAddRecogida = async (formData: any) => {
    try {
      // Pre-fill data from cliente
      const recogidaData = {
        ...formData,
        clienteId: cliente.id,
        cliente: cliente.nombre,
        direccionRecogida: formData.direccion || cliente.direccion,
        nombreContacto: cliente.nombre,
        telefonoContacto: cliente.telefono,
        emailContacto: cliente.email,
        direccion: formData.direccion || cliente.direccion,
        distrito: formData.distrito || cliente.distrito,
        barrio: formData.barrio || cliente.barrio
      };
      
      await addRecogida(recogidaData);
      setIsDialogOpen(false);
      toast.success(Recogida programada para ${cliente.nombre});
    } catch (error) {
      console.error("Error al programar recogida:", error);
      toast.error("Error al programar la recogida");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        onClick={() => setIsDialogOpen(true)}
      >
        {size === "icon" ? <Droplet className="h-4 w-4" /> : (
          <>
            <Droplet className="mr-2 h-4 w-4" />
            Programar Recogida
          </>
        )}
      </Button>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programar Recogida</DialogTitle>
          <DialogDescription>
            Programa una recogida para {cliente.nombre}
          </DialogDescription>
        </DialogHeader>
        
        <RecogidaForm 
          onCancel={() => setIsDialogOpen(false)}
          onSubmit={handleAddRecogida}
          initialData={{
            direccion: cliente.direccion,
            distrito: cliente.distrito,
            barrio: cliente.barrio,
            nombreContacto: cliente.nombre,
            telefonoContacto: cliente.telefono,
            emailContacto: cliente.email,
            clienteId: cliente.id,
            fechaRecogida: new Date()
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecogidaClienteButton;