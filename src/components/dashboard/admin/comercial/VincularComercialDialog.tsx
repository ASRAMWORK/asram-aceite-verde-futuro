
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useComerciales } from "@/hooks/useComerciales";

interface VincularComercialDialogProps {
  comercialId: string;
  open: boolean;
  onClose: () => void;
}

const VincularComercialDialog = ({ comercialId, open, onClose }: VincularComercialDialogProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { getComercialById, intentarVincularComercial, checkEmailExistsInAuth } = useComerciales();

  const comercial = getComercialById(comercialId);
  const [emailExistsInAuth, setEmailExistsInAuth] = useState<boolean | null>(null);

  // Comprobar si el email existe en Auth al abrir el dialog
  React.useEffect(() => {
    const checkEmail = async () => {
      if (comercial?.email) {
        const exists = await checkEmailExistsInAuth(comercial.email);
        setEmailExistsInAuth(exists);
      }
    };
    
    if (open && comercial) {
      checkEmail();
    }
  }, [open, comercial, checkEmailExistsInAuth]);

  const handleVincular = async () => {
    if (!comercial) return;
    
    setLoading(true);
    try {
      const success = await intentarVincularComercial(comercialId, password);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!comercial) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular comercial con Firebase Auth</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={comercial.email}
              disabled
            />
            
            <div className="text-xs text-muted-foreground">
              Estado de vinculación: {" "}
              <span className="font-semibold">
                {comercial.estadoVinculacion === 'pendiente' && "Pendiente de vincular"}
                {comercial.estadoVinculacion === 'falla_password' && "Password incorrecto"}
                {comercial.estadoVinculacion === 'sin_vincular' && "Sin vincular"}
              </span>
            </div>
          </div>
          
          {emailExistsInAuth !== null && (
            <Alert variant={emailExistsInAuth ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {emailExistsInAuth 
                  ? "Este email ya existe en Firebase Auth. Necesitarás proporcionar la contraseña correcta para vincularlo."
                  : "Este email no existe en Firebase Auth. Se creará un nuevo usuario con la contraseña que proporciones."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={emailExistsInAuth ? "Ingresa la contraseña existente" : "Crea una nueva contraseña"}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleVincular} disabled={!password || loading}>
            {loading ? "Procesando..." : "Vincular comercial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VincularComercialDialog;
