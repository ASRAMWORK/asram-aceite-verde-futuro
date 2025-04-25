import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlianzaVerde } from '@/hooks/useAlianzaVerde';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { School, ExternalLink, Map } from 'lucide-react';

const AlianzaVerdeView = () => {
  const { alianzas, loading, error } = useAlianzaVerde();
  
  const plazasDisponibles = 25; // Esto normalmente vendría de la base de datos
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Alianza Verde Escolar</h3>
        <p className="text-muted-foreground">
          Programa educativo para convertir los centros en "laboratorios vivos" de sostenibilidad
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <School className="h-6 w-6 text-asram" />
              <CardTitle>¿Qué es la Alianza Verde Escolar?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              La Alianza Verde Escolar es el proyecto de ASRAM orientado a transformar la educación ambiental 
              en los centros educativos, concibiéndolos como auténticos "laboratorios vivos" de sostenibilidad 
              donde el alumnado se convierte en agente de cambio.
            </p>
            
            <div>
              <h4 className="font-semibold mb-1">Misión y visión</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Misión:</span> Convertir las escuelas en espacios comprometidos 
                  con el medio ambiente, formando a estudiantes capaces de idear y ejecutar soluciones reales a 
                  los retos ecológicos.
                </li>
                <li>
                  <span className="font-medium">Visión:</span> Impulsar un movimiento que vaya más allá de la teoría, 
                  fomentando el aprendizaje experiencial y la participación activa de toda la comunidad educativa.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Metodología práctica y participativa</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Diseñamos talleres y actividades adaptados a cada etapa educativa (desde primaria hasta formación de adultos).
                </li>
                <li>
                  Priorizamos la "diversión" como motor de compromiso, combinando teoría con experiencias vivenciales 
                  que refuercen el vínculo entre el alumnado y la naturaleza.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Impacto hasta la fecha</h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">50+</div>
                  <div className="text-sm">Centros transformados</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">5.000+</div>
                  <div className="text-sm">Estudiantes sensibilizados</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-asram">100+</div>
                  <div className="text-sm">Talleres realizados</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full md:w-auto bg-asram hover:bg-asram-700" asChild>
              <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4/viewform?pli=1&pli=1&edit_requested=true" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Inscribir mi centro
              </a>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Plazas disponibles</CardTitle>
            <CardDescription>
              Inscribe tu centro antes de que se agoten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl font-bold text-asram">{plazasDisponibles}</div>
              <div className="text-sm text-muted-foreground mt-2">Plazas restantes</div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Al unirte obtendrás:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>2 talleres gratuitos al año</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Kit de reciclaje para el centro</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Certificación ambiental oficial</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Recogida gratuita mensual</span>
                </li>
              </ul>
            </div>
            
            <Button className="w-full bg-asram hover:bg-asram-700" asChild>
              <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4/viewform?pli=1&pli=1&edit_requested=true" target="_blank" rel="noopener noreferrer">
                Solicitar inscripción
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="h-6 w-6 text-asram" />
            <CardTitle>Centros participantes</CardTitle>
          </div>
          <CardDescription>
            Escuelas y centros educativos que ya forman parte de nuestra Alianza Verde
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
          ) : alianzas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay centros participantes en este momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alianzas.map((alianza) => (
                <div key={alianza.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{alianza.nombreCentro}</p>
                    <p className="text-sm text-muted-foreground">
                      {alianza.barrio}, {alianza.distrito} • {alianza.numParticipantes} participantes
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {typeof alianza.certificaciones === 'number' 
                      ? alianza.certificaciones 
                      : (alianza.certificaciones?.length || 0)} Certificaciones
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Talleres disponibles</CardTitle>
          <CardDescription>
            Formaciones y actividades para centros educativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 1,
                titulo: 'Reciclaje Creativo',
                descripcion: 'Transformar residuos en arte y objetos útiles',
                nivel: 'Todos los niveles',
                precio: 'Gratuito para miembros'
              },
              {
                id: 2,
                titulo: 'Mini Huertos Escolares',
                descripcion: 'Aprender a cultivar y cuidar plantas',
                nivel: 'Primaria y ESO',
                precio: 'Gratuito para miembros'
              },
              {
                id: 3,
                titulo: 'Guardianes del Agua',
                descripcion: 'Concienciación sobre el ciclo y conservación del agua',
                nivel: 'Todos los niveles',
                precio: '50€ (Gratuito para miembros)'
              },
              {
                id: 4,
                titulo: 'Taller de Jabón Reciclado',
                descripcion: 'Convertir aceite usado en jabones ecológicos',
                nivel: 'Secundaria y Bachillerato',
                precio: '75€ (Gratuito para miembros)'
              },
              {
                id: 5,
                titulo: 'Taller de Biodiesel',
                descripcion: 'Fabricación de combustible alternativo con aceite usado',
                nivel: 'Bachillerato y FP',
                precio: '100€ (Gratuito para miembros)'
              },
              {
                id: 6,
                titulo: 'Energías Renovables',
                descripcion: 'Construcción de pequeños dispositivos energéticos',
                nivel: 'ESO y Bachillerato',
                precio: '75€ (Gratuito para miembros)'
              }
            ].map(taller => (
              <Card key={taller.id} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{taller.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{taller.descripcion}</p>
                  <div className="flex justify-between text-xs">
                    <span>{taller.nivel}</span>
                    <span className="font-medium">{taller.precio}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlianzaVerdeView;
