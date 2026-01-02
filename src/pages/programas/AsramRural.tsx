import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Truck, Users, Building, ChevronRight, Tractor, Mountain, Map, Home, ArrowUpRight, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const inscripcionSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().max(20).optional(),
  organizacion: z.string().trim().min(1, "El nombre del municipio/organización es obligatorio").max(200),
  tipoSolicitante: z.string().min(1, "Selecciona el tipo de solicitante"),
  direccion: z.string().trim().max(500).optional(),
  mensaje: z.string().trim().max(1000).optional(),
});

const AsramRural = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    organizacion: "",
    tipoSolicitante: "",
    direccion: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = inscripcionSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-programa-inscripcion', {
        body: {
          programa: 'asram-rural',
          ...formData
        }
      });

      if (error) throw error;

      toast.success("¡Solicitud enviada! Te contactaremos pronto.");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        organizacion: "",
        tipoSolicitante: "",
        direccion: "",
        mensaje: ""
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Mock data
  const partnerships = [
    { name: "Cooperativa Agrícola Sierra Norte", location: "Sierra Norte", type: "Agrícola", members: 45 },
    { name: "Asociación de Desarrollo Rural Valle del Lozoya", location: "Valle del Lozoya", type: "Desarrollo local", members: 24 },
    { name: "Productores Unidos de Buitrago", location: "Buitrago de Lozoya", type: "Producción local", members: 18 },
    { name: "Asociación de Turismo Rural de Madrid", location: "Madrid", type: "Turismo", members: 67 }
  ];
  
  const localities = [
    { name: "La Hiruela", region: "Sierra Norte", households: 85, status: "activo" },
    { name: "Puebla de la Sierra", region: "Sierra Norte", households: 110, status: "activo" },
    { name: "Buitrago del Lozoya", region: "Sierra Norte", households: 350, status: "activo" },
    { name: "Montejo de la Sierra", region: "Sierra Norte", households: 180, status: "próximo" },
    { name: "Patones", region: "Sierra Norte", households: 210, status: "próximo" },
    { name: "Torrelaguna", region: "Sierra Norte", households: 420, status: "próximo" }
  ];

  return (
    <PageLayout 
      title="ASRAM Rural" 
      subtitle="Llevamos el reciclaje sostenible a zonas rurales"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero section with map illustration */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-yellow-50 mb-12">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-200 rounded-full opacity-30 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
                Programa de Extensión
              </Badge>
              
              <motion.h2 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-800"
              >
                Adaptando el modelo urbano a entornos rurales
              </motion.h2>
              
              <p className="text-lg leading-relaxed">
                ASRAM Rural es una adaptación de nuestro modelo urbano a las particularidades de las zonas 
                rurales, donde la gestión de residuos presenta desafíos diferentes. Garantizamos que todas 
                las comunidades, independientemente de su tamaño o ubicación, contribuyan a la economía circular.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-3">
                <Button asChild className="bg-asram hover:bg-asram-700">
                  <Link to="/contacto">Solicitar información</Link>
                </Button>
                <Button variant="outline">
                  Ver municipios participantes
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">12 municipios participantes</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Rutas optimizadas ecológicamente</span>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-6">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-green-50 border border-green-100">
                  {/* Mock map illustration - in a real app, this could be an interactive map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Map className="h-24 w-24 text-asram opacity-10" />
                  </div>
                  
                  {/* Sample location markers */}
                  <div className="absolute top-1/4 left-1/3">
                    <div className="h-3 w-3 bg-asram rounded-full animate-pulse" />
                  </div>
                  <div className="absolute top-1/3 right-1/4">
                    <div className="h-3 w-3 bg-asram rounded-full animate-pulse" />
                  </div>
                  <div className="absolute bottom-1/4 left-1/2">
                    <div className="h-3 w-3 bg-asram rounded-full animate-pulse" />
                  </div>
                  <div className="absolute bottom-1/3 right-1/3">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 rotate-2">
                <div className="flex items-center space-x-2 text-asram font-semibold">
                  <Mountain className="h-5 w-5" />
                  <span>Sierra Norte de Madrid</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t">
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">12</div>
              <div className="text-sm text-gray-600">Municipios</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">985</div>
              <div className="text-sm text-gray-600">Hogares servidos</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">1.250L</div>
              <div className="text-sm text-gray-600">Aceite reciclado</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">4</div>
              <div className="text-sm text-gray-600">Cooperativas locales</div>
            </div>
          </div>
        </div>

        {/* Main tabs content */}
        <Tabs defaultValue="programa" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programa">El programa</TabsTrigger>
            <TabsTrigger value="alianzas">Alianzas locales</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
          </TabsList>
          
          {/* Programa tab */}
          <TabsContent value="programa" className="space-y-8 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-asram" />
                  Componentes del programa
                </CardTitle>
                <CardDescription>
                  ASRAM Rural adapta nuestro modelo urbano a las necesidades específicas de las zonas rurales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-lg border p-5 hover:border-asram transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Puntos de recolección local</h3>
                        <p className="text-gray-600">
                          Instalamos puntos de recogida adaptados a las necesidades específicas de cada población, 
                          considerando sus características únicas.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-5 hover:border-asram transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Talleres gratuitos comunitarios</h3>
                        <p className="text-gray-600">
                          Organizamos sesiones formativas en escuelas rurales y asociaciones locales para concienciar sobre 
                          la importancia del reciclaje de aceite.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-5 hover:border-asram transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Truck className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Rutas de recogida optimizadas</h3>
                        <p className="text-gray-600">
                          Diseñamos circuitos eficientes para minimizar la huella de carbono en el transporte, agrupando 
                          municipios cercanos en una misma ruta.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-5 hover:border-asram transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Building className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Alianzas con cooperativas locales</h3>
                        <p className="text-gray-600">
                          Colaboramos con entidades del territorio para fortalecer el tejido social y económico, creando 
                          oportunidades para el desarrollo local.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-asram-50/50 rounded-lg border border-asram-100">
                  <h3 className="font-semibold text-lg mb-3">Adaptación a contextos rurales</h3>
                  <p className="mb-4">
                    El programa ASRAM Rural reconoce las características únicas de las comunidades rurales y adapta 
                    sus servicios para maximizar su impacto:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-asram flex items-center justify-center text-white">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Distancias y accesibilidad:</span> Planificación de rutas que 
                        consideren la dispersión geográfica y el estado de los accesos.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-asram flex items-center justify-center text-white">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Estacionalidad:</span> Ajuste de frecuencias de recogida según 
                        variaciones poblacionales durante temporadas turísticas.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-asram flex items-center justify-center text-white">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Coordinación con agendas locales:</span> Sincronización con ferias, 
                        mercados y eventos locales para maximizar la participación.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-asram flex items-center justify-center text-white">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Vinculación con identidad local:</span> Integración del programa 
                        con valores culturales y tradiciones de cada comunidad.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Formulario de inscripción */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-asram" />
                  Lleva ASRAM Rural a tu municipio
                </CardTitle>
                <CardDescription>
                  Completa el formulario para solicitar información sobre el programa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre de contacto *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                        placeholder="600 000 000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoSolicitante">Tipo de solicitante *</Label>
                      <Select 
                        value={formData.tipoSolicitante} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSolicitante: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ayuntamiento">Ayuntamiento</SelectItem>
                          <SelectItem value="cooperativa">Cooperativa local</SelectItem>
                          <SelectItem value="asociacion">Asociación vecinal</SelectItem>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizacion">Municipio u organización *</Label>
                    <Input
                      id="organizacion"
                      value={formData.organizacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                      placeholder="Nombre del municipio o entidad"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Ubicación/Comarca</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Sierra Norte, Valle del Lozoya..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Cuéntanos sobre tu municipio</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Número de habitantes, situación actual del reciclaje, necesidades específicas..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-asram hover:bg-asram-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Solicitar información
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Alianzas tab */}
          <TabsContent value="alianzas" className="space-y-8 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-asram" />
                  Alianzas con cooperativas locales
                </CardTitle>
                <CardDescription>
                  Colaboramos con entidades rurales para fortalecer el tejido socioeconómico local
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-600">Organización</th>
                          <th className="text-left p-3 font-medium text-gray-600">Localidad</th>
                          <th className="text-left p-3 font-medium text-gray-600">Tipo</th>
                          <th className="text-left p-3 font-medium text-gray-600">Miembros</th>
                          <th className="text-left p-3 font-medium text-gray-600">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {partnerships.map((partner, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 font-medium">{partner.name}</td>
                            <td className="p-3">{partner.location}</td>
                            <td className="p-3">{partner.type}</td>
                            <td className="p-3">{partner.members}</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" className="text-asram">
                                Ver detalles
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Beneficios de las alianzas locales</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Fortalecimiento de la economía local</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Mayor alcance en zonas de difícil acceso</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Aprovechamiento de conocimiento local</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Creación de empleo rural</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Integración en redes locales existentes</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p>Sensibilización adaptada al contexto</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">¿Interesado en colaborar?</h3>
                      <Button className="bg-asram hover:bg-asram-700" asChild>
                        <Link to="/contacto">
                          Contactar ahora
                        </Link>
                      </Button>
                    </div>
                    <p className="text-gray-600">
                      Si representas a una cooperativa, asociación o entidad local y quieres formar parte de 
                      ASRAM Rural, contacta con nosotros para explorar posibles vías de colaboración.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resultados tab */}
          <TabsContent value="resultados" className="space-y-8 mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-asram" />
                    Municipios participantes
                  </CardTitle>
                  <CardDescription>
                    Localidades que actualmente participan en ASRAM Rural
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {localities.map((locality, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{locality.name}</div>
                          <div className="text-sm text-gray-500">{locality.region}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">{locality.households} hogares</div>
                          </div>
                          <Badge className={locality.status === "activo" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                            {locality.status === "activo" ? "Activo" : "Próximamente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-2 text-sm text-gray-500 text-center">
                    Mostrando 6 de 12 municipios participantes
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de impacto</CardTitle>
                  <CardDescription>
                    Resultados del programa ASRAM Rural desde su inicio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Aceite reciclado (litros)</h3>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-asram rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>0 L</span>
                        <span className="font-medium">1.250 L</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">75% del objetivo anual de 1.500 L</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-asram">985</div>
                        <div className="text-sm text-gray-500">Hogares participantes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-asram">24</div>
                        <div className="text-sm text-gray-500">Puntos de recogida</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-asram">18</div>
                        <div className="text-sm text-gray-500">Talleres realizados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-asram">8</div>
                        <div className="text-sm text-gray-500">Rutas establecidas</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Impacto medioambiental estimado</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Agua no contaminada:</span>
                          <span className="font-medium">1.250.000 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CO₂ no emitido:</span>
                          <span className="font-medium">3.750 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equivalente a árboles:</span>
                          <span className="font-medium">187 árboles/año</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm text-center">
                        La iniciativa ASRAM Rural ha crecido un <span className="font-bold text-green-700">35%</span> en el último año
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximas expansiones</CardTitle>
                <CardDescription>
                  Municipios donde ASRAM Rural llegará próximamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Manzanares El Real</h3>
                      <Badge variant="outline">Fase 1</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Sierra de Guadarrama</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Inicio estimado:</span>
                        <span>Junio 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Puntos previstos:</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Valle de Lozoya</h3>
                      <Badge variant="outline">Fase 1</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Sierra Norte</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Inicio estimado:</span>
                        <span>Julio 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Puntos previstos:</span>
                        <span>3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Rascafría</h3>
                      <Badge variant="outline">Fase 2</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Sierra Norte</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Inicio estimado:</span>
                        <span>Sept 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Puntos previstos:</span>
                        <span>4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AsramRural;
