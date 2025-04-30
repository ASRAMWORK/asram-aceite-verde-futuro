
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar,
  CalendarPlus,
  CheckCircle,
  Clock,
  Edit,
  School,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { useAlianzaVerde } from '@/hooks/useAlianzaVerde';
import { useTalleresProgramados } from '@/hooks/useTalleresProgramados';
import TallerForm from './TallerForm';
import { TallerProgramado, AlianzaVerde } from '@/types';

const ProgramarTalleres = () => {
  const [open, setOpen] = useState(false);
  const { alianzas } = useAlianzaVerde();
  const { 
    talleresProgramados, 
    addTallerProgramado, 
    updateTallerProgramado 
  } = useTalleresProgramados();
  
  const talleresPendientes = talleresProgramados.filter(taller => !taller.completado);
  const talleresCompletados = talleresProgramados.filter(taller => taller.completado);

  const handleCreateTaller = async (data: Partial<TallerProgramado>) => {
    try {
      const centro = alianzas.find(a => a.id === data.organizador);
      
      await addTallerProgramado({
        id: '',
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        fecha: data.fecha || new Date(),
        hora: data.hora || '10:00',
        duracion: data.duracion || 60,
        lugar: centro?.nombre || '',
        organizador: data.organizador || '',
        tipo: data.tipo || '',
        responsable: data.responsable || '',
        contactoTelefono: data.contactoTelefono || '',
        contactoEmail: data.contactoEmail || '',
        aforo: data.aforo || 0,
        participantes: data.participantes || 0,
        gratuito: data.gratuito || true,
        precio: data.precio || 0,
        completado: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      toast.success("Taller programado correctamente");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al programar el taller");
    }
  };

  const completarTaller = async (id: string) => {
    try {
      await updateTallerProgramado(id, {
        completado: true,
        updatedAt: new Date()
      });
      toast.success("Taller marcado como completado");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el taller");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Programación de Talleres</h2>
          <p className="text-muted-foreground">
            Gestiona los talleres y eventos para los centros educativos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-700 text-white">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Programar Nuevo Taller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Programar Nuevo Taller</DialogTitle>
            </DialogHeader>
            <TallerForm 
              centros={alianzas} 
              onSubmit={handleCreateTaller} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList>
          <TabsTrigger value="proximos">Próximos Talleres</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proximos" className="space-y-4 mt-4">
          {talleresPendientes.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay talleres programados</p>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={() => setOpen(true)}
              >
                Programar un taller
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {talleresPendientes.map((taller) => (
                <Card key={taller.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-green-50 p-4 md:w-1/4 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">
                          {format(taller.fecha, 'dd', { locale: es })}
                        </p>
                        <p className="uppercase text-green-600">
                          {format(taller.fecha, 'MMM', { locale: es })}
                        </p>
                        <div className="flex items-center justify-center mt-2 text-green-800">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{taller.hora}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="flex-1 p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            {taller.titulo}
                            <Badge 
                              variant={taller.gratuito ? "outline" : "default"}
                              className="ml-2"
                            >
                              {taller.gratuito ? 'Gratuito' : `${taller.precio}€`}
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <School className="h-4 w-4 mr-1" />
                            {
                              alianzas.find(a => a.id === taller.organizador)?.nombre ||
                              taller.lugar
                            }
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => completarTaller(taller.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Detalles</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li className="flex items-center">
                              <span className="font-medium w-24">Tipo:</span>
                              <span>{taller.tipo}</span>
                            </li>
                            <li className="flex items-center">
                              <span className="font-medium w-24">Responsable:</span>
                              <span>{taller.responsable}</span>
                            </li>
                            <li className="flex items-center">
                              <span className="font-medium w-24">Duración:</span>
                              <span>{taller.duracion} minutos</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Contacto</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li className="flex items-center text-sm">
                              <span className="font-medium w-24">Email:</span>
                              <span>{taller.contactoEmail}</span>
                            </li>
                            <li className="flex items-center text-sm">
                              <span className="font-medium w-24">Teléfono:</span>
                              <span>{taller.contactoTelefono}</span>
                            </li>
                            <li className="flex items-center">
                              <span className="font-medium w-24">Asistentes:</span>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-green-600" />
                                <span>{taller.participantes}/{taller.aforo}</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="historial" className="space-y-4 mt-4">
          {talleresCompletados.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay talleres completados</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {talleresCompletados.map((taller) => (
                <Card key={taller.id} className="overflow-hidden bg-gray-50">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gray-100 p-4 md:w-1/4 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {format(taller.fecha, 'dd', { locale: es })}
                        </p>
                        <p className="uppercase text-gray-500">
                          {format(taller.fecha, 'MMM', { locale: es })}
                        </p>
                        <div className="flex items-center justify-center mt-2 text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{taller.hora}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="flex-1 p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            {taller.titulo}
                            <Badge variant="outline" className="ml-2 bg-gray-100">
                              Completado
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <School className="h-4 w-4 mr-1" />
                            {
                              alianzas.find(a => a.id === taller.organizador)?.nombre ||
                              taller.lugar
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Detalles</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li className="flex items-center">
                              <span className="font-medium w-24">Tipo:</span>
                              <span>{taller.tipo}</span>
                            </li>
                            <li className="flex items-center">
                              <span className="font-medium w-24">Responsable:</span>
                              <span>{taller.responsable}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Resultados</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li className="flex items-center">
                              <span className="font-medium w-24">Asistentes:</span>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-green-600" />
                                <span>{taller.participantes}/{taller.aforo}</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramarTalleres;
