import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Leaf, Lightbulb, Users, Award, ExternalLink, CheckCircle, Calendar, Clock, Map, FileText, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const inscripcionSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().max(20).optional(),
  organizacion: z.string().trim().min(1, "El nombre del centro es obligatorio").max(200),
  direccion: z.string().trim().max(500).optional(),
  etapasEducativas: z.array(z.string()).min(1, "Selecciona al menos una etapa educativa"),
  mensaje: z.string().trim().max(1000).optional(),
});

const AlianzaVerde = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    organizacion: "",
    direccion: "",
    etapasEducativas: [] as string[],
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEtapaChange = (etapa: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      etapasEducativas: checked 
        ? [...prev.etapasEducativas, etapa]
        : prev.etapasEducativas.filter(e => e !== etapa)
    }));
  };

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
          programa: 'alianza-verde',
          ...formData
        }
      });

      if (error) throw error;

      toast.success("¡Inscripción enviada! Te contactaremos pronto.");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        organizacion: "",
        direccion: "",
        etapasEducativas: [],
        mensaje: ""
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la inscripción. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <PageLayout 
      title="Alianza Verde Escolar" 
      subtitle="Laboratorios vivos de sostenibilidad en centros educativos"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero section with statistics */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-asram-50">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-asram-200 rounded-full opacity-30 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
                Programa Educativo
              </Badge>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-800"
              >
                Transformando la educación ambiental desde las aulas
              </motion.h2>
              
              <p className="text-lg leading-relaxed">
                La Alianza Verde Escolar es el proyecto de ASRAM orientado a transformar la educación 
                ambiental en los centros educativos, concibiéndolos como auténticos "laboratorios vivos" 
                de sostenibilidad donde el alumnado se convierte en agente de cambio.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-asram hover:bg-asram-700">
                  <Link to="/contacto">Inscribe tu centro</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Descargar dossier
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/lovable-uploads/6ed9ed5f-1664-4fea-8130-f44cdedf4985.png" 
                alt="ASRAM Alianza Verde" 
                className="w-full h-auto max-w-sm mx-auto object-contain rounded-xl"
              />
              
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 rotate-2">
                <div className="flex items-center space-x-2 text-asram font-semibold">
                  <Award className="h-5 w-5" />
                  <span>Proyecto certificado</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t">
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">50+</div>
              <div className="text-sm text-gray-600">Centros educativos</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">5.000+</div>
              <div className="text-sm text-gray-600">Estudiantes</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">50+</div>
              <div className="text-sm text-gray-600">Talleres realizados</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">3</div>
              <div className="text-sm text-gray-600">Niveles de certificación</div>
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="programa" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programa">El programa</TabsTrigger>
            <TabsTrigger value="actividades">Actividades</TabsTrigger>
            <TabsTrigger value="participar">Cómo participar</TabsTrigger>
          </TabsList>
          
          {/* Programa content */}
          <TabsContent value="programa" className="space-y-6 mt-6">
            <Card className="bg-white/70 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle>¿Qué es la Alianza Verde Escolar?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-asram/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-6 h-6 text-asram" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Misión</h3>
                      <p>Convertir las escuelas en espacios comprometidos con el medio ambiente, formando a estudiantes 
                      capaces de idear y ejecutar soluciones reales a los retos ecológicos.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-asram/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-asram" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Visión</h3>
                      <p>Impulsar un movimiento que vaya más allá de la teoría, fomentando el aprendizaje 
                      experiencial y la participación activa de toda la comunidad educativa.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-asram/10 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-asram" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Metodología</h3>
                      <p>Diseñamos talleres y actividades adaptados a cada etapa educativa (desde primaria hasta formación 
                      de adultos), priorizando la "diversión" como motor de compromiso y combinando teoría con experiencias 
                      vivenciales que refuercen el vínculo entre el alumnado y la naturaleza.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <Award className="h-5 w-5" /> 
                        Certificación Verde
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Los centros participantes pueden obtener diferentes niveles de certificación según su grado de compromiso e implementación:</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">Nivel 1</Badge>
                          <span>Centro Comprometido</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-200 text-green-800">Nivel 2</Badge>
                          <span>Centro Verde</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-300 text-green-800">Nivel 3</Badge>
                          <span>Centro Ecosistema</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-asram-200 bg-asram-50/50">
                    <CardHeader>
                      <CardTitle className="text-asram-700 flex items-center gap-2">
                        <Map className="h-5 w-5" />
                        Impacto en Madrid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                          <span>Distritos participantes:</span>
                          <span className="font-semibold">14/21</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span>Litros de aceite recolectados:</span>
                          <span className="font-semibold">10.000 L</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span>Contaminación de agua evitada:</span>
                          <span className="font-semibold">1.245.000 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CO₂ no emitido:</span>
                          <span className="font-semibold">3.735 kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Actividades content */}
          <TabsContent value="actividades" className="space-y-6 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Actividades del programa</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Taller jabon de la abuela con aceite reciclado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Taller escolar de jabón con aceite reciclado: el alumnado aprende a reutilizar aceite usado para fabricar jabón artesanal. Una actividad práctica y divertida que enseña química básica, reciclaje y sostenibilidad. ¡Cuidamos el planeta con nuestras propias manos!.</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="text-xs">Primaria</Badge>
                      <Badge variant="outline" className="text-xs">ESO</Badge>
                      <Badge variant="outline" className="text-xs">Bachillerato</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                      <School className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle> Taller de Velas Infinitas con Aceite Reciclado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Taller escolar de Velas Infinitas con aceite reciclado: una actividad creativa y educativa donde el alumnado aprende a reutilizar aceite usado para crear velas sostenibles. Fomentamos el reciclaje, el consumo responsable y el cuidado del medioambiente. ¡Aprender haciendo y creando luz!.</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="text-xs">Primaria</Badge>
                      <Badge variant="outline" className="text-xs">ESO</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Taller Escolar de Fabricación de Biodiésel con Aceite Reciclado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Taller escolar de fabricación de biodiésel: el alumnado aprende a transformar aceite usado en combustible de forma segura y práctica. Una experiencia educativa que conecta ciencia, sostenibilidad y economía circular. ¡Convierte residuos en energía y conciencia ambiental!</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="text-xs">ESO</Badge>
                      <Badge variant="outline" className="text-xs">Bachillerato</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Formación de Embajadores Verdes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Capacitación de alumnos como líderes ambientales que promueven buenas prácticas entre sus compañeros y en sus hogares, creando una red de jóvenes comprometidos.</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="text-xs">ESO</Badge>
                      <Badge variant="outline" className="text-xs">Primaria</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow md:col-span-2">
                  <CardHeader>
                    <CardTitle>Próximos talleres programados</CardTitle>
                    <CardDescription>
                      Calendario de actividades para el trimestre actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-asram-100 text-asram-800 p-2 rounded-md w-10 h-10 flex items-center justify-center">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Taller Jabón Casero</div>
                            <div className="text-sm text-muted-foreground">CEIP </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">12 Mayo 2025</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" /> 10:00
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-asram-100 text-asram-800 p-2 rounded-md w-10 h-10 flex items-center justify-center">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Mini Huerto Urbano</div>
                            <div className="text-sm text-muted-foreground">Colegio </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">20 Mayo 2025</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" /> 16:30
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-asram-100 text-asram-800 p-2 rounded-md w-10 h-10 flex items-center justify-center">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Energía Solar</div>
                            <div className="text-sm text-muted-foreground">IES </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">5 Junio 2025</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" /> 12:15
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Cómo participar content */}
          <TabsContent value="participar" className="space-y-6 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Cómo participar</h2>
              
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Contacta con ASRAM</h3>
                          <p>Escribe a <a href="mailto:alianzaverde@asramadrid.com" className="text-asram hover:underline">colabora@asramadrid.com</a> o llama al +34 695 83 17 84.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Reunión inicial</h3>
                          <p>Un representante de ASRAM visitará tu centro para presentar el programa y adaptarlo a vuestras necesidades.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Firma del convenio</h3>
                          <p>Estableceremos un acuerdo de colaboración detallando las actividades y compromisos.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">4</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Comienza la transformación verde</h3>
                          <p>Implementación del programa con seguimiento continuo de nuestro equipo.</p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="bg-asram hover:bg-asram-700 w-full" asChild>
                          <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4/viewform" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Formulario de inscripción
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Beneficios para tu centro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Talleres gratuitos adaptados a las diferentes etapas educativas.</p>
                      </div>
                      
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Instalación de un Punto Verde para la recogida de aceite usado.</p>
                      </div>
                      
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Materiales didácticos sobre sostenibilidad y economía circular.</p>
                      </div>
                      
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Certificación oficial como Centro Verde de ASRAM.</p>
                      </div>
                      
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Informes trimestrales sobre el impacto ambiental generado.</p>
                      </div>
                      
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p>Participación en la red de centros verdes de Madrid.</p>
                      </div>
                      
                      <div className="mt-6 p-4 bg-asram-50 rounded-lg border border-asram-100">
                        <p className="text-sm text-center">
                          Actualmente quedan <span className="font-bold text-asram">25 plazas</span> disponibles para el curso escolar 2025-2026
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Reconocimientos</h2>
              <Card className="bg-white/50 backdrop-blur-sm shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Award className="w-8 h-8 text-asram" />
                  <div>
                    <CardTitle>Certificación de Centro Verde</CardTitle>
                    <CardDescription>Reconocimiento oficial del compromiso con la sostenibilidad</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Los centros participantes reciben una certificación oficial como "Centro Verde" de ASRAM, reconociendo su compromiso con la sostenibilidad y la educación ambiental. Esta certificación incluye:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-center mb-2">
                        <Badge className="bg-green-100 text-green-800">Nivel 1</Badge>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Placa física para el centro</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Materiales digitales</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>2 talleres anuales</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-center mb-2">
                        <Badge className="bg-green-200 text-green-800">Nivel 2</Badge>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Todo lo del Nivel 1</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>4 talleres anuales</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Informes de impacto</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-center mb-2">
                        <Badge className="bg-green-300 text-green-800">Nivel 3</Badge>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Todo lo del Nivel 2</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Proyecto personalizado</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Mención en web ASRAM</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Formulario de inscripción */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-asram" />
                  Inscribe tu centro educativo
                </CardTitle>
                <CardDescription>
                  Completa el formulario para unirte a la Alianza Verde Escolar
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
                      <Label htmlFor="organizacion">Nombre del centro educativo *</Label>
                      <Input
                        id="organizacion"
                        value={formData.organizacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                        placeholder="CEIP, IES, Colegio..."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección del centro</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Calle, número, código postal, ciudad"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Etapas educativas *</Label>
                    <div className="flex flex-wrap gap-4">
                      {['Infantil', 'Primaria', 'ESO', 'Bachillerato', 'FP'].map((etapa) => (
                        <div key={etapa} className="flex items-center space-x-2">
                          <Checkbox
                            id={etapa}
                            checked={formData.etapasEducativas.includes(etapa)}
                            onCheckedChange={(checked) => handleEtapaChange(etapa, checked as boolean)}
                          />
                          <label htmlFor={etapa} className="text-sm cursor-pointer">{etapa}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje o información adicional</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Cuéntanos sobre tu centro, número de alumnos, intereses específicos..."
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
                        Enviar inscripción
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AlianzaVerde;
