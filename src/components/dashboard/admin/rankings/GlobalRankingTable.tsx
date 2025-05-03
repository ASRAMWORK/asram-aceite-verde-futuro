
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
import { Eye, Trophy, Medal, Award, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { ClienteRanking } from '@/hooks/useClientesRanking';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GlobalRankingTableProps {
  clientes: ClienteRanking[];
  limit?: number;
  sortOrder?: "asc" | "desc";
}

const GlobalRankingTable: React.FC<GlobalRankingTableProps> = ({ 
  clientes, 
  limit = 10, 
  sortOrder = "desc" 
}) => {
  const navigate = useNavigate();
  
  // Sort clients based on sortOrder
  const sortedClientes = [...clientes].sort((a, b) => {
    return sortOrder === "desc" 
      ? b.litrosTotales - a.litrosTotales 
      : a.litrosTotales - b.litrosTotales;
  }).slice(0, limit);

  const handleVerHistorial = (clienteId: string) => {
    navigate(`/admin/clientes/${clienteId}`);
  };

  // Function to render rank badge with appropriate styling
  const renderRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-300 blur-sm opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-amber-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-5 w-5 text-yellow-800" />
            </div>
          </div>
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-300 blur-sm opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-r from-gray-300 to-gray-200 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              <Medal className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-200 blur-sm opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-r from-amber-600 to-amber-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              <Award className="h-5 w-5 text-amber-100" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Badge 
          variant="outline" 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white"
        >
          {index + 1}
        </Badge>
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-amber-50">
          <TableRow>
            <TableHead className="w-20 text-center font-medium">Posición</TableHead>
            <TableHead className="font-medium">Cliente</TableHead>
            <TableHead className="font-medium">Distrito</TableHead>
            <TableHead className="font-medium">Tipo</TableHead>
            <TableHead className="text-right font-medium">Recogidas</TableHead>
            <TableHead className="text-right font-medium">Litros</TableHead>
            <TableHead className="text-right font-medium w-32">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            sortedClientes.map((cliente, index) => (
              <TableRow 
                key={cliente.id} 
                className={`
                  transition-colors hover:bg-amber-50/30
                  ${index < 3 ? 'bg-amber-50/20' : ''}
                `}
              >
                <TableCell className="text-center">
                  {renderRankBadge(index)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{cliente.nombre}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-48">{cliente.direccion || "Sin dirección"}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {cliente.distrito || "No especificado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {cliente.tipo || "No especificado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{cliente.recogidasCount}</TableCell>
                <TableCell className="text-right">
                  <div className="font-medium font-mono">{cliente.litrosTotales.toFixed(1)} L</div>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerHistorial(cliente.id)}
                          className="ml-auto bg-white hover:bg-amber-50 hover:text-amber-700 border-amber-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver historial de recogidas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
