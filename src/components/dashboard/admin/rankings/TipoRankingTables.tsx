
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";
import { ClienteRanking } from '@/hooks/useClientesRanking';

interface TipoRankingTablesProps {
  tipoClienteRankings: {[key: string]: ClienteRanking[]};
}

const TipoRankingTables: React.FC<TipoRankingTablesProps> = ({ tipoClienteRankings }) => {
  return (
    <div className="space-y-6">
      {Object.keys(tipoClienteRankings).sort().map(tipo => (
        <div key={tipo} className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            Tipo: {tipo}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead className="text-right">Litros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipoClienteRankings[tipo].slice(0, 10).map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-bold">
                    {cliente.rankingTipo && cliente.rankingTipo <= 3 ? (
                      <Badge className={`
                        ${cliente.rankingTipo === 1 ? "bg-yellow-500 text-black" : 
                          cliente.rankingTipo === 2 ? "bg-gray-300 text-black" : 
                          "bg-amber-700 text-white"}
                      `}>
                        #{cliente.rankingTipo}
                      </Badge>
                    ) : (
                      `#${cliente.rankingTipo}`
                    )}
                  </TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.distrito}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                      {cliente.litrosTotales.toFixed(1)} L
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default TipoRankingTables;
