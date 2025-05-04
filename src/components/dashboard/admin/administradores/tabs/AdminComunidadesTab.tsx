
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { ComunidadVecinos } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface AdminComunidadesTabProps {
  comunidades: ComunidadVecinos[];
}

const AdminComunidadesTab: React.FC<AdminComunidadesTabProps> = ({ comunidades }) => {
  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Comunidades</h3>
      </div>
      
      {comunidades.length === 0 ? (
        <div className="text-center py-8">
          <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-2 text-muted-foreground">Este administrador no tiene comunidades asignadas</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Viviendas</TableHead>
                <TableHead>Contenedores</TableHead>
                <TableHead>Litros Recogidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comunidades.map((comunidad) => (
                <TableRow key={comunidad.id}>
                  <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                  <TableCell>
                    {comunidad.direccion}, {comunidad.codigoPostal} {comunidad.ciudad}
                  </TableCell>
                  <TableCell>{comunidad.numViviendas || comunidad.totalViviendas || 0}</TableCell>
                  <TableCell>{comunidad.numContenedores || 0}</TableCell>
                  <TableCell>{comunidad.litrosRecogidos || 0} L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          disabled={comunidades.length === 0}
        >
          Exportar datos
        </Button>
      </div>
    </>
  );
};

export default AdminComunidadesTab;
