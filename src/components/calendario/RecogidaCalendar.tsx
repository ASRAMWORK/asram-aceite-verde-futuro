
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DistritoBarrioFilter from "./filters/DistritoBarrioFilter";
import { useRecogidas } from "@/hooks/useRecogidas";
import { format, isSameDay, isWeekend, isValid } from "date-fns";
import { es } from "date-fns/locale";
import CalendarDay from "./calendar/CalendarDay";

interface RecogidaCalendarProps {
  isAdmin?: boolean;
}

const RecogidaCalendar: React.FC<RecogidaCalendarProps> = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const { recogidas, loadRecogidasData } = useRecogidas();
  const [showNoRecogidasMessage, setShowNoRecogidasMessage] = useState(false);
  
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
        distrito: recogida.distrito,
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
          hora: "09:00"
        };
      }
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-sm shadow-lg border border-[#ee970d]/20">
      <CardHeader className="border-b border-[#ee970d]/10 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-[#ee970d]">
          Calendario de Recogidas 2025
        </CardTitle>
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
        
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
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

          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
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
        </div>
        
        {/* Detalles de la fecha seleccionada */}
        {selectedDate && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>
            {hasRecogidaOnDate(selectedDate) ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">
                  Recogida programada en {getRecogidaDetails(selectedDate)?.distrito}
                  {getRecogidaDetails(selectedDate)?.barrio ? `, ${getRecogidaDetails(selectedDate)?.barrio}` : ''}
                  {' - '}{getRecogidaDetails(selectedDate)?.hora} hrs
                </span>
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
