import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useRutas } from "@/hooks/useRutas";
import { Checkbox } from "@/components/ui/checkbox";

export interface RecogidaFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: {
    direccion?: string;
    distrito?: string;
    barrio?: string;
    nombre?: string;
    telefono?: string;
    clienteId?: string;
    [key: string]: any;
  };
}

const RecogidaForm = ({ onCancel, onSubmit, initialData = {} }: RecogidaFormProps) => {
  const { usuarios } = useUsuarios();
  const { rutas } = useRutas();
  
  const [formData, setFormData] = useState({
    fecha: new Date(),
    hora: "09:00",
    direccion: initialData.direccion || "",
    distrito: initialData.distrito || "",
    barrio: initialData.barrio || "",
    nombreContacto: initialData.nombre || "",
    telefonoContacto: initialData.telefono || "",
    emailContacto: "",
    tipoAceite: "doméstico",
    cantidadAproximada: 0,
    notasAdicionales: "",
    esRecogidaZona: false,
    rutaId: "",
    clienteId: initialData.clienteId || "",
    clientesRuta: [],
  });

  const [selectedCliente, setSelectedCliente] = useState<string>("");
  const [barriosDisponibles, setBarriosDisponibles] = useState<string[]>([]);
  
  // Set barrios when distrito changes
  useEffect(() => {
    if (formData.distrito) {
      setBarriosDisponibles(getBarriosByDistrito(formData.distrito));
    } else {
      setBarriosDisponibles([]);
    }
  }, [formData.distrito]);
  
  // Set initial form data from initialData
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        direccion: initialData.direccion || prev.direccion,
        distrito: initialData.distrito || prev.distrito,
        barrio: initialData.barrio || prev.barrio,
        nombreContacto: initialData.nombre || prev.nombreContacto,
        telefonoContacto: initialData.telefono || prev.telefonoContacto,
        clienteId: initialData.clienteId || prev.clienteId
      }));
      
      if (initialData.clienteId) {
        setSelectedCliente(initialData.clienteId);
      }
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "distrito") {
      setBarriosDisponibles(getBarriosByDistrito(value));
      setFormData(prev => ({ ...prev, barrio: "" })); // Reset barrio when distrito changes
    }

    if (name === "clienteId") {
      setSelectedCliente(value);
      const cliente = usuarios.find(u => u.id === value);
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          direccion: cliente.direccion || "",
          distrito: cliente.distrito || "",
          barrio: cliente.barrio || "",
          nombreContacto: cliente.nombre || "",
          telefonoContacto: cliente.telefono || ""
        }));
      }
    }
  };

  const getClientesRuta = (rutaId: string) => {
    const ruta = rutas.find(r => r.id === rutaId);
    return ruta?.clientes || [];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fecha">Fecha de Recogida</Label>
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
              {formData.fecha ? format(formData.fecha, "PPP", { locale: es }) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.fecha}
              onSelect={(date) => setFormData(prev => ({ ...prev, fecha: date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="hora">Hora de Recogida</Label>
        <div className="relative">
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            id="hora"
            name="hora"
            className="pl-8"
            value={formData.hora}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clienteId">Cliente</Label>
        <Select
          value={selectedCliente}
          onValueChange={(value) => handleSelectChange("clienteId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un cliente" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distrito">Distrito</Label>
          <Select
            value={formData.distrito}
            onValueChange={(value) => handleSelectChange("distrito", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritos.map(distrito => (
                <SelectItem key={distrito} value={distrito}>
                  {distrito}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="barrio">Barrio</Label>
          <Select
            value={formData.barrio}
            onValueChange={(value) => setFormData(prev => ({ ...prev, barrio: value }))}
            disabled={barriosDisponibles.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un barrio" />
            </SelectTrigger>
            <SelectContent>
              {barriosDisponibles.map(barrio => (
                <SelectItem key={barrio} value={barrio}>
                  {barrio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="nombreContacto">Nombre de Contacto</Label>
        <Input
          type="text"
          id="nombreContacto"
          name="nombreContacto"
          value={formData.nombreContacto}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
        <Input
          type="tel"
          id="telefonoContacto"
          name="telefonoContacto"
          value={formData.telefonoContacto}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="emailContacto">Email de Contacto</Label>
        <Input
          type="email"
          id="emailContacto"
          name="emailContacto"
          value={formData.emailContacto}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="tipoAceite">Tipo de Aceite</Label>
        <Select
          value={formData.tipoAceite}
          onValueChange={(value) => setFormData(prev => ({ ...prev, tipoAceite: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo de aceite" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doméstico">Doméstico</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="cantidadAproximada">Cantidad Aproximada (litros)</Label>
        <Input
          type="number"
          id="cantidadAproximada"
          name="cantidadAproximada"
          value={formData.cantidadAproximada}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="notasAdicionales">Notas Adicionales</Label>
        <Textarea
          id="notasAdicionales"
          name="notasAdicionales"
          value={formData.notasAdicionales}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="esRecogidaZona">Es Recogida en Zona</Label>
        <Checkbox
          id="esRecogidaZona"
          checked={formData.esRecogidaZona}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, esRecogidaZona: !!checked }))}
        />
      </div>

      {formData.esRecogidaZona && (
        <div>
          <Label htmlFor="rutaId">Ruta</Label>
          <Select
            value={formData.rutaId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, rutaId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una ruta" />
            </SelectTrigger>
            <SelectContent>
              {rutas.map(ruta => (
                <SelectItem key={ruta.id} value={ruta.id}>
                  {ruta.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.rutaId && (
        <div>
          <Label>Clientes en Ruta</Label>
          <ul>
            {getClientesRuta(formData.rutaId).map(cliente => (
              <li key={cliente.id}>{cliente.nombre}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default RecogidaForm;
