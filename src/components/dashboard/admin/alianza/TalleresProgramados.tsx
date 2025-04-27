import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, Users, PlusCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TallerProgramado } from "@/types";
import TallerForm from './TallerForm';
import { useAlianzaVerde } from "@/hooks/useAlianzaVerde";

const TalleresProgramados = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { alianzas } = useAlianzaVerde();
  const [activeTab, setActiveTab] = useState<'programados' | 'completados'>('programados');

  // Mock data - replace with actual data from your backend
  const talleres: TallerProgramado[] = [
    {
      id: "1",
      centroId: "1",
      nombreCentro: "CEIP García Lorca",
      direccion: "Calle del Colegio 1, Madrid",
      tipoTaller: "Reciclaje Creativo",
      fechaTaller: new Date("2025-05-15"),
      numAlumnos: 25,
      contacto: "María García",
      telefono: "912345678",
      email: "contacto@garcialorca.edu",
      estado: "programado"
    },
    {
      id: "2",
      centroId: "2",
      nombreCentro: "IES Ramiro de Maeztu",
      direccion: "Calle de Serrano 127, Madrid",
      tipoTaller: "Mini Huerto Escolar",
      fechaTaller: new Date("2025-05-22"),
      numAlumnos: 30,
      contacto: "Juan Pérez",
      telefono: "913456789",
      email: "contacto@ramirodemaeztu.edu",
      estado: "programado"
    }
  ];

  const handleSubmitTaller = (data: Partial<TallerProgramado>) => {
    console.log('Nuevo taller:', data);
    setIsDialogOpen(false);
    // Aquí implementarías la lógica para guardar el taller
  };

  const handleCompletarTaller = (tallerId: string) => {
    console.log('Marcar taller como completado:', tallerId);
    // Aquí implementarías la lógica para marcar como completado
  };

  const talleresFiltrados = talleres.filter(taller => 
    activeTab === 'programados' 
      ? taller.estado === 'programado'
      : taller.estado === 'completado'
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Talleres Programados</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-asram hover:bg-asram-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Programar Taller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Programar Nuevo Taller</DialogTitle>
              <DialogDescription>
                Complete los detalles para agendar un nuevo taller
              </DialogDescription>
            </DialogHeader>
            <TallerForm 
              centros={alianzas} 
              onSubmit={handleSubmitTaller}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="programados" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="programados"
            onClick={() => setActiveTab('programados')}
          >
            Próximos Talleres
          </TabsTrigger>
          <TabsTrigger 
            value="completados"
            onClick={() => setActiveTab('completados')}
          >
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programados">
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Centro</TableHead>
                      <TableHead>Taller</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Asistentes</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {talleresFiltrados.map((taller) => (
                      <TableRow key={taller.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {new Date(taller.fechaTaller).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{taller.nombreCentro}</TableCell>
                        <TableCell>{taller.tipoTaller}</TableCell>
                        <TableCell>{taller.direccion}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {taller.numAlumnos} alumnos
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{taller.contacto}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {taller.telefono}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {taller.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              taller.estado === 'programado' 
                                ? 'default' 
                                : taller.estado === 'completado' 
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {taller.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {taller.estado === 'programado' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompletarTaller(taller.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Completar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completados">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Talleres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Centro</TableHead>
                      <TableHead>Taller</TableHead>
                      <TableHead>Asistentes</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {talleresFiltrados.map((taller) => (
                      <TableRow key={taller.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {new Date(taller.fechaTaller).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{taller.nombreCentro}</TableCell>
                        <TableCell>{taller.tipoTaller}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {taller.numAlumnos} alumnos
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{taller.contacto}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {taller.telefono}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {taller.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalleresProgramados;
