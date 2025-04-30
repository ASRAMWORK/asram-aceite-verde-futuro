
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DistritoBarrioFilter from "./filters/DistritoBarrioFilter";
import { useRecogidas } from "@/hooks/useRecogidas";
import { format, isSameDay, isWeekend, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import CalendarDay from "./calendar/CalendarDay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ListFilter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface RecogidaCalendarProps {
  isAdmin?: boolean;
}

const RecogidaCalendar: React.FC<RecogidaCalendarProps> = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const { recogidas, loadRecogidasData } = useRecogidas();
  const [showNoRecogidasMessage, setShowNoRecogidasMessage] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  
  // Mapeo de números de día a distritos para simular datos
  const distritosMap: Record<number, string> = {
    1: "Centro",
    2: "Arganzuela",
    3: "Retiro",
    4: "Salamanca",
    5: "Chamartín",
    6: "Tetuán",
    7: "Chamberí",
    8: "Fuencarral-El Pardo",
    9: "Moncloa-Aravaca",
    10: "Latina",
    11: "Carabanchel",
    12: "Usera",
    13: "Puente de Vallecas",
    14: "Moratalaz",
    15: "Ciudad Lineal",
    16: "Hortaleza",
    17: "Villaverde",
    18: "Villa de Vallecas",
    19: "Vicálvaro",
    20: "San Blas-Canillejas",
    21: "Barajas"
  };

  // Generar un horario ficticio para cada distrito
  const getHoraRecogidaForDistrito = (distrito: string): string => {
    const distritosHoras: Record<string, string> = {
      "Centro": "09:00",
      "Arganzuela": "09:30",
      "Retiro": "10:00",
      "Salamanca": "10:30",
      "Chamartín": "11:00",
      "Tetuán": "11:30",
      "Chamberí": "12:00",
      "Fuencarral-El Pardo": "12:30",
      "Moncloa-Aravaca": "13:00",
      "Latina": "13:30",
      "Carabanchel": "14:00",
      "Usera": "15:00",
      "Puente de Vallecas": "15:30",
      "Moratalaz": "16:00",
      "Ciudad Lineal": "16:30",
      "Hortaleza": "17:00",
      "Villaverde": "17:30",
      "Villa de Vallecas": "18:00",
      "Vicálvaro": "18:30",
      "San Blas-Canillejas": "19:00",
      "Barajas": "19:30"
    };
    
    return distritosHoras[distrito] || "09:00";
  };

  // Si no hay recogidas programadas, crearemos algunas ficticias para mostrar el funcionamiento
  useEffect(() => {
    if (recogidas.length === 0) {
      setShowNoRecogidasMessage(true);
    } else {
      setShowNoRecogidasMessage(false);
    }
  }, [recogidas]);
  
  // Safe date conversion helper
  const safeDate = (date: any): Date | null => {
    if (!date) return null;
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isValid(dateObj) ? dateObj : null;
    } catch (error) {
      console.error("Error converting date:", error);
      return null;
    }
  };

  // Función para verificar si hay recogida en una fecha
  const hasRecogidaOnDate = (date: Date) => {
    // Primero verificamos si hay recogidas reales
    const hasRealRecogida = recogidas.some(recogida => {
      if (!recogida.fecha) return false;
      
      const recogidaDate = safeDate(recogida.fecha);
      if (!recogidaDate) return false;
      
      return isSameDay(recogidaDate, date) &&
        (!selectedDistrito || recogida.distrito === selectedDistrito) &&
        (!selectedBarrio || recogida.barrio === selectedBarrio);
    });

    if (hasRealRecogida) return true;

    // Si no hay recogidas reales, simulamos según el día del mes
    if (recogidas.length === 0) {
      const dayOfMonth = date.getDate();
      
      // Si es fin de semana, no hay recogidas
      if (isWeekend(date)) return false;
      
      // Si el día del mes corresponde a un distrito
      if (dayOfMonth >= 1 && dayOfMonth <= 21) {
        const distritoForThisDay = distritosMap[dayOfMonth];
        
        // Si no hay distrito seleccionado o coincide con el día
        if (!selectedDistrito || selectedDistrito === distritoForThisDay) {
          return true;
        }
      }
    }
    
    return false;
  };

  const getRecogidaDetails = (date: Date) => {
    // Buscar primero en las recogidas reales
    const recogida = recogidas.find(r => {
      if (!r.fecha) return false;
      
      const recogidaDate = safeDate(r.fecha);
      if (!recogidaDate) return false;
      
      return isSameDay(recogidaDate, date) &&
        (!selectedDistrito || r.distrito === selectedDistrito) &&
        (!selectedBarrio || r.barrio === selectedBarrio);
    });
    
    if (recogida) {
      return {
        distrito: recogida.distrito || '',
        barrio: recogida.barrio,
        hora: recogida.horaInicio || '09:00'
      };
    }
    
    // Si no hay recogida real, generar información ficticia basada en el día del mes
    const dayOfMonth = date.getDate();
    if (dayOfMonth >= 1 && dayOfMonth <= 21 && !isWeekend(date)) {
      const distrito = distritosMap[dayOfMonth];
      
      // Solo devolver detalles si coincide con los filtros
      if (!selectedDistrito || distrito === selectedDistrito) {
        return {
          distrito: distrito,
          barrio: "",
          hora: getHoraRecogidaForDistrito(distrito)
        };
      }
    }
    
    return null;
  };

  // Generar lista de días con recogida para el mes actual
  const getDiasRecogidaPorDistrito = () => {
    const diasRecogida: Record<string, Date[]> = {};
    
    if (!selectedDate) return diasRecogida;
    
    const firstDayOfMonth = startOfMonth(selectedDate);
    const lastDayOfMonth = endOfMonth(selectedDate);
    
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    });
    
    // Para cada distrito, encontrar los días con recogida
    Object.values(distritosMap).forEach(distrito => {
      const diasParaDistrito = daysInMonth.filter(day => {
        // Si hay un distrito seleccionado y no es este, lo omitimos
        if (selectedDistrito && selectedDistrito !== distrito) return false;
        
        // Verificar si hay recogida (simulada o real)
        const dayOfMonth = day.getDate();
        
        // Si el día del mes corresponde a este distrito y no es fin de semana
        if (dayOfMonth >= 1 && dayOfMonth <= 21 && !isWeekend(day)) {
          return distritosMap[dayOfMonth] === distrito;
        }
        
        return false;
      });
      
      if (diasParaDistrito.length > 0) {
        diasRecogida[distrito] = diasParaDistrito;
      }
    });
    
    return diasRecogida;
  };

  const diasPorDistrito = getDiasRecogidaPorDistrito();

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg border border-[#ee970d]/20">
      <CardHeader className="border-b border-[#ee970d]/10 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-[#ee970d]">
            Calendario de Recogidas 2025
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
              className={viewMode === "calendar" ? "bg-[#ee970d] hover:bg-[#ee970d]/90" : ""}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendario
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#ee970d] hover:bg-[#ee970d]/90" : ""}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
        </div>
        <CardDescription>
          Consulta las fechas programadas para la recogida de aceite usado en tu zona
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {showNoRecogidasMessage && (
          <div className="bg-amber-50 border border-amber-200 p-3 mb-6 rounded-md text-amber-800 text-sm">
            <p className="font-medium">Días de recogida por distrito:</p>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1 text-xs">
              {Object.entries(distritosMap).map(([day, distrito]) => (
                <li key={day}>• Día {day}: Distrito {distrito}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          <div className="space-y-6">
            <DistritoBarrioFilter
              selectedDistrito={selectedDistrito}
              selectedBarrio={selectedBarrio}
              onDistritoChange={setSelectedDistrito}
              onBarrioChange={setSelectedBarrio}
            />
            
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#ee970d] mr-2"></span>
                Leyenda
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 border border-[#ee970d]">
                    <div className="w-1 h-full bg-[#ee970d]"></div>
                  </div>
                  <span>Día con recogida</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-gray-50"></div>
                  <span>Fin de semana</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            {viewMode === "calendar" ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  className="rounded-md border w-full h-full"
                  components={{
                    Day: ({ date, ...props }) => (
                      <CalendarDay
                        day={date.getDate()}
                        isWeekend={isWeekend(date)}
                        hasRecogida={hasRecogidaOnDate(date)}
                        recogidaDetails={getRecogidaDetails(date)}
                        {...props}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <Card className="shadow-sm border-[#ee970d]/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Días de recogida por distrito</CardTitle>
                  <CardDescription>
                    Listado completo de los días programados para {format(selectedDate || new Date(), 'MMMM yyyy', { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-6">
                      {Object.keys(diasPorDistrito).length > 0 ? (
                        Object.entries(diasPorDistrito).map(([distrito, dias]) => (
                          <div key={distrito} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#ee970d]">{distrito}</Badge>
                              <span className="text-sm text-gray-500">
                                {getHoraRecogidaForDistrito(distrito)} hrs
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {dias.map((dia, i) => (
                                <div 
                                  key={i}
                                  onClick={() => setSelectedDate(dia)}
                                  className={`
                                    px-3 py-1.5 border rounded-md cursor-pointer 
                                    ${isSameDay(dia, selectedDate || new Date()) 
                                      ? 'bg-[#ee970d]/10 border-[#ee970d] font-medium' 
                                      : 'border-gray-200 hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  <div className="text-sm font-medium">{format(dia, 'd', { locale: es })}</div>
                                  <div className="text-xs text-gray-500">{format(dia, 'EEEE', { locale: es })}</div>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-4" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No hay días de recogida para los filtros seleccionados.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Detalles de la fecha seleccionada */}
        {selectedDate && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-3">
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>
            {hasRecogidaOnDate(selectedDate) ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">
                    Recogida programada en {getRecogidaDetails(selectedDate)?.distrito}
                    {getRecogidaDetails(selectedDate)?.barrio ? `, ${getRecogidaDetails(selectedDate)?.barrio}` : ''}
                  </span>
                </div>
                <div className="pl-5">
                  <p className="text-gray-700">
                    <span className="font-medium">Hora:</span> {getRecogidaDetails(selectedDate)?.hora} hrs
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Recuerda tener preparado tu aceite usado en botellas de plástico bien cerradas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>No hay recogidas programadas para este día</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecogidaCalendar;
