
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react";

interface ClientesRutaListProps {
  clientes: { id: string; nombre: string; direccion: string; litros?: number }[];
  onUpdateLitros: (clienteId: string, litros: number) => void;
  onComplete?: () => void;
  showComplete?: boolean;
}

export function ClientesRutaList({ 
  clientes, 
  onUpdateLitros,
  onComplete,
  showComplete = false 
}: ClientesRutaListProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Litros Recogidos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {cliente.direccion}
                </div>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={cliente.litros || 0}
                  onChange={(e) => onUpdateLitros(cliente.id, Number(e.target.value))}
                  className="w-24"
                  placeholder="0"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {cliente.litros ? `${cliente.litros}L registrados` : 'Pendiente'}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showComplete && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Finalizar Ruta
          </Button>
        </div>
      )}
    </div>
  );
}
