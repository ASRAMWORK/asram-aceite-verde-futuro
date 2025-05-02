
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';

const RankingComunidades = () => {
  const { comunidades, loading } = useComunidadesVecinos();
  
  // Sort communities by the amount of liters collected (descending)
  const sortedComunidades = [...comunidades].sort((a, b) => 
    (b.litrosRecogidos || 0) - (a.litrosRecogidos || 0)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Comunidades</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posición</TableHead>
                  <TableHead>Comunidad</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Litros Recogidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedComunidades.length > 0 ? (
                  sortedComunidades.map((comunidad, index) => (
                    <TableRow key={comunidad.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{comunidad.nombre}</TableCell>
                      <TableCell>{comunidad.direccion}</TableCell>
                      <TableCell className="text-right">{comunidad.litrosRecogidos || 0}L</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No hay comunidades registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {sortedComunidades.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-100">
                <h3 className="font-semibold text-green-800 mb-1">Comunidad más activa</h3>
                <p className="text-green-700">
                  {sortedComunidades[0].nombre} - {sortedComunidades[0].litrosRecogidos || 0}L recogidos
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingComunidades;
