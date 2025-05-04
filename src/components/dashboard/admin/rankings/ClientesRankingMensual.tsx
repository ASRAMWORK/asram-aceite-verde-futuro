
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Medal, TrendingUp, Droplets, CalendarDays } from 'lucide-react';
import { Usuario } from '@/types';

interface ClienteConLitros extends Usuario {
  litrosRecogidos: number;
  numeroRecogidas: number;
  litrosMes: number;
  numeroRecogidasMes: number;
}

interface ClientesRankingMensualProps {
  clientesRanking: ClienteConLitros[];
  loading: boolean;
}

const ClientesRankingMensual: React.FC<ClientesRankingMensualProps> = ({ clientesRanking, loading }) => {
  // Obtener el nombre del mes actual
  const nombreMes = useMemo(() => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const fechaActual = new Date();
    return meses[fechaActual.getMonth()];
  }, []);

  const rankingOrdenado = useMemo(() => {
    return [...clientesRanking]
      .filter(c => c.litrosMes > 0) // Solo incluimos clientes con actividad este mes
      .sort((a, b) => b.litrosMes - a.litrosMes)
      .slice(0, 100); // Limitamos a los primeros 100 clientes
  }, [clientesRanking]);

  const renderMedalPosition = (position: number) => {
    switch (position) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="font-mono text-sm text-gray-500">{position}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-t-asram rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <CalendarDays className="h-5 w-5 text-purple-500" />
          <span>Ranking del mes de {nombreMes}</span>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Pos.</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="w-32 text-right">Recogidas</TableHead>
              <TableHead className="w-36 text-right">Litros este mes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankingOrdenado.length > 0 ? (
              rankingOrdenado.map((cliente, index) => (
                <TableRow key={cliente.id} className={index < 3 ? "bg-purple-50" : ""}>
                  <TableCell className="text-center font-medium">
                    {renderMedalPosition(index + 1)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{cliente.nombre}</div>
                    <div className="text-xs text-gray-500">
                      {cliente.direccion && `${cliente.direccion}, `}
                      {cliente.distrito && `${cliente.distrito}`}
                      {cliente.barrio && ` (${cliente.barrio})`}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-purple-50">
                      {cliente.numeroRecogidasMes}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-bold text-purple-600">{cliente.litrosMes}</span>
                      <Droplets className="h-4 w-4 ml-1 text-purple-600" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  No hay datos de clientes para este mes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientesRankingMensual;
