
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, Droplet } from 'lucide-react';

// Datos de ejemplo para el calendario (esto normalmente vendría de la base de datos)
const calendarioRecogidas = [
  { distrito: 'Centro', barrio: 'Sol', fecha: '2025-01-15' },
  { distrito: 'Chamberí', barrio: 'Gaztambide', fecha: '2025-01-17' },
  { distrito: 'Salamanca', barrio: 'Recoletos', fecha: '2025-01-20' },
  { distrito: 'Retiro', barrio: 'Ibiza', fecha: '2025-01-22' },
  { distrito: 'Chamartín', barrio: 'El Viso', fecha: '2025-01-25' },
  { distrito: 'Moncloa-Aravaca', barrio: 'Casa de Campo', fecha: '2025-01-27' },
  { distrito: 'Tetuán', barrio: 'Berruguete', fecha: '2025-01-30' },
  { distrito: 'Centro', barrio: 'Embajadores', fecha: '2025-02-05' },
  { distrito: 'Chamberí', barrio: 'Ríos Rosas', fecha: '2025-02-07' },
  { distrito: 'Salamanca', barrio: 'Goya', fecha: '2025-02-10' },
];

const PuntosVerdesView = () => {
  const { puntosVerdes, loading, error, loadPuntosVerdesData } = usePuntosVerdes();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Puntos Verdes</h3>
        <p className="text-muted-foreground">
          Puntos de recogida gratuitos de aceite vegetal usado
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-asram" />
              <CardTitle>¿Qué son los Puntos Verdes?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Los Puntos Verdes de ASRAM son puntos de recogida gratuitos de aceite vegetal usado 
              instalados en comunidades de vecinos, colegios, centros de día y residencias de la 
              Comunidad de Madrid, con el fin de facilitar su reciclaje y cerrar el ciclo de la 
              economía circular.
            </p>
            
            <div>
              <h4 className="font-semibold mb-1">¿Cómo funcionan?</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Instalación gratuita:</span> ASRAM proporciona los 
                  contenedores adaptados y pequeños envases para que cada hogar almacene el aceite 
                  antes de su entrega.
                </li>
                <li>
                  <span className="font-medium">Calendario mensual de recogida:</span> Se establece 
                  un calendario de vaciado por distrito para garantizar un servicio ordenado y regular.
                </li>
                <li>
                  <span className="font-medium">Tipo y requisitos del aceite:</span> Se recoge aceite 
                  vegetal usado de cocina (girasol, oliva…) siempre que esté libre de restos sólidos, 
                  agua o contaminantes.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Destino del aceite recogido</h4>
              <p>El aceite acumulado en los Puntos Verdes se destina, según los casos, a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Iniciativas solidarias (por ejemplo, proyectos de elaboración de detergente sostenible).
                </li>
                <li>
                  Gestoras de residuos autorizadas, que lo transforman en biodiésel u otros productos.
                </li>
              </ul>
              <p>
                Los fondos obtenidos financian nuevas actividades medioambientales y educativas de ASRAM.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Beneficios e impacto ambiental</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Reducción de la contaminación:</span> Un solo litro de 
                  aceite usado puede llegar a contaminar hasta 1.000 L de agua.
                </li>
                <li>
                  <span className="font-medium">Impulso a la economía circular:</span> Convierte un 
                  residuo doméstico en recurso útil, generando empleo verde y apoyando a personas en 
                  riesgo de exclusión social.
                </li>
                <li>
                  <span className="font-medium">Concienciación educativa:</span> A través de talleres y 
                  campañas vinculadas a los Puntos Verdes, se fomenta la responsabilidad ambiental en 
                  toda la comunidad.
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">¿Cómo participar?</h4>
              <ol className="list-decimal pl-6 space-y-1">
                <li>
                  Contacta con ASRAM vía web (sección "Puntos Verdes") o por teléfono/WhatsApp 
                  para solicitar la instalación.
                </li>
                <li>
                  Se programa la instalación de los contenedores y se te facilita el calendario 
                  de recogida.
                </li>
                <li>
                  ¡Empieza a depositar tu aceite usado y forma parte del cambio hacia un modelo sostenible!
                </li>
              </ol>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button className="bg-asram hover:bg-asram-700">
                Solicitar un Punto Verde
              </Button>
              <Button variant="outline">
                Contactar con ASRAM
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitar recogida</CardTitle>
            <CardDescription>
              Programar una recogida de aceite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center mb-4">
                <Droplet className="h-10 w-10 mx-auto text-asram" />
                <h4 className="font-semibold mt-2">Servicio gratuito</h4>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Solicita la recogida de tu aceite usado y contribuye a un Madrid más sostenible
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">El servicio incluye:</p>
              <ul className="space-y-1">
                <li className="flex items-start text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Recogida a domicilio</span>
                </li>
                <li className="flex items-start text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Entrega de envases limpios</span>
                </li>
                <li className="flex items-start text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Certificado de reciclaje</span>
                </li>
                <li className="flex items-start text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Informe de impacto ambiental</span>
                </li>
              </ul>
            </div>
            
            <Button className="w-full bg-asram hover:bg-asram-700">
              Solicitar recogida
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-asram" />
            <CardTitle>Calendario de recogidas 2025</CardTitle>
          </div>
          <CardDescription>
            Fechas programadas para recogidas por distrito y barrio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calendarioRecogidas.map((recogida, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">{recogida.distrito} - {recogida.barrio}</p>
                  <p className="text-sm text-muted-foreground">
                    Fecha programada
                  </p>
                </div>
                <div className="text-asram font-semibold">
                  {new Date(recogida.fecha).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-asram" />
            <CardTitle>Puntos Verdes activos</CardTitle>
          </div>
          <CardDescription>
            Ubicaciones de los puntos de recogida de aceite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" onClick={loadPuntosVerdesData} className="mt-2">
                Reintentar
              </Button>
            </div>
          ) : puntosVerdes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay puntos verdes activos en este momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {puntosVerdes.map((punto) => (
                <div key={punto.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{punto.direccion}</p>
                    <p className="text-sm text-muted-foreground">
                      {punto.barrio}, {punto.distrito} • {punto.numViviendas} viviendas
                    </p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {punto.litrosRecogidos}L recogidos
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuntosVerdesView;
