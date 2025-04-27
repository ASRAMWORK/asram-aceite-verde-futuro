
import React from 'react';
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
import { Calendar, Mail, Phone, Users } from "lucide-react";
import type { TallerProgramado } from "@/types";

// Mock data - replace with actual data from your backend
const talleresProgramados: TallerProgramado[] = [
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

const TalleresProgramados = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Talleres Programados</CardTitle>
      </CardHeader>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {talleresProgramados.map((taller) => (
                <TableRow key={taller.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {taller.fechaTaller.toLocaleDateString()}
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
                            ? 'secondary'  // Changed from 'success' to 'secondary'
                            : 'destructive'
                      }
                    >
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
  );
};

export default TalleresProgramados;
