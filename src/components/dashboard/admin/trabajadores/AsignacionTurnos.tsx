import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, Clock, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRutas } from "@/hooks/useRutas";
import { useTurnos } from "@/hooks/useTurnos";
import { useVehiculos } from "@/hooks/useVehiculos";
import { Trabajador, Turno } from "@/types";
import { toast } from "sonner";

interface AsignacionTurnosProps {
  trabajador: Trabajador;
  onClose: () => void;
}

const AsignacionTurnos: React.FC<AsignacionTurnosProps> = ({ trabajador, onClose }) => {
  const { rutas } = useRutas();
  const { turnos, getTurnosPorTrabajador, addTurno, deleteTurno } = useTurnos();
  const { vehiculos } = useVehiculos();
  
  const [activeTab, setActiveTab] = useState("turnos");
  const turnosTrabajador = getTurnosPorTrabajador(trabajador.id);
  
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [rutaId, setRutaId] = useState("");
  const [vehiculoId, setVehiculoId] = useState(trabajador.vehiculoAsignado || "");
  
  const vehiculosDisponibles = vehiculos.filter(v => v.estado === 'disponible' || v.id === trabajador.vehiculoAsignado);
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleAddTurno = async () => {
    if (!dia || !horaInicio || !horaFin) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }
    
    try {
      const nuevoTurno: Omit<Turno, "id"> = {
        trabajadorId: trabajador.id,
        nombreTrabajador: `${trabajador.nombre} ${trabajador.apellido}`,
        trabajadorNombre: `${trabajador.nombre} ${trabajador.apellido}`,
        dia,
        horaInicio,
        horaFin,
        rutaId: rutaId || undefined,
        vehiculoId: vehiculoId || undefined,
        fecha: new Date(),
        estado: 'programado',
        distrito: '',
        createdAt: new Date(),
        nombre: '',
        dias: []
      };
      
      await addTurno(nuevoTurno);
      toast.success("Turno asignado correctamente");
      
      // Resetear campos
      setDia("");
      setHoraInicio("");
      setHoraFin("");
      setRutaId("");
      setVehiculoId(trabajador.vehiculoAsignado || "");
    } catch (error) {
      console.error("Error al asignar turno:", error);
      toast.error("Error al asignar el turno");
    }
  };
  
  const handleDeleteTurno = async (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este turno?")) {
      try {
        await deleteTurno(id);
        toast.success("Turno eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar turno:", error);
        toast.error("Error al eliminar el turno");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Gestión de turnos para {trabajador.nombre} {trabajador.apellido}
          </h3>
          <p className="text-sm text-gray-500">
            Configure los horarios y rutas asignadas al trabajador
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="turnos">Turnos actuales</TabsTrigger>
          <TabsTrigger value="asignar">Asignar nuevo turno</TabsTrigger>
        </TabsList>
        
        <TabsContent value="turnos" className="space-y-4 pt-4">
          {turnosTrabajador.length > 0 ? (
            <div className="space-y-4">
              {diasSemana.map((diaSemana) => {
                const turnosDelDia = turnosTrabajador.filter(t => 
                  t.dia.toLowerCase() === diaSemana.toLowerCase()
                );
                
                if (turnosDelDia.length === 0) return null;
                
                return (
                  <div key={diaSemana} className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3">{diaSemana}</h4>
                    <div className="space-y-3">
                      {turnosDelDia.map((turno) => {
                        const rutaAsignada = rutas.find(r => r.id === turno.rutaId);
                        const vehiculoAsignado = vehiculos.find(v => v.id === turno.vehiculoId);
                        
                        return (
                          <div key={turno.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {turno.horaInicio} - {turno.horaFin}
                                </span>
                              </div>
                              
                              {rutaAsignada && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{rutaAsignada.nombre}</span>
                                </div>
                              )}
                              
                              {vehiculoAsignado && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-800">
                                    {vehiculoAsignado.matricula}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTurno(turno.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>Este trabajador no tiene turnos asignados</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setActiveTab("asignar")}
              >
                Asignar un nuevo turno
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="asignar" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Día de la semana</label>
              <Select value={dia} onValueChange={setDia}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un día" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((diaSemana) => (
                    <SelectItem key={diaSemana} value={diaSemana}>
                      {diaSemana}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ruta asignada</label>
              <Select value={rutaId} onValueChange={setRutaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una ruta (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {rutas.map((ruta) => (
                    <SelectItem key={ruta.id} value={ruta.id}>
                      {ruta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hora de inicio</label>
              <Input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hora de fin</label>
              <Input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Vehículo</label>
              <Select value={vehiculoId} onValueChange={setVehiculoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un vehículo (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {vehiculosDisponibles.map((vehiculo) => (
                    <SelectItem key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.matricula} - {vehiculo.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="bg-asram hover:bg-asram-700" onClick={handleAddTurno}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir turno
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AsignacionTurnos;
