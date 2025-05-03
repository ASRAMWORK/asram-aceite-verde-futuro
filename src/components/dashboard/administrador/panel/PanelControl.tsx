import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Droplet, Package, BarChart3 } from 'lucide-react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

interface PanelControlProps {
  adminId?: string;
}

const PanelControl: React.FC<PanelControlProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  const { comunidades, loading } = useComunidadesVecinos(efectiveAdminId);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Calcular estadísticas
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((sum, com) => sum + (com.numViviendas || 0), 0);
  const totalContenedores = comunidades.reduce((sum, com) => sum + (com.numContenedores || 0), 0);
  const totalLitrosRecogidos = comunidades.reduce((sum, com) => sum + (com.litrosRecogidos || 0), 0);
  
  // Calcular beneficios medioambientales totales
  const totalCO2 = comunidades.reduce((sum, com) => {
    return sum + (
      com.beneficiosMedioambientales?.co2Reducido || 
      com.beneficiosMedioambientales?.co2 || 0
    );
  }, 0);
  
  const totalAguaAhorrada = comunidades.reduce((sum, com) => {
    return sum + (
      com.beneficiosMedioambientales?.aguaAhorrada || 
      com.beneficiosMedioambientales?.agua || 0
    );
  }, 0);
  
  const totalEnergiaAhorrada = comunidades.reduce((sum, com) => {
    return sum + (
      com.beneficiosMedioambientales?.energiaAhorrada || 
      com.beneficiosMedioambientales?.energia || 0
    );
  }, 0);
  
  const navegarA = (ruta: string) => {
    navigate(`/administrador/dashboard/${ruta}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee970d]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Panel de Control</h2>
      <p className="text-gray-600">Bienvenido de nuevo, {profile?.nombreAdministracion || profile?.nombre || 'Administrador'}.</p>
      
      <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'md:grid-cols-4 gap-6'} mb-4 md:mb-6`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardDescription>Comunidades</CardDescription>
            <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalComunidades}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-2'}`}>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-[#ee970d] mr-2" />
              <span className="text-sm text-gray-500">Comunidades gestionadas</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardDescription>Viviendas</CardDescription>
            <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalViviendas}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-2'}`}>
            <div className="flex items-center">
              <Home className="h-5 w-5 text-[#ee970d] mr-2" />
              <span className="text-sm text-gray-500">Viviendas en comunidades</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardDescription>Contenedores</CardDescription>
            <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalContenedores}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-2'}`}>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-[#ee970d] mr-2" />
              <span className="text-sm text-gray-500">Contenedores instalados</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardDescription>Aceite recogido</CardDescription>
            <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalLitrosRecogidos} L</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-0' : 'pt-2'}`}>
            <div className="flex items-center">
              <Droplet className="h-5 w-5 text-[#ee970d] mr-2" />
              <span className="text-sm text-gray-500">Total aceite recogido</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'} mb-4 md:mb-6`}>
        <Card>
          <CardHeader className={isMobile ? 'p-4' : ''}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Impacto Medioambiental</CardTitle>
            <CardDescription>Beneficios generados por tus comunidades</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <BarChart3 className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CO2 Reducido</p>
                    <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{Math.round(totalCO2)} kg</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Droplet className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agua ahorrada</p>
                    <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{Math.round(totalAguaAhorrada)} L</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <BarChart3 className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Energía ahorrada</p>
                    <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{Math.round(totalEnergiaAhorrada)} kWh</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={isMobile ? 'p-4' : ''}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Acciones rápidas</CardTitle>
            <CardDescription>Gestiona tus comunidades y servicios</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className="space-y-3 md:space-y-4">
              <Button 
                onClick={() => navegarA('gestionar')} 
                className={`w-full bg-[#ee970d] hover:bg-[#ee970d]/90 ${isMobile ? 'h-12' : ''}`}
              >
                <Building className="mr-2 h-5 w-5" />
                Añadir nueva comunidad
              </Button>
              
              <Button 
                onClick={() => navegarA('comunidades')} 
                variant="outline" 
                className={`w-full ${isMobile ? 'h-12' : ''}`}
              >
                <Home className="mr-2 h-5 w-5" />
                Ver mis comunidades
              </Button>
              
              <Button 
                onClick={() => navegarA('estadisticas')} 
                variant="outline" 
                className={`w-full ${isMobile ? 'h-12' : ''}`}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver estadísticas detalladas
              </Button>
              
              <Button 
                onClick={() => navegarA('informes')} 
                variant="outline" 
                className={`w-full ${isMobile ? 'h-12' : ''}`}
              >
                <Droplet className="mr-2 h-5 w-5" />
                Informes y documentación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {comunidades.length > 0 && (
        <Card>
          <CardHeader className={isMobile ? 'p-4' : ''}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Últimas comunidades</CardTitle>
            <CardDescription>Resumen de tus comunidades recientes</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className="space-y-2">
              {comunidades.slice(0, 3).map((comunidad) => (
                <div key={comunidad.id} className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium">{comunidad.nombre}</p>
                      <p className={`text-sm text-gray-500 ${isMobile ? 'max-w-[150px] truncate' : ''}`}>{comunidad.direccion}, {comunidad.ciudad}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{comunidad.numViviendas || 0} viviendas</p>
                    <p className="text-xs text-gray-500">{comunidad.litrosRecogidos || 0}L recogidos</p>
                  </div>
                </div>
              ))}
              {comunidades.length > 3 && (
                <Button variant="ghost" className="w-full text-gray-500" onClick={() => navegarA('comunidades')}>
                  Ver todas las comunidades ({comunidades.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {isMobile && <div className="h-16"></div>} {/* Space for mobile bottom nav */}
    </div>
  );
};

export default PanelControl;
