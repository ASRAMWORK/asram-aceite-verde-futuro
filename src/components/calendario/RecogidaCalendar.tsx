
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DistritoBarrioFilter from "./filters/DistritoBarrioFilter";
import { useRecogidas } from "@/hooks/useRecogidas";
import { format, isSameDay, isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import CalendarDay from "./calendar/CalendarDay";

interface RecogidaCalendarProps {
  isAdmin?: boolean;
}

const RecogidaCalendar: React.FC<RecogidaCalendarProps> = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const { recogidas } = useRecogidas();

  const filteredRecogidas = recogidas.filter(recogida => {
    if (selectedDistrito && recogida.distrito !== selectedDistrito) return false;
    if (selectedBarrio && recogida.barrio !== selectedBarrio) return false;
    return true;
  });

  const hasRecogidaOnDate = (date: Date) => {
    return filteredRecogidas.some(recogida => 
      recogida.fecha && isSameDay(new Date(recogida.fecha), date)
    );
  };

  const getRecogidaDetails = (date: Date) => {
    const recogida = filteredRecogidas.find(r => 
      r.fecha && isSameDay(new Date(r.fecha), date)
    );
    
    if (!recogida) return null;
    
    return {
      distrito: recogida.distrito,
      barrio: recogida.barrio,
      hora: recogida.horaInicio || '09:00'
    };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Calendario de Recogidas 2025
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <div className="space-y-6">
            <DistritoBarrioFilter
              selectedDistrito={selectedDistrito}
              selectedBarrio={selectedBarrio}
              onDistritoChange={setSelectedDistrito}
              onBarrioChange={setSelectedBarrio}
            />
          </div>

          <div className="rounded-lg overflow-hidden">
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
