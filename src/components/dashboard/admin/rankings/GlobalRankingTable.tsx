
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";
import { ClienteRanking } from '@/hooks/useClientesRanking';

interface GlobalRankingTableProps {
  clientes: ClienteRanking[];
}

const GlobalRankingTable: React.FC<GlobalRankingTableProps> = ({ clientes }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Distrito</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Litros</TableHead>
          <TableHead className="text-right">Recogidas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.slice(0, 50).map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-bold">
              {cliente.ranking && cliente.ranking <= 3 ? (
                <Badge className={`
                  ${cliente.ranking === 1 ? "bg-yellow-500 text-black" : 
                    cliente.ranking === 2 ? "bg-gray-300 text-black" : 
                    "bg-amber-700 text-white"}
                `}>
                  #{cliente.ranking}
                </Badge>
              ) : (
                `#${cliente.ranking}`
              )}
            </TableCell>
            <TableCell>{cliente.nombre}</TableCell>
            <TableCell>{cliente.distrito}</TableCell>
            <TableCell>
              <Badge variant="outline">{cliente.tipo}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                {cliente.litrosTotales.toFixed(1)} L
              </div>
            </TableCell>
            <TableCell className="text-right">{cliente.recogidasCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GlobalRankingTable;
