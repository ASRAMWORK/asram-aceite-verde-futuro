
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
import { Card } from "@/components/ui/card";

// Mock data
const talleres = [
  {
    id: 1,
    nombre: "Taller infantil: Pequeños recicladores",
    precio: 15.00,
    plazasOcupadas: 10,
    plazasTotal: 15,
    fecha: "05/06/2024",
    lugar: "Centro Cultural Las Rozas",
    activo: true,
  },
  {
    id: 2,
    nombre: "Taller familiar: Huerto urbano",
    precio: 25.00,
    plazasOcupadas: 8,
    plazasTotal: 20,
    fecha: "12/06/2024",
    lugar: "Parque del Retiro",
    activo: true,
  },
  {
    id: 3,
    nombre: "Taller: Conservación del agua",
    precio: 18.00,
    plazasOcupadas: 5,
    plazasTotal: 12,
    fecha: "20/06/2024",
    lugar: "Centro Cívico Vallecas",
    activo: false,
  }
];

const TalleresManager = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  return (
    <Card>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre del taller</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Plazas</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Lugar</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {talleres.map((taller) => (
              <TableRow key={taller.id}>
                <TableCell className="font-medium">{taller.id}</TableCell>
                <TableCell>{taller.nombre}</TableCell>
                <TableCell className="text-right">{taller.precio.toFixed(2)}€</TableCell>
                <TableCell className="text-right">
                  {taller.plazasOcupadas}/{taller.plazasTotal}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {taller.fecha}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {taller.lugar}
                  </div>
                </TableCell>
                <TableCell>
                  {taller.activo ? (
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
            disabled={talleres.length < itemsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TalleresManager;
