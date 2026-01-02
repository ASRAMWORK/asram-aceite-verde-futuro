import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Baby, BookOpen, Palette, Sparkles, Users, Calendar, ArrowRight, Send, Loader2, Heart, Star, Smile, Music, Puzzle, TreeDeciduous, Recycle } from "lucide-react";
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

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const activities = [
    {
      icon: BookOpen,
      title: "Cuentacuentos Verdes",
      desc: "Narraciones interactivas que transmiten valores de cuidado y respeto por el medio ambiente a través de historias protagonizadas por gotas de aceite, árboles y otros elementos naturales.",
      ages: "3-8 años",
      color: "bg-blue-100 text-blue-700",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    },
    {
      icon: Palette,
      title: "Manualidades Sostenibles",
      desc: "Talleres donde los niños crean juguetes, instrumentos musicales y objetos decorativos a partir de materiales reciclados, desarrollando su creatividad.",
      ages: "5-12 años",
      color: "bg-purple-100 text-purple-700",
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80"
    },
    {
      icon: Puzzle,
      title: "Juegos de Reciclaje",
      desc: "Actividades interactivas donde aprenden a clasificar residuos de forma divertida, con dinámicas adaptadas a diferentes edades.",
      ages: "4-10 años",
      color: "bg-green-100 text-green-700",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80"
    },
    {
      icon: TreeDeciduous,
      title: "Mini Jardinería",
      desc: "Iniciación al cuidado de plantas y cultivo de pequeños huertos usando materiales reciclados como macetas. Los niños aprenden el ciclo de vida de las plantas.",
      ages: "5-10 años",
      color: "bg-emerald-100 text-emerald-700",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80"
    },
    {
      icon: Music,
      title: "Eco-Música",
      desc: "Creación de instrumentos musicales con materiales reciclados. Los niños construyen maracas, tambores y más mientras aprenden sobre reutilización.",
      ages: "4-8 años",
      color: "bg-orange-100 text-orange-700",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    },
    {
      icon: Sparkles,
      title: "Teatro Ecológico",
      desc: "Representaciones teatrales sobre temas medioambientales donde los niños actúan y aprenden sobre la importancia de cuidar el planeta.",
      ages: "6-12 años",
      color: "bg-pink-100 text-pink-700",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80"
    }
  ];

  const testimonials = [
    { 
      name: "María Rodríguez", 
      role: "Profesora de infantil", 
      text: "Los niños esperan con ilusión los talleres de ASRAM Kids. Han aprendido tanto sobre reciclaje mientras se divierten.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    { 
      name: "Carlos Jiménez", 
      role: "Director de colegio", 
      text: "El programa ha conseguido que los más pequeños traigan aceite usado de casa y entiendan por qué es importante reciclarlo.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    { 
      name: "Ana Martín", 
      role: "Madre de Pablo (6 años)", 
      text: "Mi hijo ahora me corrige en casa cuando ve que voy a tirar el aceite por el fregadero. ¡Increíble el impacto!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    }
  ];

  return (
    <PageLayout 
      title="ASRAM Kids" 
      subtitle="Actividades lúdico-educativas para los más pequeños"
    >
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-16 mb-16">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&q=80"
            alt="Niños aprendiendo sobre el medio ambiente"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-800/70 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-white space-y-6"
            >
              <motion.div variants={fadeIn}>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  <Baby className="w-4 h-4 mr-2" />
                  Para niños de 3 a 12 años
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Aprender cuidando el planeta es
                <span className="text-yellow-300"> ¡súper divertido!</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/90 leading-relaxed">
                ASRAM Kids es un espacio lúdico-educativo donde los más pequeños desarrollan 
                conciencia medioambiental a través de juegos, cuentos y actividades adaptadas a su edad.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                  <Smile className="w-5 h-5 mr-2" />
                  Solicitar actividad
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver catálogo de actividades
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-white shadow-xl -mt-16 relative z-10 mx-4 md:mx-8 lg:mx-16 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "2.000+", label: "Niños participantes", icon: Baby },
              { value: "50+", label: "Centros escolares", icon: BookOpen },
              { value: "100+", label: "Talleres realizados", icon: Sparkles },
              { value: "12", label: "Tipos de actividades", icon: Puzzle }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 md:p-8 text-center"
              >
                <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Sobre ASRAM Kids */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn} className="space-y-6">
            <Badge className="bg-purple-100 text-purple-800">Sobre el programa</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Jugando hoy, protegiendo el mañana
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              ASRAM Kids nace como complemento de nuestra Alianza Verde Escolar, pero enfocado 
              específicamente en los más pequeños. Creemos que la mejor manera de crear una 
              generación comprometida con el medio ambiente es empezar desde la infancia.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestras actividades están diseñadas por pedagogos y expertos en medio ambiente 
              para garantizar que cada niño aprenda mientras se divierte. Utilizamos metodologías 
              de aprendizaje basado en el juego para que los conceptos de sostenibilidad se 
              interioricen de forma natural.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Heart, title: "Con cariño", desc: "Actividades cuidadas" },
                { icon: Smile, title: "Divertido", desc: "Aprender jugando" },
                { icon: Users, title: "En equipo", desc: "Trabajo colaborativo" },
                { icon: Star, title: "Memorable", desc: "Experiencias únicas" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80"
              alt="Niños felices aprendiendo"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-gray-600">Gratuito para centros</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Actividades Section */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-800 mb-4">Nuestras actividades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un mundo de diversión sostenible
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada actividad está diseñada para despertar la curiosidad de los niños 
              sobre el cuidado del medio ambiente de forma lúdica y memorable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 right-4 ${activity.color} px-3 py-1 rounded-full text-xs font-medium`}>
                    {activity.ages}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">{activity.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{activity.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dónde realizamos actividades */}
        <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-purple-100 text-purple-800">Lugares</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Llevamos la diversión a donde estés
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nuestras actividades pueden realizarse en múltiples espacios. 
                Nos adaptamos a tus necesidades y las de tu comunidad.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: BookOpen, title: "Centros educativos", desc: "Colegios, guarderías e institutos" },
                  { icon: Baby, title: "Bibliotecas públicas", desc: "Espacios culturales de tu barrio" },
                  { icon: TreeDeciduous, title: "Parques y espacios verdes", desc: "Actividades al aire libre" },
                  { icon: Calendar, title: "Eventos familiares", desc: "Fiestas y celebraciones sostenibles" },
                  { icon: Users, title: "Campamentos de verano", desc: "Semanas temáticas de reciclaje" }
                ].map((place, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <place.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{place.title}</h4>
                      <p className="text-sm text-gray-600">{place.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 font-medium">
                  ✨ Todas las actividades son gratuitas para centros que participan en la Alianza Verde Escolar
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80"
                alt="Actividad en colegio"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1564429238535-db6caf0c5809?w=400&q=80"
                alt="Actividad en parque"
                className="w-full h-48 object-cover rounded-xl shadow-lg mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80"
                alt="Niños aprendiendo"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80"
                alt="Taller de reciclaje"
                className="w-full h-48 object-cover rounded-xl shadow-lg mt-8"
              />
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-pink-100 text-pink-800 mb-4">Testimonios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen de nosotros
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Formulario */}
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">Solicita una actividad</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                ¡Trae ASRAM Kids a tu centro!
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Nuestro equipo de educadores ambientales está listo para llevar la 
                diversión sostenible a tu colegio, biblioteca o evento.
              </p>
              
              <div className="space-y-4">
                {[
                  "Actividades adaptadas a cada grupo de edad",
                  "Materiales incluidos en cada taller",
                  "Educadores especializados",
                  "Certificado de participación",
                  "Seguimiento y evaluación del aprendizaje"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Recycle className="w-12 h-12 text-yellow-300" />
                <div>
                  <div className="font-semibold">¿Ya participas en la Alianza Verde?</div>
                  <div className="text-sm text-white/80">Las actividades son 100% gratuitas para ti</div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Formulario de solicitud</CardTitle>
                <CardDescription>Completa tus datos y organizamos una actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Tu nombre"
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
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="organizacion">Centro/Organización *</Label>
                      <Input
                        id="organizacion"
                        value={formData.organizacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                        placeholder="Nombre del centro"
                        required
                      />
                    </div>
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
                        <SelectItem value="colegio">Colegio / Guardería</SelectItem>
                        <SelectItem value="biblioteca">Biblioteca</SelectItem>
                        <SelectItem value="centro_cultural">Centro cultural</SelectItem>
                        <SelectItem value="campamento">Campamento</SelectItem>
                        <SelectItem value="evento">Evento privado</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">¿Qué actividad te interesa?</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Cuéntanos qué actividad te gustaría, edades de los niños, fechas..."
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Solicitar actividad
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Quieres saber más sobre ASRAM Kids?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos encantados de responder todas tus preguntas sobre nuestras actividades infantiles
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/contacto">Contáctanos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/alianza-verde">
                Ver Alianza Verde Escolar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AsramKids;
