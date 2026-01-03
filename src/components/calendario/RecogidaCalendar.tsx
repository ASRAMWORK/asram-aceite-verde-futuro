import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DistritoBarrioFilter from "./filters/DistritoBarrioFilter";
import { format, isWeekend, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Info, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  distritoSchedules, 
  getScheduleByDistrito, 
  diasSemana, 
  isFestivo,
  getDistritosGroupedByDay 
} from "@/data/recogidaSchedule";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RecogidaCalendarProps {
  isAdmin?: boolean;
}

const RecogidaCalendar: React.FC<RecogidaCalendarProps> = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const [month, setMonth] = useState<Date>(new Date());

  // Obtener información del distrito seleccionado
  const selectedDistritoSchedule = useMemo(() => {
    if (!selectedDistrito) return null;
    return getScheduleByDistrito(selectedDistrito);
  }, [selectedDistrito]);

  // Verificar si una fecha tiene recogida para el distrito seleccionado
  const hasRecogidaOnDate = (date: Date): boolean => {
    // No hay recogidas en fines de semana
    if (isWeekend(date)) return false;
    
    // No hay recogidas en festivos
    if (isFestivo(date)) return false;
    
    const dayOfWeek = getDay(date);
    
    // Si hay un distrito seleccionado, verificar si coincide con su día
    if (selectedDistrito && selectedDistritoSchedule) {
      return dayOfWeek === selectedDistritoSchedule.diaSemana;
    }
    
    // Si no hay distrito seleccionado, mostrar todos los días laborables
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  };

  // Obtener los distritos que se recogen en una fecha
  const getDistritosForDate = (date: Date) => {
    if (isWeekend(date) || isFestivo(date)) return [];
    
    const dayOfWeek = getDay(date);
    return distritoSchedules.filter(s => s.diaSemana === dayOfWeek);
  };

  // Calcular los días de recogida del mes para el distrito seleccionado
  const collectionDays = useMemo(() => {
    if (!selectedDistritoSchedule) return [];
    
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    return days.filter(day => {
      if (isWeekend(day) || isFestivo(day)) return false;
      return getDay(day) === selectedDistritoSchedule.diaSemana;
    });
  }, [month, selectedDistritoSchedule]);

  // Agrupar distritos por día
  const distritosGrouped = getDistritosGroupedByDay();

  // Custom day renderer
  const modifiers = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    const collectionDates = days.filter(day => hasRecogidaOnDate(day));
    const festivoDates = days.filter(day => isFestivo(day));
    
    return {
      collection: collectionDates,
      festivo: festivoDates,
    };
  }, [month, selectedDistrito, selectedDistritoSchedule]);

  const modifiersStyles = {
    collection: {
      backgroundColor: 'hsl(30, 90%, 50%)',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '8px',
    },
    festivo: {
      backgroundColor: 'hsl(0, 70%, 95%)',
      color: 'hsl(0, 70%, 40%)',
      textDecoration: 'line-through',
    },
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white to-orange-50/30 shadow-xl border-0 overflow-hidden">
      {/* Header mejorado */}
      <CardHeader className="bg-gradient-to-r from-[#ee970d] to-[#f5a623] text-white pb-6 pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Calendario de Recogidas 2025
            </CardTitle>
            <CardDescription className="text-white/90 mt-1">
              Consulta los días de recogida de aceite usado en tu zona
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
          {/* Panel izquierdo - Filtros y Leyenda */}
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#ee970d]" />
                Selecciona tu ubicación
              </h3>
              <DistritoBarrioFilter
                selectedDistrito={selectedDistrito}
                selectedBarrio={selectedBarrio}
                onDistritoChange={(distrito) => {
                  setSelectedDistrito(distrito);
                  setSelectedBarrio("");
                }}
                onBarrioChange={setSelectedBarrio}
              />
            </div>

            {/* Info del distrito seleccionado */}
            <AnimatePresence mode="wait">
              {selectedDistritoSchedule && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-br from-[#ee970d]/10 to-[#f5a623]/10 rounded-xl p-5 border border-[#ee970d]/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#ee970d] rounded-lg">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedDistrito}</p>
                      <p className="text-sm text-gray-600">Día de recogida asignado</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">Día:</span>
                      <Badge className="bg-[#ee970d] hover:bg-[#ee970d]/90 text-white font-semibold">
                        {diasSemana[selectedDistritoSchedule.diaSemana]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">Hora:</span>
                      <span className="font-semibold text-gray-800 flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[#ee970d]" />
                        {selectedDistritoSchedule.hora}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">Recogidas este mes:</span>
                      <span className="font-bold text-[#ee970d] text-lg">
                        {collectionDays.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Leyenda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-[#ee970d]" />
                Leyenda
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ee970d] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">15</span>
                  </div>
                  <span className="text-sm text-gray-700">Día de recogida</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-red-400 text-xs line-through">25</span>
                  </div>
                  <span className="text-sm text-gray-700">Festivo (sin recogida)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">S</span>
                  </div>
                  <span className="text-sm text-gray-700">Fin de semana</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Panel derecho - Calendario */}
          <div className="space-y-6">
            {/* Calendario principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={month}
                onMonthChange={setMonth}
                locale={es}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className={cn(
                  "rounded-lg w-full pointer-events-auto",
                  "[&_.rdp-caption]:text-lg [&_.rdp-caption]:font-semibold [&_.rdp-caption]:text-gray-800",
                  "[&_.rdp-head_cell]:text-[#ee970d] [&_.rdp-head_cell]:font-semibold",
                  "[&_.rdp-cell]:p-1",
                  "[&_.rdp-day]:h-10 [&_.rdp-day]:w-10 md:[&_.rdp-day]:h-12 md:[&_.rdp-day]:w-12",
                  "[&_.rdp-day]:text-sm md:[&_.rdp-day]:text-base",
                  "[&_.rdp-day]:rounded-lg",
                  "[&_.rdp-day:hover]:bg-orange-100",
                  "[&_.rdp-day_selected]:bg-[#ee970d] [&_.rdp-day_selected]:text-white",
                  "[&_.rdp-nav_button]:text-[#ee970d] [&_.rdp-nav_button:hover]:bg-orange-100"
                )}
              />
            </div>

            {/* Detalles del día seleccionado */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "rounded-xl p-5 border",
                    hasRecogidaOnDate(selectedDate)
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                    {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </h3>
                  
                  {isFestivo(selectedDate) ? (
                    <div className="flex items-center gap-3 text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Festivo - No hay servicio de recogida</span>
                    </div>
                  ) : isWeekend(selectedDate) ? (
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>Fin de semana - No hay recogidas programadas</span>
                    </div>
                  ) : hasRecogidaOnDate(selectedDate) ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-green-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">
                          {selectedDistrito 
                            ? `Recogida programada en ${selectedDistrito}`
                            : "Día de recogidas programadas"
                          }
                        </span>
                      </div>
                      
                      {selectedDistritoSchedule ? (
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Hora aproximada:</span> {selectedDistritoSchedule.hora} hrs
                          </p>
                          <p className="text-sm text-gray-600">
                            Recuerda tener preparado tu aceite usado en botellas de plástico bien cerradas.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Distritos con recogida hoy:</p>
                          <div className="flex flex-wrap gap-2">
                            {getDistritosForDate(selectedDate).map(d => (
                              <Badge 
                                key={d.distrito} 
                                variant="outline"
                                className="border-[#ee970d] text-[#ee970d] cursor-pointer hover:bg-[#ee970d] hover:text-white transition-colors"
                                onClick={() => setSelectedDistrito(d.distrito)}
                              >
                                {d.distrito} ({d.hora})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>No hay recogidas programadas para este día</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Tabla de horarios por distrito */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#ee970d]" />
            Horario semanal de recogidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(distritosGrouped).map(([dia, distritos]) => (
              <div 
                key={dia} 
                className={cn(
                  "rounded-xl p-4 transition-all",
                  selectedDistritoSchedule?.diaSemana === Number(dia)
                    ? "bg-[#ee970d]/10 border-2 border-[#ee970d]"
                    : "bg-gray-50 border border-gray-200"
                )}
              >
                <h4 className={cn(
                  "font-bold text-center pb-3 mb-3 border-b",
                  selectedDistritoSchedule?.diaSemana === Number(dia)
                    ? "text-[#ee970d] border-[#ee970d]/30"
                    : "text-gray-700 border-gray-200"
                )}>
                  {diasSemana[Number(dia)]}
                </h4>
                <ul className="space-y-2">
                  {distritos.map(d => (
                    <li 
                      key={d.distrito}
                      onClick={() => setSelectedDistrito(d.distrito)}
                      className={cn(
                        "text-sm p-2 rounded-lg cursor-pointer transition-all",
                        selectedDistrito === d.distrito
                          ? "bg-[#ee970d] text-white font-medium"
                          : "hover:bg-gray-100 text-gray-600"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{d.distrito}</span>
                        <span className={cn(
                          "text-xs",
                          selectedDistrito === d.distrito ? "text-white/80" : "text-gray-400"
                        )}>
                          {d.hora}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecogidaCalendar;
