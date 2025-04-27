
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DistritoBarrioFilter from "./filters/DistritoBarrioFilter";
import { useRecogidas } from "@/hooks/useRecogidas";
import { format, isSameDay, isWeekend, addDays } from "date-fns";
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

  // Si no hay recogidas programadas, crearemos algunas ficticias para mostrar el funcionamiento
  useEffect(() => {
    if (recogidas.length === 0) {
      const today = new Date();
      const distritos = [
        "Centro", "Arganzuela", "Retiro", "Salamanca", "Chamartín", 
        "Tetuán", "Chamberí", "Fuencarral-El Pardo"
      ];
      
      // Crea recogidas ficticias para cada distrito en diferentes días
      const createRecogidas = async () => {
        setShowNoRecogidasMessage(true);
      };
      
      createRecogidas();
    } else {
      setShowNoRecogidasMessage(false);
    }
  }, [recogidas]);

  // Función para simular días de recogida si no hay datos reales
  const hasRecogidaOnDate = (date: Date) => {
    // Primero verificamos si hay recogidas reales
    const hasRealRecogida = recogidas.some(recogida => 
      recogida.fecha && isSameDay(new Date(recogida.fecha), date)
      && (!selectedDistrito || recogida.distrito === selectedDistrito)
      && (!selectedBarrio || recogida.barrio === selectedBarrio)
    );

    if (hasRealRecogida) return true;

    // Si no hay recogidas reales, simulamos algunas
    if (recogidas.length === 0) {
      // Determinar el distrito para esta fecha
      const dayOfMonth = date.getDate();
      const weekDay = date.getDay();
      
      // Si es fin de semana, no hay recogidas
      if (isWeekend(date)) return false;
      
      // Asignar días específicos para cada distrito
      // Centro: 1, 15
      if ((dayOfMonth === 1 || dayOfMonth === 15) && 
          (!selectedDistrito || selectedDistrito === "Centro") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Arganzuela: 2, 16
      if ((dayOfMonth === 2 || dayOfMonth === 16) && 
          (!selectedDistrito || selectedDistrito === "Arganzuela") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Retiro: 3, 17
      if ((dayOfMonth === 3 || dayOfMonth === 17) && 
          (!selectedDistrito || selectedDistrito === "Retiro") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Salamanca: 4, 18
      if ((dayOfMonth === 4 || dayOfMonth === 18) && 
          (!selectedDistrito || selectedDistrito === "Salamanca") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Chamartín: 5, 19
      if ((dayOfMonth === 5 || dayOfMonth === 19) && 
          (!selectedDistrito || selectedDistrito === "Chamartín") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Tetuán: 6, 20
      if ((dayOfMonth === 6 || dayOfMonth === 20) && 
          (!selectedDistrito || selectedDistrito === "Tetuán") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Chamberí: 7, 21
      if ((dayOfMonth === 7 || dayOfMonth === 21) && 
          (!selectedDistrito || selectedDistrito === "Chamberí") && 
          !isWeekend(date)) {
        return true;
      }
      
      // Fuencarral-El Pardo: los lunes
      if (weekDay === 1 && 
          (!selectedDistrito || selectedDistrito === "Fuencarral-El Pardo")) {
        return true;
      }
      
      // Moncloa-Aravaca: los martes
      if (weekDay === 2 && 
          (!selectedDistrito || selectedDistrito === "Moncloa-Aravaca")) {
        return true;
      }
      
      // Latina: los miércoles
      if (weekDay === 3 && 
          (!selectedDistrito || selectedDistrito === "Latina")) {
        return true;
      }
    }
    
    return false;
  };

  const getRecogidaDetails = (date: Date) => {
    // Buscar primero en las recogidas reales
    const recogida = recogidas.find(r => 
      r.fecha && isSameDay(new Date(r.fecha), date)
      && (!selectedDistrito || r.distrito === selectedDistrito)
      && (!selectedBarrio || r.barrio === selectedBarrio)
    );
    
    if (recogida) {
      return {
        distrito: recogida.distrito,
        barrio: recogida.barrio,
        hora: recogida.horaInicio || '09:00'
      };
    }
    
    // Si no hay recogida real, generar información ficticia
    if (hasRecogidaOnDate(date)) {
      const dayOfMonth = date.getDate();
      const weekDay = date.getDay();
      
      let distrito = "";
      
      // Asignar distritos según el día del mes o de la semana
      if (dayOfMonth === 1 || dayOfMonth === 15) distrito = "Centro";
      else if (dayOfMonth === 2 || dayOfMonth === 16) distrito = "Arganzuela";
      else if (dayOfMonth === 3 || dayOfMonth === 17) distrito = "Retiro";
      else if (dayOfMonth === 4 || dayOfMonth === 18) distrito = "Salamanca";
      else if (dayOfMonth === 5 || dayOfMonth === 19) distrito = "Chamartín";
      else if (dayOfMonth === 6 || dayOfMonth === 20) distrito = "Tetuán";
      else if (dayOfMonth === 7 || dayOfMonth === 21) distrito = "Chamberí";
      else if (weekDay === 1) distrito = "Fuencarral-El Pardo";
      else if (weekDay === 2) distrito = "Moncloa-Aravaca";
      else if (weekDay === 3) distrito = "Latina";
      
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
    <Card className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-sm shadow-lg border border-[#ee970d]/20">
      <CardHeader className="border-b border-[#ee970d]/10 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-[#ee970d]">
          Calendario de Recogidas 2025
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {showNoRecogidasMessage && (
          <div className="bg-amber-50 border border-amber-200 p-3 mb-6 rounded-md text-amber-800 text-sm">
            Nota: Estos son días de recogida simulados. Contacta con ASRAM para conocer los días reales de recogida en tu distrito.
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
              className="rounded-md border w-full"
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
      </CardContent>
    </Card>
  );
};

export default RecogidaCalendar;
