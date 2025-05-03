
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
import { useIsMobile } from "@/hooks/useIsMobile";
import { mobileTouchTarget } from "@/utils/mobileStyles";

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
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <div className="p-2 md:p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {!isMobile && <TableHead>ID</TableHead>}
              <TableHead className={isMobile ? "text-xs px-2" : ""}>Nombre del evento</TableHead>
              {!isMobile && <TableHead>Precio</TableHead>}
              <TableHead className={`${isMobile ? "text-xs px-1 text-center" : "text-right"}`}>
                {isMobile ? "Plazas" : "Asistencia"}
              </TableHead>
              <TableHead className={isMobile ? "text-xs px-2" : ""}>
                {isMobile ? "Info" : "Fecha"}
              </TableHead>
              {!isMobile && <TableHead>Lugar</TableHead>}
              {!isMobile && <TableHead>Estado</TableHead>}
              <TableHead className={`text-right ${isMobile ? "text-xs px-1" : ""}`}>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id}>
                {!isMobile && (
                  <TableCell className="font-medium">{evento.id}</TableCell>
                )}
                <TableCell className={isMobile ? "text-xs px-2 py-2" : ""}>
                  <div className={isMobile ? "truncate max-w-[150px]" : ""}>
                    {evento.nombre}
                  </div>
                  {isMobile && (
                    <div className="flex items-center mt-1">
                      {evento.gratuito ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1">
                          Gratuito
                        </Badge>
                      ) : (
                        <span className="text-[10px]">{evento.precio.toFixed(2)}€</span>
                      )}
                      <div className="ml-2 flex items-center">
                        {evento.activo ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    {evento.gratuito ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Gratuito
                      </Badge>
                    ) : (
                      <span>{evento.precio.toFixed(2)}€</span>
                    )}
                  </TableCell>
                )}
                <TableCell className={`${isMobile ? "text-xs px-1 text-center py-2" : "text-right"}`}>
                  {evento.plazasOcupadas}/{evento.plazasTotal}
                </TableCell>
                <TableCell className={isMobile ? "text-xs px-2 py-2" : ""}>
                  <div className="flex items-center">
                    <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1 text-gray-500`} />
                    <span>{evento.fecha}</span>
                  </div>
                  {isMobile && (
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                      <span className="truncate max-w-[80px]">{evento.lugar}</span>
                    </div>
                  )}
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {evento.lugar}
                    </div>
                  </TableCell>
                )}
                {!isMobile && (
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
                )}
                <TableCell className={`text-right ${isMobile ? "px-1 py-1" : ""}`}>
                  <div className="flex justify-end gap-1 md:gap-2">
                    {!isMobile && (
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={mobileTouchTarget()}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`text-red-500 ${mobileTouchTarget()}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end p-2 md:p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={mobileTouchTarget()}
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
            className={mobileTouchTarget()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </Card>
  );
};

export default EventosManager;
