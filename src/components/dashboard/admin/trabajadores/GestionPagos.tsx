
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import type { TrabajadorPago } from "@/types";

interface GestionPagosProps {
  trabajadorId: string;
  pagos: TrabajadorPago[];
  onAddPago: (pago: Omit<TrabajadorPago, "id" | "createdAt">) => void;
  onUpdatePago: (id: string, data: Partial<TrabajadorPago>) => void;
}

const GestionPagos: React.FC<GestionPagosProps> = ({
  trabajadorId,
  pagos,
  onAddPago,
  onUpdatePago,
}) => {
  const [mes, setMes] = React.useState<string>(new Date().toISOString().slice(0, 7));
  
  const pagosFiltrados = pagos.filter(pago => 
    pago.fecha.toISOString().slice(0, 7) === mes
  );

  const totalMes = pagosFiltrados.reduce((sum, pago) => 
    sum + (pago.estado === 'pagado' ? pago.cantidad : 0), 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pagos</CardTitle>
        <CardDescription>Registra y gestiona los pagos del trabajador</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="ml-auto font-semibold">
            Total del mes: {totalMes.toFixed(2)}€
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagosFiltrados.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>
                  {new Date(pago.fecha).toLocaleDateString()}
                </TableCell>
                <TableCell>{pago.concepto}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {pago.tipo.charAt(0).toUpperCase() + pago.tipo.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{pago.cantidad.toFixed(2)}€</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      pago.estado === 'pagado' ? 'default' :
                      pago.estado === 'pendiente' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (pago.estado === 'pendiente') {
                          onUpdatePago(pago.id, { estado: 'pagado' });
                        }
                      }}
                      disabled={pago.estado !== 'pendiente'}
                    >
                      Marcar como pagado
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay pagos registrados para este mes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GestionPagos;
