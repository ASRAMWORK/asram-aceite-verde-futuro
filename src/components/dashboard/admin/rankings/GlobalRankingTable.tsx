
import React from 'react';
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
import { Eye, Trophy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { ClienteRanking } from '@/hooks/useClientesRanking';

interface GlobalRankingTableProps {
  clientes: ClienteRanking[];
}

const GlobalRankingTable: React.FC<GlobalRankingTableProps> = ({ clientes }) => {
  const navigate = useNavigate();

  const handleVerHistorial = (clienteId: string) => {
    navigate(`/admin/clientes/${clienteId}`);
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center">#</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Recogidas</TableHead>
            <TableHead className="text-right">Litros</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((cliente, index) => (
              <TableRow key={cliente.id} className="transition-colors hover:bg-muted/30">
                <TableCell className="text-center font-medium">
                  {index < 3 ? (
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' : 
                          'bg-amber-100 text-amber-700'
                      }
                    `}>
                      <Trophy className={`h-4 w-4 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-500' : 
                        'text-amber-500'
                      }`} />
                    </span>
                  ) : (
                    <Badge variant="outline" className="px-2">
                      {index + 1}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{cliente.nombre}</div>
                  <div className="text-xs text-muted-foreground">{cliente.direccion}</div>
                </TableCell>
                <TableCell>{cliente.distrito}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{cliente.tipo}</Badge>
                </TableCell>
                <TableCell className="text-right">{cliente.recogidasCount}</TableCell>
                <TableCell className="text-right font-medium">{cliente.litrosTotales.toFixed(1)} L</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerHistorial(cliente.id)}
                    className="ml-auto"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Historial
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GlobalRankingTable;
