
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Recogida } from '@/types';

interface RecogidasListProps {
  recogidas: Recogida[];
  onViewDetails?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const RecogidasList: React.FC<RecogidasListProps> = ({ 
  recogidas,
  onViewDetails,
  onComplete
}) => {
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Sin fecha";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recogidas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No hay recogidas para mostrar
              </TableCell>
            </TableRow>
          ) : (
            recogidas.map((recogida) => (
              <TableRow key={recogida.id}>
                <TableCell>{recogida.cliente}</TableCell>
                <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
                <TableCell>{recogida.direccionRecogida || recogida.direccion}</TableCell>
                <TableCell>
                  <Badge variant={recogida.estadoRecogida === "completada" || recogida.completada ? "default" : "outline"} 
                         className={recogida.estadoRecogida === "completada" || recogida.completada ? "bg-green-500 hover:bg-green-600" : ""}>
                    {recogida.estadoRecogida === "completada" || recogida.completada ? "Completada" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {onViewDetails && (
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails(recogida.id)}>
                        <Info className="h-4 w-4 mr-1" />
                        Detalles
                      </Button>
                    )}
                    {onComplete && !recogida.completada && (
                      <Button variant="outline" size="sm" onClick={() => onComplete(recogida.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecogidasList;
