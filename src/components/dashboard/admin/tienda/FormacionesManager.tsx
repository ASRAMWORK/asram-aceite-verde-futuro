
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
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Mock data
const formaciones = [
  {
    id: 1,
    nombre: "Curso online: Economía circular",
    precio: 49.99,
    plazasOcupadas: 12,
    plazasTotal: 25,
    fechaInicio: "15/05/2024",
    activo: true,
  },
  {
    id: 2,
    nombre: "Taller: Elaboración de jabón casero",
    precio: 35.00,
    plazasOcupadas: 8,
    plazasTotal: 15,
    fechaInicio: "22/05/2024",
    activo: true,
  },
  {
    id: 3,
    nombre: "Formación para empresas: Gestión de residuos",
    precio: 199.99,
    plazasOcupadas: 5,
    plazasTotal: 10,
    fechaInicio: "10/06/2024",
    activo: true,
  },
  {
    id: 4,
    nombre: "Curso: Agricultura urbana sostenible",
    precio: 45.00,
    plazasOcupadas: 0,
    plazasTotal: 20,
    fechaInicio: "01/07/2024",
    activo: false,
  }
];

const FormacionesManager = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  return (
    <Card>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre de la formación</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Plazas</TableHead>
              <TableHead>Fecha de inicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formaciones.map((formacion) => (
              <TableRow key={formacion.id}>
                <TableCell className="font-medium">{formacion.id}</TableCell>
                <TableCell>{formacion.nombre}</TableCell>
                <TableCell className="text-right">{formacion.precio.toFixed(2)}€</TableCell>
                <TableCell className="text-right">
                  {formacion.plazasOcupadas}/{formacion.plazasTotal}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {formacion.fechaInicio}
                  </div>
                </TableCell>
                <TableCell>
                  {formacion.activo ? (
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
            disabled={formaciones.length < itemsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FormacionesManager;
