
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCallesApadrinadas } from '@/hooks/useCallesApadrinadas';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Heart } from 'lucide-react';

const ApadrinaCalleView = () => {
  const { callesApadrinadas, loading, error } = useCallesApadrinadas();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Apadrina una Calle</h3>
        <p className="text-muted-foreground">
          Programa para transformar la gestión de residuos en zonas urbanas sin acceso a servicios de reciclaje
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-asram" />
              <CardTitle>¿Qué es Apadrina una Calle?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Apadrina una Calle es un programa innovador de ASRAM que tiene como objetivo transformar 
              la gestión de residuos en zonas urbanas que carecen de servicios de reciclaje, convirtiendo 
              el aceite vegetal usado en un recurso valioso para toda la comunidad.
            </p>
            
            <div>
              <h4 className="font-semibold mb-1">¿Cómo funciona?</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Instalación de puntos de recolección en ubicaciones estratégicas de calles 
                  sin acceso previo a contenedores de reciclaje.
                </li>
                <li>
                  Formación y capacitación de la comunidad local para la correcta separación 
                  y entrega del aceite.
                </li>
                <li>
                  Rutas de recogida periódicas, con el aceite recolectado enviado a instalaciones 
                  donde se procesa y convierte en biodiésel, cerrando el ciclo de la economía circular.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Beneficios para la comunidad</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mejora significativa en la gestión de residuos locales.</li>
                <li>Creación de empleos verdes y sostenibles.</li>
                <li>Educación ambiental práctica y mayor concienciación.</li>
                <li>Reducción de la contaminación del agua y del entorno.</li>
                <li>Fortalecimiento del tejido social y cohesión vecinal.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Impacto ambiental y social</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Cada litro de aceite reciclado evita la contaminación de 1.000 litros de agua potable.
                </li>
                <li>
                  Generación de oportunidades de empleo y mejora de la calidad de vida en zonas marginadas.
                </li>
                <li>
                  Transformación de residuos en recursos valiosos, promoviendo un modelo económico 
                  sostenible y regenerativo.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Resultados hasta la fecha</h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">500+</div>
                  <div className="text-sm">Familias beneficiadas</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">25</div>
                  <div className="text-sm">Barrios participantes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">1000L</div>
                  <div className="text-sm">Aceite reciclado mensual</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Apadrina ahora</CardTitle>
            <CardDescription>
              Suscripción mensual para apoyar el programa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 hover:border-asram hover:bg-orange-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold">Plan Básico</div>
                  <div className="text-lg font-bold text-asram">5€/mes</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Apadrina y apoya el reciclaje en una calle
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Certificado de padrino/madrina
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Informes de impacto trimestrales
                  </li>
                </ul>
              </div>
              
              <div className="border-2 border-asram rounded-lg p-4 bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors relative">
                <div className="absolute -top-3 right-4 bg-asram text-white text-xs py-1 px-3 rounded-full">
                  Popular
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold">Plan Premium</div>
                  <div className="text-lg font-bold text-asram">10€/mes</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Apadrina una calle con beneficios exclusivos
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Todo lo del Plan Básico
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Placa con tu nombre en la calle
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Visita guiada a instalaciones
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50 hover:border-asram hover:bg-orange-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold">Plan Corporativo</div>
                  <div className="text-lg font-bold text-asram">25€/mes</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Para empresas comprometidas con la sostenibilidad
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Todo lo del Plan Premium
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Logo de empresa en contenedores
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Certificado RSC oficial
                  </li>
                </ul>
              </div>
            </div>
            
            <Button className="w-full bg-asram hover:bg-asram-700">
              Comenzar suscripción
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-asram" />
            <CardTitle>Calles apadrinadas</CardTitle>
          </div>
          <CardDescription>
            Calles que ya forman parte del programa gracias a padrinos y madrinas
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
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
                Reintentar
              </Button>
            </div>
          ) : callesApadrinadas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay calles apadrinadas en este momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {callesApadrinadas.map((calle) => (
                <div key={calle.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{calle.nombreCalle}</p>
                    <p className="text-sm text-muted-foreground">
                      {calle.barrio}, {calle.distrito} • Apadrinada por {calle.nombrePadrino}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    Activa desde {new Date(calle.fechaInicio).toLocaleDateString()}
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

export default ApadrinaCalleView;
