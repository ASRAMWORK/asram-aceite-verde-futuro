
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { distritosConBarrios, getBarriosByDistrito } from '@/data/madridDistritos';

interface RecogidaFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const RecogidaForm: React.FC<RecogidaFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tipoBusqueda: 'individual',
    fecha: new Date(),
    hora: '',
    distrito: '',
    barrio: '',
    direccion: '',
    nombreLugar: '',
    clienteId: '',
    telefono: '',
    litrosEstimados: 0
  });
  
  const [disponibleBarrios, setDisponibleBarrios] = useState<string[]>([]);
  
  const handleTipoChange = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipoBusqueda: tipo }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'distrito') {
      const barrios = getBarriosByDistrito(value);
      setDisponibleBarrios(barrios);
      setFormData(prev => ({ ...prev, barrio: '' }));
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setFormData(prev => ({ ...prev, fecha: date }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure we have a valid date before submitting
    if (!isValid(formData.fecha)) {
      console.error('Invalid date value');
      return;
    }
    
    onSubmit({
      ...formData,
      fechaProgramada: formData.fecha,
    });
  };

  // Safe date formatting helper
  const formatDate = (date: Date | null | undefined) => {
    if (!date || !isValid(date)) return '';
    try {
      return format(date, "PPP", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="text-sm font-medium mb-2">Tipo de recogida</h4>
        <RadioGroup
          value={formData.tipoBusqueda}
          onValueChange={(value) => handleTipoChange(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="zona" id="zona" />
            <Label htmlFor="zona">Zona</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="calendario" id="calendario" />
            <Label htmlFor="calendario">Calendario</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha de recogida</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.fecha && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.fecha && isValid(formData.fecha) ? 
                  formatDate(formData.fecha) : 
                  <span>Seleccionar fecha</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.fecha}
                onSelect={handleDateSelect}
                initialFocus
                locale={es}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hora">Hora</Label>
          <Input 
            id="hora"
            name="hora"
            type="time"
            value={formData.hora}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="distrito">Distrito</Label>
          <Select
            value={formData.distrito}
            onValueChange={(value) => handleSelectChange('distrito', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritosConBarrios.map(d => (
                <SelectItem key={d.distrito} value={d.distrito}>
                  {d.distrito}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="barrio">Barrio</Label>
          <Select
            value={formData.barrio}
            onValueChange={(value) => handleSelectChange('barrio', value)}
            disabled={disponibleBarrios.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar barrio" />
            </SelectTrigger>
            <SelectContent>
              {disponibleBarrios.map(barrio => (
                <SelectItem key={barrio} value={barrio}>
                  {barrio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input 
          id="direccion"
          name="direccion"
          placeholder="Dirección completa para la recogida"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nombreLugar">Nombre del lugar (opcional)</Label>
        <Input 
          id="nombreLugar"
          name="nombreLugar"
          placeholder="Nombre del establecimiento o comunidad"
          value={formData.nombreLugar}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clienteId">ID del cliente (opcional)</Label>
          <Input 
            id="clienteId"
            name="clienteId"
            placeholder="Identificador del cliente"
            value={formData.clienteId}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono de contacto</Label>
          <Input 
            id="telefono"
            name="telefono"
            placeholder="Teléfono para la recogida"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="litrosEstimados">Litros estimados</Label>
        <Input 
          id="litrosEstimados"
          name="litrosEstimados"
          type="number"
          min="0"
          value={formData.litrosEstimados}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Programar Recogida
        </Button>
      </div>
    </form>
  );
};

export default RecogidaForm;
