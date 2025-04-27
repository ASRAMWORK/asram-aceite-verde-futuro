
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, FileText, ArrowRight, ThumbsUp, Droplet, CheckCircle, Search, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PuntosVerdes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for the district calendar
  const districtCalendar = [
    { distrito: "Centro", semana1: "Lunes", semana2: "-", semana3: "Lunes", semana4: "-" },
    { distrito: "Chamberí", semana1: "Martes", semana2: "-", semana3: "Martes", semana4: "-" },
    { distrito: "Salamanca", semana1: "Miércoles", semana2: "-", semana3: "Miércoles", semana4: "-" },
    { distrito: "Retiro", semana1: "Jueves", semana2: "-", semana3: "Jueves", semana4: "-" },
    { distrito: "Chamartín", semana1: "Viernes", semana2: "-", semana3: "Viernes", semana4: "-" },
    { distrito: "Tetuán", semana1: "-", semana2: "Lunes", semana3: "-", semana4: "Lunes" },
    { distrito: "Moncloa", semana1: "-", semana2: "Martes", semana3: "-", semana4: "Martes" },
    { distrito: "Fuencarral-El Pardo", semana1: "-", semana2: "Miércoles", semana3: "-", semana4: "Miércoles" },
    { distrito: "Latina", semana1: "-", semana2: "Jueves", semana3: "-", semana4: "Jueves" },
    { distrito: "Carabanchel", semana1: "-", semana2: "Viernes", semana3: "-", semana4: "Viernes" }
  ];
  
  const filteredDistricts = districtCalendar.filter(
    district => district.distrito.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Mock data for success metrics
  const successMetrics = [
    { metric: "Puntos Verdes instalados", value: "250+", icon: "MapPin" },
    { metric: "Comunidades de vecinos", value: "180+", icon: "Home" },
    { metric: "Centros educativos", value: "45+", icon: "School" },
    { metric: "Litros recogidos/mes", value: "2.500+", icon: "Droplet" }
  ];

  return (
    <PageLayout 
      title="Puntos Verdes" 
      subtitle="Red de contenedores para el reciclaje de aceite usado"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero section with illustration */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-asram-50 to-green-50 mb-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-asram-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-30 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="space-y-6">
              <Badge className="bg-asram-100 text-asram-800 hover:bg-asram-200 px-3 py-1 text-sm">
                Programa Presencial
              </Badge>
              
              <motion.h2 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-800"
              >
                Contenedores de reciclaje gratuitos para tu comunidad
              </motion.h2>
              
              <p className="text-lg leading-relaxed">
                Los Puntos Verdes son contenedores gratuitos instalados en comunidades de vecinos, 
                centros escolares y entidades colaboradoras para depositar aceite de cocina usado 
                de forma segura e higiénica, facilitando su posterior reciclaje.
              </p>
              
              <div className="pt-4">
                <Button asChild className="bg-asram hover:bg-asram-700">
                  <Link to="/contacto">Solicitar un Punto Verde</Link>
                </Button>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-6">
                <img 
                  src="/placeholder.svg"
                  alt="Punto Verde ASRAM" 
                  className="w-full h-auto max-w-sm mx-auto rounded-lg aspect-square object-cover"
                />
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 rotate-3">
                <div className="flex items-center space-x-2 text-asram font-semibold">
                  <Droplet className="h-5 w-5" />
                  <span>Fácil y gratuito</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t">
            {successMetrics.map((item, index) => (
              <div key={index} className="text-center p-3">
                <div className="text-3xl font-bold text-asram">{item.value}</div>
                <div className="text-sm text-gray-600">{item.metric}</div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacion">¿Cómo funciona?</TabsTrigger>
            <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
            <TabsTrigger value="calendario">Calendario de recogidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacion" className="space-y-8 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">El proceso es muy sencillo</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">1. Instalación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">ASRAM instala gratuitamente contenedores especiales en la ubicación designada, junto con pequeños recipientes para cada hogar.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">2. Formación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Se imparte una breve sesión informativa para explicar el correcto uso del sistema y resolver dudas de los residentes.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">3. Depósito</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Los vecinos depositan su aceite usado en botellas cerradas dentro del contenedor específico, de forma higiénica y sencilla.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-base">4. Recogida periódica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">ASRAM se encarga del vaciado periódico según la programación establecida para cada zona, sin coste alguno.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="w-6 h-6 text-asram" />
                    Beneficios para la comunidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Solución higiénica y cómoda para un residuo problemático que suele causar obstrucciones en tuberías</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Mejora de la imagen del edificio como espacio comprometido con la sostenibilidad</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Prevención de atascos y problemas de fontanería, con el consiguiente ahorro económico</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Recogida gratuita a domicilio y sin esfuerzo para los residentes</p>
                  </div>
                </CardContent>
              </Card>
                
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="w-6 h-6 text-asram" />
                    Beneficios para el medio ambiente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Prevención de la contaminación de aguas - 1L de aceite puede contaminar hasta 1.000L de agua</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Reducción de la huella de carbono al transformar un residuo en biocombustible</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Conversión de un residuo en recurso valioso, fomentando la economía circular</p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Disminución de costes municipales de depuración de aguas residuales</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gradient-to-br from-asram-50 to-asram-100/50 shadow-md">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-grow space-y-4">
                    <h3 className="text-xl font-semibold">Solicita la instalación gratuita de un Punto Verde en tu comunidad</h3>
                    <p>Completa el formulario de solicitud y nuestro equipo se pondrá en contacto contigo en 48 horas.</p>
                  </div>
                  <Button size="lg" className="bg-asram hover:bg-asram-700" asChild>
                    <Link to="/contacto">
                      Solicitar ahora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requisitos" className="space-y-8 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Requisitos para la instalación</CardTitle>
                <CardDescription>
                  Para instalar un Punto Verde, necesitamos cumplir estas condiciones básicas:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-asram" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Espacio adecuado</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Zona cubierta (portal, garaje, trastero común...)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Fácil acceso para residentes</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Posibilidad de acceso para personal de recogida</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-asram" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Acuerdo comunitario</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Aprobación en junta de vecinos</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>O autorización del presidente/administrador</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Firma del convenio de colaboración</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-asram" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Compromiso mínimo</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Mantener el punto verde activo durante al menos 6 meses</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Facilitar el acceso para la recogida periódica</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Informar a ASRAM de cualquier incidencia</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">Información adicional a considerar</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Tipos de contenedores</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Disponemos de diferentes modelos adaptados a cada necesidad:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Estándar: Capacidad 50L (aprox. 20-25 viviendas)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Grande: Capacidad 100L (aprox. 40-50 viviendas)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Comunitario: Capacidad 200L (grandes comunidades)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Documentación necesaria</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Formulario de solicitud cumplimentado</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Copia del acta de reunión donde se aprueba (si procede)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Datos de contacto del responsable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-asram"></div>
                          <span>Número aproximado de viviendas</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-asram-50 p-6 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">¿Cumples los requisitos? Solicita tu Punto Verde</h3>
                    <p className="text-sm text-gray-600">La instalación y el mantenimiento son completamente gratuitos</p>
                  </div>
                  <Button className="bg-asram hover:bg-asram-700" asChild>
                    <Link to="/contacto">
                      Solicitar instalación
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendario" className="mt-6 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de recogidas por distrito</CardTitle>
                <CardDescription>
                  Consulta cuándo pasamos a vaciar los contenedores en tu zona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="search-district">Buscar tu distrito</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="search-district"
                      placeholder="Ej: Chamberí, Centro..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-asram-50">
                        <th className="p-3 text-left">Distrito</th>
                        <th className="p-3 text-left">1ª Semana</th>
                        <th className="p-3 text-left">2ª Semana</th>
                        <th className="p-3 text-left">3ª Semana</th>
                        <th className="p-3 text-left">4ª Semana</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistricts.map((district, index) => (
                        <tr key={index} className={index % 2 === 0 ? "border-b border-gray-100" : "border-b border-gray-100 bg-gray-50"}>
                          <td className="p-3 font-medium">{district.distrito}</td>
                          <td className="p-3">{district.semana1}</td>
                          <td className="p-3">{district.semana2}</td>
                          <td className="p-3">{district.semana3}</td>
                          <td className="p-3">{district.semana4}</td>
                        </tr>
                      ))}
                      {filteredDistricts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center">
                            <div className="text-gray-500">No hay resultados para "{searchQuery}"</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 bg-amber-50 border border-amber-100 p-4 rounded-lg">
                  <div className="flex gap-3 items-start">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Información importante</h4>
                      <p className="text-sm text-gray-600">
                        Este calendario es orientativo y puede estar sujeto a modificaciones por festividades o incidencias.
                        Los usuarios registrados recibirán notificaciones con antelación sobre cualquier cambio.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/calendario">
                    Ver calendario completo
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-asram">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Descargar PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Solicitud de recogida extraordinaria</CardTitle>
                <CardDescription>
                  Si tu contenedor está lleno antes de la fecha programada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Si el contenedor está a punto de llenarse antes de la fecha programada de recogida, 
                  puedes solicitar una recogida extraordinaria sin coste adicional.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-asram/20 flex items-center justify-center flex-shrink-0">
                      <div className="text-sm font-medium text-asram">1</div>
                    </div>
                    <span>Contacta con al menos 48 horas de antelación</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-asram/20 flex items-center justify-center flex-shrink-0">
                      <div className="text-sm font-medium text-asram">2</div>
                    </div>
                    <span>Indica el código de tu Punto Verde (aparece en la etiqueta del contenedor)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-asram/20 flex items-center justify-center flex-shrink-0">
                      <div className="text-sm font-medium text-asram">3</div>
                    </div>
                    <span>Confirma la dirección y persona de contacto</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-asram hover:bg-asram-700" asChild>
                    <Link to="/contacto">
                      Solicitar recogida extraordinaria
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default PuntosVerdes;
