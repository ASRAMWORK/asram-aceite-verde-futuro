
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileCheck, Download, FilePlus } from 'lucide-react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/components/ui/use-toast';

interface InformesPanelProps {
  adminId?: string;
}

const InformesPanel = ({ adminId }: InformesPanelProps) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  const { comunidades, loading, error } = useComunidadesVecinos(efectiveAdminId);

  const handleDescargarInforme = (tipo: string) => {
    toast({
      title: "Descarga iniciada",
      description: `El ${tipo} se está generando y se descargará en breve.`
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando informes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Informes y Documentación</h2>
      
      <Tabs defaultValue="informes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="informes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Informes
          </TabsTrigger>
          <TabsTrigger value="contratos" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Contratos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="informes">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4">Informes disponibles</h3>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Informe mensual de recogidas</h4>
                    <p className="text-sm text-gray-500">Resumen de recogidas del último mes</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDescargarInforme("informe mensual")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Certificados medioambientales</h4>
                    <p className="text-sm text-gray-500">Documentación oficial de ASRAM</p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarInforme("certificado")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Estadísticas anuales</h4>
                    <p className="text-sm text-gray-500">Impacto medioambiental generado</p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarInforme("informe anual")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contratos">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Contratos de comunidades</span>
                <Button size="sm" variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Nuevo contrato
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comunidades.length > 0 ? (
                <div className="space-y-3">
                  {comunidades.map(comunidad => (
                    <div key={comunidad.id} className="p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{comunidad.nombre}</h4>
                          <p className="text-sm text-gray-500">{comunidad.direccion}, {comunidad.ciudad}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleDescargarInforme(`contrato de ${comunidad.nombre}`)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No hay comunidades registradas para generar contratos.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => handleDescargarInforme("plantilla de contrato")}
                  >
                    Descargar plantilla
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformesPanel;
