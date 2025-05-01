
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Usuario } from '@/types';

interface AddHistoricalCollectionProps {
  cliente: Usuario;
  onAddCollection: (date: Date, litros: number) => Promise<void>;
}

const AddHistoricalCollection: React.FC<AddHistoricalCollectionProps> = ({ 
  cliente, 
  onAddCollection 
}) => {
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [litros, setLitros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddHistoricalCollection = async () => {
    if (!cliente.id) {
      console.error("Cliente ID is missing");
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddCollection(date, litros);
      setIsAddingRecogida(false);
      setDate(new Date());
      setLitros(0);
    } catch (error) {
      console.error("Error adding historical collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
      <DialogTrigger asChild>
        <Button className="bg-[#EE970D] hover:bg-[#d88400]">
          <Plus className="mr-2 h-4 w-4" />
          Añadir recolección histórica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir recolección histórica</DialogTitle>
          <DialogDescription>
            Registra una recolección anterior para este cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha de recolección</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: es }) : <span>Seleccione una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="litros">Litros recogidos</Label>
            <Input
              id="litros"
              type="number"
              min="0"
              step="0.5"
              value={litros}
              onChange={(e) => setLitros(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddingRecogida(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddHistoricalCollection}
            disabled={isLoading || litros <= 0}
            className="bg-[#EE970D] hover:bg-[#d88400]"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddHistoricalCollection;
