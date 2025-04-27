
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlianzaVerde } from '@/hooks/useAlianzaVerde';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { School, ExternalLink, Map, Calendar, Users, Award, Leaf, Lightbulb, CheckCircle } from 'lucide-react';

const AlianzaVerdeView = () => {
  const { alianzas, loading, error } = useAlianzaVerde();
  
  const plazasDisponibles = 25; // Esto normalmente vendría de la base de datos
  const plazasTotal = 50;
  const porcentajeOcupacion = 100 - ((plazasDisponibles / plazasTotal) * 100);
  
  // Mock data for upcoming events and materials
  const upcomingEvents = [
    { title: "Taller de Reciclaje Creativo", date: "15 Mayo 2025", location: "CEIP García Lorca" },
    { title: "Formación Embajadores Verdes", date: "22 Mayo 2025", location: "IES Ramiro de Maeztu" },
    { title: "Mini Huerto Escolar", date: "5 Junio 2025", location: "Colegio Montserrat" }
  ];
  
  const educationalMaterials = [
    { title: "Guía para el profesor", type: "PDF", size: "2.5 MB" },
    { title: "Presentación interactiva", type: "PPT", size: "8.7 MB" },
    { title: "Fichas de actividades", type: "PDF", size: "1.8 MB" },
    { title: "Vídeo explicativo", type: "MP4", size: "45 MB" }
  ];

  // Function to determine the correct badge color based on certification level
  const getCertificationBadge = (certificaciones: any) => {
    if (!certificaciones) return null;
    
    if (typeof certificaciones === 'object' && certificaciones.ecosistema) {
      return <Badge className="bg-green-300 text-green-800 hover:bg-green-400">Ecosistema</Badge>;
    } else if (typeof certificaciones === 'object' && certificaciones.nivel3) {
      return <Badge className="bg-green-200 text-green-800 hover:bg-green-300">Nivel 3</Badge>;
    } else if (typeof certificaciones === 'object' && certificaciones.nivel2) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Nivel 2</Badge>;
    } else if (typeof certificaciones === 'object' && certificaciones.nivel1) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Nivel 1</Badge>;
    } else if (typeof certificaciones === 'number' && certificaciones > 0) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Certificado</Badge>;
    }
    
    return null;
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold">Alianza Verde Escolar</h3>
        <p className="text-muted-foreground">
          Programa educativo para convertir los centros en "laboratorios vivos" de sostenibilidad
        </p>
      </div>
      
      {/* Main content with tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Visión general</TabsTrigger>
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="centers">Centros participantes</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
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
                  <h4 className="font-semibold mb-2">Misión y visión</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-asram mb-2">Misión</h5>
                      <p className="text-sm">
                        Convertir las escuelas en espacios comprometidos con el medio ambiente, formando a estudiantes 
                        capaces de idear y ejecutar soluciones reales a los retos ecológicos.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-asram mb-2">Visión</h5>
                      <p className="text-sm">
                        Impulsar un movimiento que vaya más allá de la teoría, fomentando el aprendizaje experiencial 
                        y la participación activa de toda la comunidad educativa.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Actividades principales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Card className="bg-white border shadow-sm">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <CardTitle className="text-sm">Talleres de Reciclaje</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs text-muted-foreground">Transformación de residuos en objetos útiles</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border shadow-sm">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <CardTitle className="text-sm">Embajadores Verdes</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs text-muted-foreground">Formación de líderes ambientales</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border shadow-sm">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-asram" />
                          <CardTitle className="text-sm">Mini Huertos</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs text-muted-foreground">Agricultura sostenible en el centro</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border shadow-sm">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-600" />
                          <CardTitle className="text-sm">Energías Renovables</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs text-muted-foreground">Experimentos prácticos con energía limpia</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Impacto hasta la fecha</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-asram">50+</div>
                      <div className="text-xs text-muted-foreground">Centros transformados</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-asram">5.000+</div>
                      <div className="text-xs text-muted-foreground">Estudiantes sensibilizados</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-asram">100+</div>
                      <div className="text-xs text-muted-foreground">Talleres realizados</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-asram">1.245L</div>
                      <div className="text-xs text-muted-foreground">Aceite recolectado</div>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-4 w-full md:w-auto bg-asram hover:bg-asram-700" asChild>
                  <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4/viewform?pli=1&pli=1&edit_requested=true" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Inscribir mi centro
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
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
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Ocupación</span>
                      <span className="font-medium">{Math.round(porcentajeOcupacion)}%</span>
                    </div>
                    <Progress value={porcentajeOcupacion} className="h-2" />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">0</span>
                      <span className="text-muted-foreground">{plazasTotal}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Al unirte obtendrás:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">2 talleres gratuitos al año</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Kit de reciclaje para el centro</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Certificación ambiental oficial</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Recogida gratuita mensual</span>
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
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Próximos eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-asram-100 text-asram-800 p-2 rounded-md w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">{event.date} • {event.location}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="text-asram w-full justify-start">
                    Ver todos los eventos
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-asram" />
                <CardTitle>Niveles de certificación</CardTitle>
              </div>
              <CardDescription>
                El programa ofrece un sistema de certificación por niveles según el compromiso y los logros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
                  <CardHeader className="pb-0">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 w-fit mb-2">Nivel 1</Badge>
                    <CardTitle className="text-lg">Centro Comprometido</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Instalación de un Punto Verde</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Taller formativo inicial</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Materiales educativos básicos</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-green-50/50 shadow-sm">
                  <CardHeader className="pb-0">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 w-fit mb-2">Nivel 2</Badge>
                    <CardTitle className="text-lg">Centro Verde</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Todo lo del Nivel 1</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>4 talleres anuales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Proyecto ambiental propio</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-300 bg-green-50/70 shadow-sm">
                  <CardHeader className="pb-0">
                    <Badge className="bg-green-200 text-green-800 hover:bg-green-300 w-fit mb-2">Nivel 3</Badge>
                    <CardTitle className="text-lg">Centro Avanzado</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-700 mt-0.5" />
                        <span>Todo lo del Nivel 2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-700 mt-0.5" />
                        <span>Formación de embajadores</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-700 mt-0.5" />
                        <span>Mini huerto escolar</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-400 bg-green-100/70 shadow-sm">
                  <CardHeader className="pb-0">
                    <Badge className="bg-green-300 text-green-800 hover:bg-green-400 w-fit mb-2">Nivel 4</Badge>
                    <CardTitle className="text-lg">Centro Ecosistema</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-800 mt-0.5" />
                        <span>Todo lo del Nivel 3</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-800 mt-0.5" />
                        <span>Proyecto transformador</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-800 mt-0.5" />
                        <span>Mentorización a otros centros</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Materials tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Materiales educativos disponibles</CardTitle>
              <CardDescription>
                Recursos didácticos para implementar la Alianza Verde en tu centro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {educationalMaterials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{material.title}</div>
                        <div className="text-xs text-muted-foreground">{material.type} • {material.size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Solicita materiales personalizados</h3>
                <p className="text-sm mb-4">
                  Podemos adaptar nuestros materiales a las necesidades específicas de tu centro educativo. 
                  Contacta con nosotros para solicitar contenidos personalizados según edad, proyecto curricular o 
                  temática específica.
                </p>
                <Button variant="outline" className="w-full sm:w-auto">
                  Solicitar materiales personalizados
                </Button>
              </div>
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
                  <Card key={taller.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{taller.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">{taller.descripcion}</p>
                      <div className="flex justify-between text-xs">
                        <Badge variant="outline">{taller.nivel}</Badge>
                        <span className="font-medium">{taller.precio}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="bg-asram hover:bg-asram-700">
                  Solicitar un taller
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Centers tab */}
        <TabsContent value="centers" className="space-y-6">
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
                <div className="text-center py-8">
                  <div className="mb-4">
                    <School className="h-12 w-12 text-gray-300 mx-auto" />
                  </div>
                  <p className="text-muted-foreground">No hay centros participantes en este momento</p>
                  <Button variant="outline" className="mt-4">Sé el primero en unirte</Button>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="text-left py-2 font-medium">Centro</th>
                          <th className="text-left py-2 font-medium">Ubicación</th>
                          <th className="text-left py-2 font-medium">Participantes</th>
                          <th className="text-left py-2 font-medium">Certificación</th>
                          <th className="text-left py-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {alianzas.map((alianza) => (
                          <tr key={alianza.id} className="hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-medium">{alianza.nombre}</div>
                              <div className="text-xs text-muted-foreground">{alianza.tipo}</div>
                            </td>
                            <td className="py-3">{alianza.barrio}, {alianza.distrito}</td>
                            <td className="py-3">{alianza.numParticipantes || 'N/A'}</td>
                            <td className="py-3">{getCertificationBadge(alianza.certificaciones)}</td>
                            <td className="py-3 text-right">
                              <Button variant="ghost" size="sm" className="text-asram">
                                Ver detalles
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">Cargar más centros</Button>
                  </div>
                  
                  <div className="mt-6 bg-asram-50 p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block">
                        <School className="h-12 w-12 text-asram" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">¿Quieres que tu centro aparezca aquí?</h3>
                        <p className="text-sm mb-3">
                          Únete a la Alianza Verde Escolar y forma parte de esta red de centros comprometidos 
                          con la sostenibilidad y la educación ambiental.
                        </p>
                        <Button size="sm" className="bg-asram hover:bg-asram-700">
                          Inscribe tu centro
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución por distritos</CardTitle>
              <CardDescription>
                Centros participantes en la Alianza Verde Escolar por distrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Here you could add a chart component showing the distribution */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de distribución por distritos</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-asram"></div>
                      <span className="text-sm">Salamanca</span>
                    </div>
                    <span className="text-sm font-medium">8 centros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Chamberí</span>
                    </div>
                    <span className="text-sm font-medium">6 centros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Centro</span>
                    </div>
                    <span className="text-sm font-medium">5 centros</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Chamartín</span>
                    </div>
                    <span className="text-sm font-medium">5 centros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Retiro</span>
                    </div>
                    <span className="text-sm font-medium">4 centros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Otros</span>
                    </div>
                    <span className="text-sm font-medium">22 centros</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlianzaVerdeView;
