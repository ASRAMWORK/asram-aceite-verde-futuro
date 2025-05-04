
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ComunidadVecinos } from '@/types';
import { updateDoc, doc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddLitrosRecogidosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comunidad: ComunidadVecinos;
  onSuccess?: () => void;
}

const AddLitrosRecogidosDialog: React.FC<AddLitrosRecogidosDialogProps> = ({
  isOpen,
  onClose,
  comunidad,
  onSuccess
}) => {
  const [litros, setLitros] = useState<number>(0);
  const [fecha, setFecha] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (litros <= 0) {
      toast.error('La cantidad de litros debe ser mayor que cero');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Reference to the community document
      const comunidadRef = doc(db, 'comunidadesVecinos', comunidad.id);
      
      // Create a new history entry
      const newHistoryEntry = {
        fecha,
        litros: Number(litros),
        id: `hist_${Date.now()}`
      };
      
      // Calculate new total liters
      const currentLitros = comunidad.litrosRecogidos || 0;
      const newTotalLitros = currentLitros + Number(litros);
      
      // Update the community document
      await updateDoc(comunidadRef, {
        historialRecogidas: arrayUnion(newHistoryEntry),
        litrosRecogidos: newTotalLitros,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Se han añadido ${litros} litros a la comunidad ${comunidad.nombre}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al añadir litros:", error);
      toast.error('Error al añadir litros a la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir litros recogidos</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comunidad">Comunidad</Label>
            <Input 
              id="comunidad"
              value={comunidad?.nombre || ""}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="litros">Litros recogidos</Label>
              <Input
                id="litros"
                type="number"
                value={litros}
                onChange={(e) => setLitros(Number(e.target.value))}
                min="0"
                step="0.1"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha de recogida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fecha && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fecha ? format(fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={(date) => date && setFecha(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || litros <= 0}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLitrosRecogidosDialog;
