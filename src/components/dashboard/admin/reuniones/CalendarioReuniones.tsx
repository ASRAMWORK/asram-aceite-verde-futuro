
import React, { useState, useMemo } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useReuniones } from '@/hooks/useReuniones';

// Configuración del localizador para el calendario
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Componente para mostrar eventos en el calendario
const CalendarioReuniones = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { reuniones } = useReuniones();
  
  // Convertir las reuniones al formato esperado por react-big-calendar
  const events = useMemo(() => {
    return reuniones.map((reunion) => {
      // Asegurar que la fecha es un objeto Date
      const fechaInicio = reunion.fecha instanceof Date 
        ? reunion.fecha 
        : new Date(reunion.fecha);
      
      // Crear fecha fin por defecto (1 hora después)
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + (reunion.duracion ? reunion.duracion / 60 : 1));
      
      return {
        id: reunion.id,
        title: reunion.titulo || reunion.tipo,
        start: fechaInicio,
        end: fechaFin,
        allDay: false,
        resource: reunion,
      };
    });
  }, [reuniones]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event.resource);
  };

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    
    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (action === 'TODAY') {
      return setCurrentDate(new Date());
    }
    
    setCurrentDate(newDate);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#ee970d',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 5px'
    };
    return {
      style
    };
  };

  return (
    <div className="space-y-6">
      {/* Controles de navegación del calendario */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleNavigate('PREV')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleNavigate('NEXT')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('TODAY')}
          >
            Hoy
          </Button>
        </div>
      </div>
      
      {/* Calendario principal */}
      <div className="h-[600px] bg-white rounded-lg shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleEventSelect}
          eventPropGetter={eventStyleGetter}
          messages={{
            today: 'Hoy',
            previous: 'Anterior',
            next: 'Siguiente',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            allDay: 'Todo el día',
            work_week: 'Semana laboral',
            yesterday: 'Ayer',
            tomorrow: 'Mañana',
            noEventsInRange: 'No hay eventos en este rango',
          }}
        />
      </div>
      
      {/* Detalles del evento seleccionado */}
      {selectedEvent && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedEvent.titulo || selectedEvent.tipo}</CardTitle>
                <CardDescription>
                  {selectedEvent.fechaInicio instanceof Date 
                    ? format(selectedEvent.fecha, "d 'de' MMMM 'de' yyyy", { locale: es })
                    : format(new Date(selectedEvent.fecha), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {selectedEvent.tipoUsuario || 'Reunión'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEvent.nombreCentro && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Centro/Organización</p>
                  <p>{selectedEvent.nombreCentro}</p>
                </div>
              )}
              {selectedEvent.responsable && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Persona responsable</p>
                  <p>{selectedEvent.responsable}</p>
                </div>
              )}
              {selectedEvent.direccion && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p>{selectedEvent.direccion}</p>
                </div>
              )}
              {selectedEvent.telefono && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p>{selectedEvent.telefono}</p>
                </div>
              )}
              {selectedEvent.email && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedEvent.email}</p>
                </div>
              )}
            </div>
            
            {selectedEvent.descripcion && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-sm mt-1">{selectedEvent.descripcion}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={closeEventDetails}>Cerrar</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CalendarioReuniones;
