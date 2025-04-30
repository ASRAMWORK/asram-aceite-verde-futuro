
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, Building, FileCheck, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';

const InformesPanel = () => {
  const { comunidades, loading } = useComunidadesVecinos();
  const { profile } = useUserProfile();
  
  // Calculate total environmental impact
  const totalImpacto = {
    co2: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check co2Evitado and co2Reducido first, fall back to co2
      const co2Value = beneficios.co2Evitado !== undefined 
        ? beneficios.co2Evitado 
        : (beneficios.co2Reducido !== undefined 
          ? beneficios.co2Reducido 
          : beneficios.co2 || 0);
      return acc + co2Value;
    }, 0),
    agua: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check aguaAhorrada first, fall back to agua
      const aguaValue = beneficios.aguaAhorrada !== undefined
        ? beneficios.aguaAhorrada
        : beneficios.agua || 0;
      return acc + aguaValue;
    }, 0),
    energia: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check energiaAhorrada first, fall back to energia
      const energiaValue = beneficios.energiaAhorrada !== undefined
        ? beneficios.energiaAhorrada
        : beneficios.energia || 0;
      return acc + energiaValue;
    }, 0)
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Template data for contracts and reports
  const informes = [
    {
      id: 1,
      title: "Informe Mensual Recogidas",
      description: "Resumen mensual de todas las recogidas realizadas",
      type: "pdf",
      date: new Date(2023, 8, 15),
      status: "disponible"
    },
    {
      id: 2,
      title: "Certificado Medioambiental",
      description: "Certificado oficial de beneficios medioambientales",
      type: "pdf",
      date: new Date(2023, 9, 3),
      status: "disponible"
    },
    {
      id: 3,
      title: "Informe Trimestral",
      description: "Análisis detallado del último trimestre",
      type: "excel",
      date: new Date(2023, 6, 30),
      status: "disponible"
    }
  ];
  
  const contratos = [
    {
      id: 1,
      title: "Contrato de Servicio",
      description: "Acuerdo de servicio de recogida de aceite",
      type: "pdf",
      date: new Date(2023, 1, 10),
      status: "activo"
    },
    {
      id: 2,
      title: "Adenda Ampliación Servicios",
      description: "Ampliación de servicios según acuerdo marco",
      type: "pdf",
      date: new Date(2023, 5, 22),
      status: "pendiente"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#ee970d]">Informes y Contratos</h2>
          <p className="text-muted-foreground">
            Accede a tus informes, certificados y documentos contractuales
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="informes">
        <TabsList>
          <TabsTrigger value="informes">Informes y Certificados</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="certificado">Certificado Medioambiental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informes" className="space-y-4 pt-4">
          {informes.map(informe => (
            <Card key={informe.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">{informe.title}</CardTitle>
                    </div>
                    <CardDescription>{informe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(informe.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{profile?.nombreAdministracion || "Administración"}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="flex items-center px-6">
                  <Button variant="outline" className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Descargar {informe.type.toUpperCase()}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="contratos" className="space-y-4 pt-4">
          {contratos.map(contrato => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{contrato.title}</CardTitle>
                    </div>
                    <CardDescription>{contrato.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(contrato.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{profile?.nombreAdministracion || "Administración"}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contrato.status === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {contrato.status === 'activo' ? 'Activo' : 'Pendiente firma'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="flex items-center px-6">
                  <Button variant="outline" className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Ver contrato
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          <div className="pt-4 flex justify-center">
            <Button className="flex gap-2">
              <FilePlus className="h-4 w-4" />
              Solicitar nuevo contrato
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="certificado" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificado de Impacto Medioambiental</CardTitle>
              <CardDescription>
                Certificado oficial de los beneficios medioambientales generados por tus comunidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm text-muted-foreground">CO2 no emitido</p>
                    <p className="text-2xl font-bold text-green-600">
                      {loading ? '...' : `${totalImpacto.co2.toFixed(1)}kg`}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Agua no contaminada</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {loading ? '...' : `${totalImpacto.agua.toFixed(1)}L`}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Energía ahorrada</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {loading ? '...' : `${totalImpacto.energia.toFixed(1)}kWh`}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Descargar certificado
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformesPanel;
