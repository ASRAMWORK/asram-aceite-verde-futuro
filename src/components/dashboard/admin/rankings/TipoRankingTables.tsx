
import React, { useState } from 'react';
import { ClienteRanking } from '@/hooks/useClientesRanking';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Eye, Medal, Droplet } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TipoRankingTablesProps {
  tipoClienteRankings: {[key: string]: ClienteRanking[]};
  limit?: number;
  sortOrder?: "asc" | "desc";
}

const TipoRankingTables: React.FC<TipoRankingTablesProps> = ({ 
  tipoClienteRankings,
  limit = 10,
  sortOrder = "desc"
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleVerHistorial = (clienteId: string) => {
    navigate(`/admin/clientes/${clienteId}`);
  };

  // Filter types by search term
  const filteredTypes = Object.keys(tipoClienteRankings).filter(
    tipo => tipo.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort();

  // Get color by client type
  const getTypeColor = (tipo: string) => {
    const typeColors: {[key: string]: {bg: string, text: string, border: string}} = {
      'restaurante': {bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200'},
      'hotel': {bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200'},
      'comercial': {bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200'},
      'asociacion': {bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200'},
      'escolar': {bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200'},
      'comunidad': {bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200'},
      'punto_verde': {bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200'},
      'default': {bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200'}
    };

    // Normalize the tipo to check for matches
    const tipoLower = tipo.toLowerCase();
    
    // Check if the tipo contains any of the keys
    for (const key of Object.keys(typeColors)) {
      if (tipoLower.includes(key)) {
        return typeColors[key];
      }
    }
    
    return typeColors['default'];
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por tipo de cliente..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTypes.length === 0 ? (
        <div className="text-center py-8 bg-green-50/30 rounded-lg">
          <Droplet className="h-12 w-12 text-green-300 mx-auto mb-2" />
          <p className="text-muted-foreground">No se encontraron tipos con el término de búsqueda.</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filteredTypes.map((tipo) => {
            // Sort clients based on sortOrder
            const clientesOrdenados = [...tipoClienteRankings[tipo]].sort((a, b) => {
              return sortOrder === "desc" 
                ? b.litrosTotales - a.litrosTotales 
                : a.litrosTotales - b.litrosTotales;
            }).slice(0, limit);

            const totalLitrosTipo = clientesOrdenados.reduce(
              (total, cliente) => total + cliente.litrosTotales, 
              0
            );

            const typeColor = getTypeColor(tipo);

            return (
              <AccordionItem 
                key={tipo} 
                value={tipo}
                className="border bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className={`px-4 py-3 hover:${typeColor.bg}/50 data-[state=open]:${typeColor.bg}`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`${typeColor.bg} p-2 rounded-full`}>
                        <Droplet className={`h-4 w-4 ${typeColor.text}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{tipo}</h3>
                        <p className="text-xs text-muted-foreground">
                          {clientesOrdenados.length} clientes · {totalLitrosTipo.toFixed(1)} litros totales
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto bg-green-50/10">
                    <Table>
                      <TableHeader className={`${typeColor.bg}/50`}>
                        <TableRow>
                          <TableHead className="w-16 text-center font-medium">#</TableHead>
                          <TableHead className="font-medium">Cliente</TableHead>
                          <TableHead className="font-medium">Distrito</TableHead>
                          <TableHead className="text-right font-medium">Recogidas</TableHead>
                          <TableHead className="text-right font-medium">Litros</TableHead>
                          <TableHead className="text-right font-medium w-32">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientesOrdenados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No hay datos disponibles
                            </TableCell>
                          </TableRow>
                        ) : (
                          clientesOrdenados.map((cliente, index) => (
                            <TableRow 
                              key={cliente.id} 
                              className={`transition-colors hover:${typeColor.bg}/30 ${index < 3 ? `${typeColor.bg}/20` : ''}`}
                            >
                              <TableCell className="text-center">
                                {index < 3 ? (
                                  <div className="flex items-center justify-center">
                                    <div className={`bg-gradient-to-r from-${typeColor.bg} to-${typeColor.bg}/50 w-8 h-8 rounded-full flex items-center justify-center`}>
                                      <Medal className={`h-4 w-4 ${typeColor.text}`} />
                                    </div>
                                  </div>
                                ) : (
                                  <Badge 
                                    variant="outline" 
                                    className="bg-white"
                                  >
                                    {index + 1}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{cliente.nombre}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-40">{cliente.direccion || "Sin dirección"}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {cliente.distrito || "No especificado"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">{cliente.recogidasCount}</TableCell>
                              <TableCell className="text-right">
                                <div className="font-medium font-mono">{cliente.litrosTotales.toFixed(1)} L</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerHistorial(cliente.id)}
                                  className={`ml-auto bg-white hover:${typeColor.bg} hover:${typeColor.text} ${typeColor.border}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default TipoRankingTables;
