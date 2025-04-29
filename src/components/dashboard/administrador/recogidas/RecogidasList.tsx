import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Check, Eye } from 'lucide-react';
import { Recogida } from '@/types';
import { format, isValid } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecogidasListProps {
  recogidas: Recogida[];
  onCompleteRecogida?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const RecogidasList: React.FC<RecogidasListProps> = ({ 
  recogidas, 
  onCompleteRecogida,
  onViewDetails
}) => {
  const [selectedRecogidaId, setSelectedRecogidaId] = React.useState<string | null>(null);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!dateObj || !isValid(dateObj)) return "-";
      return format(dateObj, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const handleComplete = (id: string) => {
    setSelectedRecogidaId(id);
  };

  const confirmComplete = () => {
    if (selectedRecogidaId && onCompleteRecogida) {
      onCompleteRecogida(selectedRecogidaId);
    }
    setSelectedRecogidaId(null);
  };

  const getBadgeColor = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'realizada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'programado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dirección</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recogidas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No hay recogidas programadas
              </TableCell>
            </TableRow>
          ) : (
            recogidas.map((recogida) => (
              <TableRow key={recogida.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {recogida.cliente || recogida.nombreContacto}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> 
                      {recogida.direccion || recogida.direccionRecogida}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    {formatDate(recogida.fecha)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    {recogida.horaRecogida || recogida.hora || recogida.horaInicio || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  {recogida.distrito || "-"} / {recogida.barrio || "-"}
                </TableCell>
                <TableCell>
                  <Badge className={getBadgeColor(recogida.estado || (recogida.completada ? 'realizada' : 'pendiente'))}>
                    {recogida.estado ? 
                      (recogida.estado.charAt(0).toUpperCase() + recogida.estado.slice(1)) : 
                      (recogida.completada ? 'Completada' : 'Pendiente')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                      onClick={() => onViewDetails && onViewDetails(recogida.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalles
                    </Button>
                  
                    {!recogida.completada && onCompleteRecogida && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleComplete(recogida.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!selectedRecogidaId} onOpenChange={() => setSelectedRecogidaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar recogida</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea marcar esta recogida como completada?
              Esta acción moverá el registro a recogidas realizadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmComplete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecogidasList;
