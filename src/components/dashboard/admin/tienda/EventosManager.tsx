
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const eventos = [
  {
    id: 1,
    nombre: "Jornada de limpieza: Río Manzanares",
    precio: 0,
    gratuito: true,
    plazasOcupadas: 25,
    plazasTotal: 50,
    fecha: "18/06/2024",
    lugar: "Madrid Río",
    activo: true,
  },
  {
    id: 2,
    nombre: "Feria de Sostenibilidad",
    precio: 5.00,
    gratuito: false,
    plazasOcupadas: 120,
    plazasTotal: 200,
    fecha: "30/06/2024",
    lugar: "Plaza Mayor",
    activo: true,
  },
  {
    id: 3,
    nombre: "Conferencia: El futuro del reciclaje urbano",
    precio: 10.00,
    gratuito: false,
    plazasOcupadas: 45,
    plazasTotal: 100,
    fecha: "15/07/2024",
    lugar: "Centro Cultural Conde Duque",
    activo: true,
  },
  {
    id: 4,
    nombre: "Proyección documental: Océanos de plástico",
    precio: 0,
    gratuito: true,
    plazasOcupadas: 30,
    plazasTotal: 80,
    fecha: "25/07/2024",
    lugar: "Cineteca Madrid",
    activo: false,
  }
];

const EventosManager = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  return (
    <Card>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre del evento</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Asistencia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Lugar</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell className="font-medium">{evento.id}</TableCell>
                <TableCell>{evento.nombre}</TableCell>
                <TableCell>
                  {evento.gratuito ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Gratuito
                    </Badge>
                  ) : (
                    <span>{evento.precio.toFixed(2)}€</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {evento.plazasOcupadas}/{evento.plazasTotal}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {evento.fecha}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {evento.lugar}
                  </div>
                </TableCell>
                <TableCell>
                  {evento.activo ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span>Inactivo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="text-sm">
            Página {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={eventos.length < itemsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventosManager;
