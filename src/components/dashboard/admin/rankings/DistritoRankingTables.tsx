
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Droplet, MapPin } from "lucide-react";
import { ClienteRanking } from '@/hooks/useClientesRanking';

interface DistritoRankingTablesProps {
  distritoRankings: {[key: string]: ClienteRanking[]};
}

const DistritoRankingTables: React.FC<DistritoRankingTablesProps> = ({ distritoRankings }) => {
  return (
    <div className="space-y-6">
      {Object.keys(distritoRankings).sort().map(distrito => (
        <div key={distrito} className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Distrito: {distrito}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Litros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distritoRankings[distrito].slice(0, 10).map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-bold">
                    {cliente.rankingDistrito && cliente.rankingDistrito <= 3 ? (
                      <Badge className={`
                        ${cliente.rankingDistrito === 1 ? "bg-yellow-500 text-black" : 
                          cliente.rankingDistrito === 2 ? "bg-gray-300 text-black" : 
                          "bg-amber-700 text-white"}
                      `}>
                        #{cliente.rankingDistrito}
                      </Badge>
                    ) : (
                      `#${cliente.rankingDistrito}`
                    )}
                  </TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
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

export default DistritoRankingTables;
