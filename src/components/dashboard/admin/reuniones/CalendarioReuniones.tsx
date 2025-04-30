
import React, { useState, useMemo } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Phone, Mail, User, Building } from 'lucide-react';
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

// Estilos personalizados para el calendario
const calendarStyles = {
  weekHeader: {
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontWeight: 'bold',
    padding: '8px',
    borderBottom: '1px solid #e5e7eb',
  },
  todayCell: {
    backgroundColor: '#FFF8F0',
    borderRadius: '4px',
    color: '#EE970D',
  },
};

// Componente para mostrar eventos en el calendario
const CalendarioReuniones = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { reuniones, marcarCompletada } = useReuniones();
  
  // Convertir las reuniones al formato esperado por react-big-calendar
  const events = useMemo(() => {
    return reuniones
      .filter(reunion => !reunion.completada) // Solo mostramos reuniones no completadas en el calendario
      .map((reunion) => {
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
    console.log("Evento seleccionado:", event);
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
    const backgroundColor = event.resource?.completada ? '#10B981' : '#EE970D';
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 5px',
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
            className="hover:bg-orange-50 hover:text-[#EE970D] hover:border-[#EE970D]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center bg-white px-4 py-2 rounded-md shadow-sm border">
            <CalendarIcon className="h-5 w-5 mr-2 text-[#EE970D]" />
            <span className="font-medium">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleNavigate('NEXT')}
            className="hover:bg-orange-50 hover:text-[#EE970D] hover:border-[#EE970D]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('TODAY')}
            className="hover:bg-orange-50 hover:text-[#EE970D] hover:border-[#EE970D]"
          >
            Hoy
          </Button>
        </div>
      </div>
      
      {/* Calendario principal */}
      <div className="h-[600px] bg-white rounded-lg shadow-md border">
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
          dayPropGetter={(date) => {
            const today = new Date();
            if (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            ) {
              return {
                style: calendarStyles.todayCell,
              };
            }
            return {};
          }}
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
        <Card className="mt-6 shadow-md border-t-4 border-t-[#EE970D]">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedEvent.titulo || selectedEvent.tipo}</CardTitle>
                <CardDescription className="flex items-center text-[#EE970D]">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {selectedEvent.fecha instanceof Date 
                    ? format(selectedEvent.fecha, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
                    : format(new Date(selectedEvent.fecha), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-[#EE970D] border-orange-200">
                {selectedEvent.tipoUsuario || 'Reunión'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEvent.nombreCentro && (
                <div className="flex items-start">
                  <Building className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Centro/Organización</p>
                    <p>{selectedEvent.nombreCentro}</p>
                  </div>
                </div>
              )}
              {selectedEvent.responsable && (
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Persona responsable</p>
                    <p>{selectedEvent.responsable}</p>
                  </div>
                </div>
              )}
              {selectedEvent.direccion && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                    <p>{selectedEvent.direccion}</p>
                  </div>
                </div>
              )}
              {selectedEvent.telefono && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p>{selectedEvent.telefono}</p>
                  </div>
                </div>
              )}
              {selectedEvent.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{selectedEvent.email}</p>
                  </div>
                </div>
              )}
            </div>
            
            {selectedEvent.descripcion && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-sm mt-1">{selectedEvent.descripcion}</p>
              </div>
            )}
            
            <div className="mt-4">
              <Button
                onClick={() => marcarCompletada(selectedEvent.id)}
                className="w-full bg-[#EE970D] hover:bg-[#d88609] text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar como completada
              </Button>
            </div>
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
