import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, BookOpen, Palette, Sparkles, Users, Calendar, ArrowRight, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const inscripcionSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().max(20).optional(),
  organizacion: z.string().trim().min(1, "El nombre del centro/organización es obligatorio").max(200),
  tipoSolicitante: z.string().min(1, "Selecciona el tipo de centro"),
  mensaje: z.string().trim().max(1000).optional(),
});

const AsramKids = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    organizacion: "",
    tipoSolicitante: "",
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
          programa: 'asram-kids',
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
        mensaje: ""
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data for testimonials and upcoming events
  const testimonials = [
    { name: "María Rodríguez", role: "Profesora de infantil", text: "Los niños esperan con ilusión los talleres de ASRAM Kids. Han aprendido tanto sobre reciclaje mientras se divierten." },
    { name: "Carlos Jiménez", role: "Director", text: "El programa ha conseguido que los más pequeños traigan aceite usado de casa y entiendan por qué es importante reciclarlo." },
    { name: "Ana Martín", role: "Madre de Pablo (6 años)", text: "Mi hijo ahora me corrige en casa cuando ve que voy a tirar el aceite por el fregadero. ¡Increíble el impacto!" }
  ];
  
  const upcomingEvents = [
    { title: "Cuentacuentos: La gota viajera", date: "Continuo", location: "Biblioteca Municipal de Chamberí" },
    { title: "Taller de reciclaje creativo", date: "Continuo", location: "Centro Cultural García Lorca" },
    { title: "Fiesta del reciclaje", date: "Continuo", location: "Parque del Retiro" }
  ];
  
  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <PageLayout 
      title="ASRAM Kids" 
      subtitle="Actividades lúdico-educativas para los más pequeños"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-12">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="space-y-6">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  Aprendiendo hábitos <span className="text-asram">responsables jugando</span>
                </h2>
                
                <p className="mt-4 text-lg leading-relaxed">
                  ASRAM Kids es un espacio lúdico-educativo vinculado a nuestra Alianza Verde Escolar, 
                  donde los más pequeños desarrollan conciencia medioambiental a través de juegos, 
                  cuentos y actividades adaptadas a su edad.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button asChild className="bg-asram hover:bg-asram-700">
                    <Link to="/contacto">Solicitar actividad</Link>
                  </Button>
                  <Button variant="outline">
                    Descargar catálogo
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Niños en un taller de reciclaje" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 rotate-3">
                <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                  <Users className="h-5 w-5" />
                  <span>+2000 niños participantes</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t">
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">50+</div>
              <div className="text-sm text-gray-600">Centros escolares</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">50+</div>
              <div className="text-sm text-gray-600">Talleres realizados</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">2.000+</div>
              <div className="text-sm text-gray-600">Niños participantes</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-asram">12</div>
              <div className="text-sm text-gray-600">Actividades diferentes</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Nuestras actividades</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/70 backdrop-blur-sm border-asram-100">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Cuentacuentos verdes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Narraciones interactivas que transmiten valores de cuidado y respeto por el medio ambiente a través de historias protagonizadas por gotas de aceite, árboles y otros elementos naturales.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Baby className="h-4 w-4 mr-1" /> Edades: 3-8 años
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-asram-100">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Manualidades sostenibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Talleres donde los niños aprenden a crear juguetes, instrumentos musicales y objetos decorativos a partir de materiales reciclados, desarrollando su creatividad mientras entienden el valor de reutilizar.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Baby className="h-4 w-4 mr-1" /> Edades: 5-12 años
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-asram-100">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Juegos de reciclaje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Actividades interactivas donde aprenden a clasificar residuos de forma divertida, con dinámicas adaptadas a diferentes edades que convierten la gestión de residuos en una experiencia lúdica.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Baby className="h-4 w-4 mr-1" /> Edades: 4-10 años
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-asram-100">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 mb-2 rounded-full bg-asram/20 flex items-center justify-center">
                      <Baby className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle>Mini jardinería</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Iniciación al cuidado de plantas y cultivo de pequeños huertos usando materiales reciclados como macetas. Los niños aprenden el ciclo de vida de las plantas y a cuidar del medio ambiente.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Baby className="h-4 w-4 mr-1" /> Edades: 5-10 años
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-asram-800 mb-6">Testimonios</h2>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-gray-100 shadow-sm"
                  >
                    <p className="italic text-gray-700 mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-asram-100 rounded-full flex items-center justify-center text-asram-800 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-asram" />
                  Próximos eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="text-sm text-gray-500 flex flex-col gap-1 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Baby className="h-3.5 w-3.5 mr-1.5" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/eventos">
                    Ver todos los eventos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-asram" />
                  Solicita una actividad
                </CardTitle>
                <CardDescription>Lleva ASRAM Kids a tu centro educativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nuestras actividades están diseñadas para adaptarse a diferentes edades y pueden realizarse en:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Centros educativos</li>
                  <li>Bibliotecas públicas</li>
                  <li>Centros culturales</li>
                  <li>Eventos familiares</li>
                  <li>Campamentos de verano</li>
                </ul>
                
                <div className="py-2 px-4 bg-asram-50 rounded-lg mt-2 text-sm">
                  Todas las actividades son gratuitas para centros que participan en la Alianza Verde Escolar
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
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
                    <Label htmlFor="organizacion">Nombre del centro/organización *</Label>
                    <Input
                      id="organizacion"
                      value={formData.organizacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                      placeholder="Centro educativo, biblioteca..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoSolicitante">Tipo de centro *</Label>
                    <Select 
                      value={formData.tipoSolicitante} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSolicitante: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="escuela-infantil">Escuela infantil</SelectItem>
                        <SelectItem value="colegio">Colegio</SelectItem>
                        <SelectItem value="biblioteca">Biblioteca pública</SelectItem>
                        <SelectItem value="centro-cultural">Centro cultural</SelectItem>
                        <SelectItem value="campamento">Campamento de verano</SelectItem>
                        <SelectItem value="evento">Evento familiar</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Actividades de interés o información adicional</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Cuéntanos qué actividades te interesan, edad de los niños, fechas preferidas..."
                      rows={3}
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
                        Solicitar actividad
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impacto educativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span>Talleres realizados:</span>
                    <span className="font-semibold">50+</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Niños sensibilizados:</span>
                    <span className="font-semibold">2.000+</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Litros aceite recolectados:</span>
                    <span className="font-semibold">10.000 L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Familia involucradas:</span>
                    <span className="font-semibold">5.000+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AsramKids;
