
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { distritos } from "@/data/madridDistritos";
import { CalendarioRecogida } from "@/types";
import { useRecogidas } from "@/hooks/useRecogidas";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";

interface RecogidaCalendarProps {
  isAdmin?: boolean;
}

const RecogidaCalendar: React.FC<RecogidaCalendarProps> = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { recogidas, addRecogida, deleteRecogida, updateRecogida } = useRecogidas();
  const [newRecogida, setNewRecogida] = useState({
    distrito: "",
    horaInicio: "09:00",
    horaFin: "14:00",
    notas: "",
  });

  const recogidasDelDia = (date: Date) => {
    return recogidas.filter(r => 
      r.fecha && isSameDay(new Date(r.fecha), date)
    );
  };

  const handleAddRecogida = async () => {
    if (!selectedDate || !newRecogida.distrito) return;

    await addRecogida({
      distrito: newRecogida.distrito,
      fecha: selectedDate,
      horaInicio: newRecogida.horaInicio,
      horaFin: newRecogida.horaFin,
      estado: "programado",
      notas: newRecogida.notas,
      // Include required fields for Recogida type
      fechaSolicitud: selectedDate,
      fechaProgramada: selectedDate,
      fechaCompletada: null,
      clienteId: "sistema",
      direccion: newRecogida.distrito,
      telefono: "",
      tipo: "calendario",
      litrosEstimados: 0,
      litrosRecogidos: 0,
      completada: false
    });

    setShowAddDialog(false);
    setNewRecogida({
      distrito: "",
      horaInicio: "09:00",
      horaFin: "14:00",
      notas: "",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Calendario de Recogidas 2025</CardTitle>
        <CardDescription>
          Consulta las fechas programadas de recogida por distrito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[1fr,300px] gap-8">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border w-full"
              modifiers={{
                booked: (date) => recogidasDelDia(date).length > 0,
              }}
              modifiersClassNames={{
                booked: "bg-green-50 font-bold text-green-700",
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">
              Recogidas para{" "}
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
                : "hoy"}
            </h3>

            {recogidasDelDia(selectedDate || new Date()).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay recogidas programadas para este día
              </p>
            ) : (
              <div className="space-y-2">
                {recogidasDelDia(selectedDate || new Date()).map((recogida) => (
                  <div
                    key={recogida.id}
                    className="p-3 border rounded-lg flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{recogida.distrito}</h4>
                      <Badge
                        variant={
                          recogida.estado === "completado"
                            ? "default"
                            : recogida.estado === "cancelado"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {recogida.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {recogida.horaInicio} - {recogida.horaFin}
                      </span>
                    </div>
                    {recogida.notas && (
                      <p className="text-sm text-muted-foreground">
                        {recogida.notas}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isAdmin && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Añadir Recogida
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Programar nueva recogida</DialogTitle>
                    <DialogDescription>
                      Añade una nueva recogida al calendario para el día{" "}
                      {selectedDate &&
                        format(selectedDate, "d 'de' MMMM, yyyy", {
                          locale: es,
                        })}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Distrito</Label>
                      <Select
                        value={newRecogida.distrito}
                        onValueChange={(value) =>
                          setNewRecogida({ ...newRecogida, distrito: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {distritos.map((distrito) => (
                            <SelectItem key={distrito} value={distrito}>
                              {distrito}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hora inicio</Label>
                        <Input
                          type="time"
                          value={newRecogida.horaInicio}
                          onChange={(e) =>
                            setNewRecogida({
                              ...newRecogida,
                              horaInicio: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora fin</Label>
                        <Input
                          type="time"
                          value={newRecogida.horaFin}
                          onChange={(e) =>
                            setNewRecogida({
                              ...newRecogida,
                              horaFin: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notas adicionales</Label>
                      <Input
                        value={newRecogida.notas}
                        onChange={(e) =>
                          setNewRecogida({
                            ...newRecogida,
                            notas: e.target.value,
                          })
                        }
                        placeholder="Añade cualquier información relevante"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleAddRecogida}>
                      Programar Recogida
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecogidaCalendar;
