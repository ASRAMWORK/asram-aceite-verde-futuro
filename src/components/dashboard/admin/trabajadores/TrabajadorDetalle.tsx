import React, { useState } from "react";
import { User, Phone, Mail, Calendar, Briefcase, MapPin, Clock, Truck, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Trabajador } from "@/types";
import { useTurnos } from "@/hooks/useTurnos";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useIncidencias } from "@/hooks/useIncidencias";
import { useRutas } from "@/hooks/useRutas";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrabajadorDetalleProps {
  trabajador: Trabajador;
  onEdit: () => void;
}

const TrabajadorDetalle: React.FC<TrabajadorDetalleProps> = ({ trabajador, onEdit }) => {
  const { turnos, getTurnosPorTrabajador } = useTurnos();
  const { vehiculos } = useVehiculos();
  const { incidencias, getIncidenciasPorTrabajador } = useIncidencias();
  const { rutas } = useRutas();
  
  const [activeTab, setActiveTab] = useState("informacion");
  
  const turnosTrabajador = getTurnosPorTrabajador(trabajador.id);
  const incidenciasTrabajador = getIncidenciasPorTrabajador(trabajador.id);
  const vehiculoAsignado = vehiculos.find(v => v.id === trabajador.vehiculoAsignado);
  
  let rutasAsignadasArray: string[] = [];
  if (Array.isArray(trabajador.rutasAsignadas)) {
    rutasAsignadasArray = trabajador.rutasAsignadas;
  } else if (typeof trabajador.rutasAsignadas === 'string') {
    rutasAsignadasArray = [trabajador.rutasAsignadas];
  }
  
  const rutasAsignadas = rutas.filter(r => 
    rutasAsignadasArray.includes(r.id)
  );

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-ES');
  };

  const performanceData = [
    { mes: 'Ene', litros: 1200, incidencias: 2 },
    { mes: 'Feb', litros: 1500, incidencias: 1 },
    { mes: 'Mar', litros: 1300, incidencias: 3 },
    { mes: 'Abr', litros: 1700, incidencias: 0 },
    { mes: 'May', litros: 1400, incidencias: 1 },
    { mes: 'Jun', litros: 1600, incidencias: 2 },
  ];
  
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={trabajador.foto} alt={`${trabajador.nombre} ${trabajador.apellidos}`} />
          <AvatarFallback className="text-lg">
            {trabajador.nombre.charAt(0)}{trabajador.apellidos.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-3xl font-bold pb-2">{trabajador.nombre} {trabajador.apellido}</h2>
            <Badge variant={trabajador.activo ? "default" : "secondary"} className={
              trabajador.activo ? "bg-green-100 text-green-800 w-fit" : "bg-red-100 text-red-800 w-fit"
            }>
              {trabajador.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {trabajador.roles && trabajador.roles.map((rol) => (
              <Badge key={rol} variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                {rol.charAt(0).toUpperCase() + rol.slice(1)}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <div className="text-muted-foreground">{trabajador.email} | {trabajador.apellido}</div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{trabajador.telefono}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Alta: {formatDate(trabajador.fechaAlta || trabajador.fechaContratacion)}</span>
            </div>
          </div>
        </div>
        
        <Button onClick={onEdit} className="bg-asram">
          Editar Perfil
        </Button>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
          <TabsTrigger value="desempeno">Desempeño</TabsTrigger>
          <TabsTrigger value="documentacion">Documentación</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informacion" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos Personales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">DNI/NIE</div>
                  <div className="text-gray-700 truncate">{trabajador.dni}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Fecha de nacimiento</div>
                  <div className="text-gray-700 truncate">{trabajador.fechaNacimiento ? format(new Date(trabajador.fechaNacimiento), 'dd/MM/yyyy') : '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Dirección</div>
                  <div className="font-medium">{trabajador.direccion}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Laboral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Tipo de contrato</div>
                  <div className="text-gray-700 truncate">{trabajador.tipoContrato || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Tipo de jornada</div>
                  <div className="text-gray-700 truncate">{trabajador.tipoJornada || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Fecha de alta</div>
                  <div className="text-gray-700 truncate">{trabajador.fechaAlta ? format(new Date(trabajador.fechaAlta), 'dd/MM/yyyy') : '-'}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehículo Asignado</CardTitle>
              </CardHeader>
              <CardContent>
                {vehiculoAsignado ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Matrícula</div>
                      <div className="font-medium">{vehiculoAsignado.matricula}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Modelo</div>
                      <div className="font-medium">{vehiculoAsignado.modelo}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Tipo</div>
                      <div className="font-medium">{vehiculoAsignado.tipo}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Estado</div>
                      <Badge variant="outline" className={
                        vehiculoAsignado.estado === 'disponible' ? "bg-green-100 text-green-800" :
                        vehiculoAsignado.estado === 'en_ruta' ? "bg-blue-100 text-blue-800" :
                        vehiculoAsignado.estado === 'mantenimiento' ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {vehiculoAsignado.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No tiene vehículo asignado</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rutas Asignadas</CardTitle>
              </CardHeader>
              <CardContent>
                {rutasAsignadas.length > 0 ? (
                  <div className="space-y-4">
                    {rutasAsignadas.map((ruta) => (
                      <div key={ruta.id} className="flex items-start gap-2 border-b last:border-0 pb-2">
                        <MapPin className="h-5 w-5 text-asram mt-0.5" />
                        <div>
                          <div className="font-medium">{ruta.nombre}</div>
                          <div className="text-sm text-gray-500">{ruta.distrito} - {Array.isArray(ruta.barrios) ? ruta.barrios.join(', ') : ruta.barrios}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No tiene rutas asignadas</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="horarios" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Horarios y Turnos</CardTitle>
              <CardDescription>
                Calendario semanal con los turnos asignados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {turnosTrabajador.length > 0 ? (
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const dayTurnos = turnosTrabajador.filter(t => t.dia.toLowerCase() === day.toLowerCase());
                    if (dayTurnos.length === 0) return null;
                    
                    return (
                      <div key={day} className="border rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">{day}</div>
                        <div className="space-y-2">
                          {dayTurnos.map((turno) => {
                            const rutaAsignada = rutas.find(r => r.id === turno.rutaId);
                            return (
                              <div key={turno.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>{turno.horaInicio} - {turno.horaFin}</span>
                                </div>
                                {rutaAsignada && (
                                  <Badge variant="outline" className="bg-blue-50">
                                    {rutaAsignada.nombre}
                                  </Badge>
                                )}
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
                  No hay turnos asignados para este trabajador
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="desempeno" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Litros Recogidos</CardTitle>
                <CardDescription>
                  Total de litros de aceite recogidos por mes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="litros" 
                      name="Litros" 
                      stroke="#8b5cf6" 
                      fill="#c4b5fd" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Incidencias</CardTitle>
                <CardDescription>
                  Número de incidencias por mes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar 
                      dataKey="incidencias" 
                      name="Incidencias" 
                      fill="#f59e0b" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Incidencias Reportadas</CardTitle>
              <CardDescription>
                Listado de incidencias relacionadas con el trabajador
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incidenciasTrabajador.length > 0 ? (
                <div className="space-y-4">
                  {incidenciasTrabajador.map((incidencia) => (
                    <div key={incidencia.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium capitalize">{incidencia.tipo.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-500">{formatDate(incidencia.fecha)}</div>
                        </div>
                        <Badge variant="outline" className={
                          incidencia.estado === 'abierta' ? "bg-red-100 text-red-800" :
                          incidencia.estado === 'en_proceso' ? "bg-amber-100 text-amber-800" :
                          "bg-green-100 text-green-800"
                        }>
                          {incidencia.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-2">{incidencia.descripcion}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay incidencias reportadas para este trabajador
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentacion" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentación</CardTitle>
              <CardDescription>
                Documentos y certificados del trabajador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Módulo de documentación en desarrollo</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  Próximamente podrás gestionar los documentos del trabajador como contratos, certificados médicos y formación completada.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historial" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Acciones</CardTitle>
              <CardDescription>
                Registro de cambios y acciones relacionadas con el trabajador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Módulo de historial en desarrollo</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  Próximamente podrás ver un registro de todas las acciones realizadas sobre el perfil del trabajador.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrabajadorDetalle;
