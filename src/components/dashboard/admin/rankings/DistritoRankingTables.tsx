
import React, { useState } from 'react';
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ClienteRanking } from '@/hooks/useClientesRanking';

interface DistritoRankingTablesProps {
  distritoRankings: {[key: string]: ClienteRanking[]};
}

const DistritoRankingTables: React.FC<DistritoRankingTablesProps> = ({ distritoRankings }) => {
  const navigate = useNavigate();
  const [expandedDistritos, setExpandedDistritos] = useState<string[]>([]);

  const handleVerHistorial = (clienteId: string) => {
    navigate(`/admin/clientes/${clienteId}`);
  };

  return (
    <div>
      {Object.keys(distritoRankings).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay datos disponibles por distritos
        </div>
      ) : (
        <Accordion type="multiple" value={expandedDistritos} onValueChange={setExpandedDistritos} className="space-y-4">
          {Object.entries(distritoRankings)
            .sort(([distritoA], [distritoB]) => distritoA.localeCompare(distritoB))
            .map(([distrito, clientes]) => (
              <AccordionItem key={distrito} value={distrito} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-lg">{distrito}</span>
                    <Badge variant="outline" className="ml-2">
                      {clientes.length} clientes
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-16 text-center">#</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead className="text-right">Recogidas</TableHead>
                          <TableHead className="text-right">Litros</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientes.map((cliente, index) => (
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
                            <TableCell className="text-right">{cliente.recogidasCount}</TableCell>
                            <TableCell className="text-right font-medium">{cliente.litrosTotales.toFixed(1)} L</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerHistorial(cliente.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver Historial
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
};

export default DistritoRankingTables;
