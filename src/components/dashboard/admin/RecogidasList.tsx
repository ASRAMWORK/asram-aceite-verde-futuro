
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
import { Check, Eye } from 'lucide-react';
import { format } from 'date-fns';
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
  recogidas: any[];
  onCompleteRecogida?: (id: string) => void;
  showActions?: boolean;
}

const RecogidasList = ({ recogidas, onCompleteRecogida, showActions = true }: RecogidasListProps) => {
  const [selectedRecogidaId, setSelectedRecogidaId] = React.useState<string | null>(null);

  const handleCompleteClick = (id: string) => {
    setSelectedRecogidaId(id);
  };

  const confirmComplete = () => {
    if (selectedRecogidaId && onCompleteRecogida) {
      onCompleteRecogida(selectedRecogidaId);
    }
    setSelectedRecogidaId(null);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recogidas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No hay recogidas {showActions ? 'pendientes' : 'completadas'}
              </TableCell>
            </TableRow>
          ) : (
            recogidas.map((recogida) => (
              <TableRow key={recogida.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">
                  {recogida.id.substring(0, 6)}
                </TableCell>
                <TableCell>
                  {recogida.fecha ? format(new Date(recogida.fecha), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>
                <TableCell>{recogida.distrito}</TableCell>
                <TableCell>{recogida.direccion}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      recogida.completada 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {recogida.completada ? 'Completada' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalles
                    </Button>
                    
                    {showActions && !recogida.completada && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() => handleCompleteClick(recogida.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
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
