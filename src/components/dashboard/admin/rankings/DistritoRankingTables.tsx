
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
import { Eye, Medal, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface DistritoRankingTablesProps {
  distritoRankings: {[key: string]: ClienteRanking[]};
  limit?: number;
  sortOrder?: "asc" | "desc";
  onDeleteCliente?: (clienteId: string) => Promise<boolean>;
}

const DistritoRankingTables: React.FC<DistritoRankingTablesProps> = ({ 
  distritoRankings, 
  limit = 10,
  sortOrder = "desc",
  onDeleteCliente
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleVerHistorial = (clienteId: string) => {
    navigate(`/admin/clientes/historial/${clienteId}`);
  };

  const handleDeleteCliente = async (clienteId: string) => {
    if (onDeleteCliente) {
      const success = await onDeleteCliente(clienteId);
      if (success) {
        toast.success("Cliente eliminado del ranking");
      }
    }
  };

  // Filter districts by search term
  const filteredDistricts = Object.keys(distritoRankings).filter(
    distrito => distrito.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort();

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por distrito..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDistricts.length === 0 ? (
        <div className="text-center py-8 bg-blue-50/30 rounded-lg">
          <MapPin className="h-12 w-12 text-blue-300 mx-auto mb-2" />
          <p className="text-muted-foreground">No se encontraron distritos con el término de búsqueda.</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filteredDistricts.map((distrito) => {
            // Sort clients based on sortOrder
            const clientesOrdenados = [...distritoRankings[distrito]].sort((a, b) => {
              return sortOrder === "desc" 
                ? b.litrosTotales - a.litrosTotales 
                : a.litrosTotales - b.litrosTotales;
            }).slice(0, limit);

            const totalLitrosDistrito = clientesOrdenados.reduce(
              (total, cliente) => total + cliente.litrosTotales, 
              0
            );

            return (
              <AccordionItem 
                key={distrito} 
                value={distrito}
                className="border bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-blue-50/50 data-[state=open]:bg-blue-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{distrito}</h3>
                        <p className="text-xs text-muted-foreground">
                          {clientesOrdenados.length} clientes · {totalLitrosDistrito.toFixed(1)} litros totales
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto bg-blue-50/20">
                    <Table>
                      <TableHeader className="bg-blue-50">
                        <TableRow>
                          <TableHead className="w-16 text-center font-medium">#</TableHead>
                          <TableHead className="font-medium">Cliente</TableHead>
                          <TableHead className="font-medium">Tipo</TableHead>
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
                              className={`transition-colors hover:bg-blue-50/30 ${index < 3 ? 'bg-blue-50/20' : ''}`}
                            >
                              <TableCell className="text-center">
                                {index < 3 ? (
                                  <div className="flex items-center justify-center">
                                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 w-8 h-8 rounded-full flex items-center justify-center">
                                      <Medal className={`h-4 w-4 ${index === 0 ? 'text-blue-700' : index === 1 ? 'text-blue-600' : 'text-blue-500'}`} />
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
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                  {cliente.tipo || "No especificado"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">{cliente.recogidasCount}</TableCell>
                              <TableCell className="text-right">
                                <div className="font-medium font-mono">{cliente.litrosTotales.toFixed(1)} L</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVerHistorial(cliente.id)}
                                    className="bg-white hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {onDeleteCliente && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteCliente(cliente.id)}
                                      className="bg-white hover:bg-red-50 hover:text-red-700 border-red-200"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
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

export default DistritoRankingTables;
