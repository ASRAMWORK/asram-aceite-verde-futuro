
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Building, Home, Container } from 'lucide-react';
import { ComunidadVecinos } from '@/types';

interface AdminEstadisticasTabProps {
  comunidades: ComunidadVecinos[];
  totalViviendas: number;
  totalContenedores: number;
}

const AdminEstadisticasTab: React.FC<AdminEstadisticasTabProps> = ({ 
  comunidades, 
  totalViviendas, 
  totalContenedores 
}) => {
  // Calculate the total liters collected across all communities
  const totalLitrosRecogidos = comunidades.reduce((total, comunidad) => {
    return total + (comunidad.litrosRecogidos || 0);
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Comunidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{comunidades.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Viviendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Home className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{totalViviendas}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contenedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Container className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{totalContenedores}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen de actividad</CardTitle>
          <CardDescription>
            Actividad del administrador en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comunidades.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No hay datos disponibles para mostrar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <h4 className="text-sm font-medium">Comunidades administradas</h4>
                <ul className="space-y-1 text-sm">
                  {comunidades.slice(0, 5).map((comunidad) => (
                    <li key={comunidad.id} className="flex justify-between">
                      <span>{comunidad.nombre}</span>
                      <span className="text-muted-foreground">
                        {comunidad.litrosRecogidos || 0} litros
                      </span>
                    </li>
                  ))}
                  {comunidades.length > 5 && (
                    <li className="text-xs text-muted-foreground text-center pt-1">
                      Y {comunidades.length - 5} más...
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Litros totales recogidos</h4>
                <div className="flex items-center justify-between">
                  <span>{totalLitrosRecogidos} litros</span>
                  <span className="text-xs text-muted-foreground">
                    {comunidades.length} comunidades activas
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEstadisticasTab;
