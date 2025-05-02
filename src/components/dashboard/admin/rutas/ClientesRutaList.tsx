
import React, { useState, useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge";

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
  // Guarda el estado local de los litros para cada cliente
  const [litrosState, setLitrosState] = useState<Record<string, number>>({});
  
  // Inicializa el estado local con los litros actuales de los clientes
  useEffect(() => {
    const initialLitros: Record<string, number> = {};
    clientes.forEach(cliente => {
      initialLitros[cliente.id] = cliente.litros || 0;
    });
    setLitrosState(initialLitros);
  }, [clientes]);

  // Actualiza el estado local y llama al callback del padre
  const handleUpdateLitros = (clienteId: string, litros: number) => {
    setLitrosState(prevState => ({
      ...prevState,
      [clienteId]: litros
    }));
    
    // Propagamos el cambio inmediatamente al componente padre
    onUpdateLitros(clienteId, litros);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Dirección</TableHead>
              <TableHead className="font-semibold w-40">Litros Recogidos</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No hay clientes asignados a esta ruta
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cliente.direccion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={litrosState[cliente.id] || 0}
                      onChange={(e) => handleUpdateLitros(cliente.id, Number(e.target.value))}
                      className="w-28"
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {litrosState[cliente.id] > 0 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                          {litrosState[cliente.id]}L registrados
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showComplete && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Check className="mr-2 h-5 w-5" />
            Finalizar Ruta
          </Button>
        </div>
      )}
    </div>
  );
}
