
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Droplet, Calendar } from 'lucide-react';

interface ClienteRecogidasStatsProps {
  totalLitros: number;
  promedioLitros30Dias?: number;
}

const ClienteRecogidasStats: React.FC<ClienteRecogidasStatsProps> = ({ 
  totalLitros, 
  promedioLitros30Dias 
}) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <Droplet className="h-3.5 w-3.5" />
        <span>Total: {totalLitros} litros</span>
      </Badge>
      {promedioLitros30Dias && promedioLitros30Dias > 0 && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Media: {promedioLitros30Dias} L/30 días</span>
        </Badge>
      )}
    </div>
  );
};

export default ClienteRecogidasStats;
