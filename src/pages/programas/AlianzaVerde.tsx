import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Leaf, Lightbulb, Users, Award, ExternalLink, CheckCircle, Calendar, Clock, Map, FileText, Send, Loader2, GraduationCap, Recycle, Heart, Target, BookOpen, TreeDeciduous } from "lucide-react";
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

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <PageLayout 
      title="Alianza Verde Escolar" 
      subtitle="Laboratorios vivos de sostenibilidad en centros educativos"
    >
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-16 mb-16">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80"
            alt="Estudiantes aprendiendo sobre sostenibilidad"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-white space-y-6"
            >
              <motion.div variants={fadeIn}>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Programa Educativo Certificado
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transformando la educación ambiental desde las aulas
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/90 leading-relaxed">
                La Alianza Verde Escolar convierte a los centros educativos en auténticos laboratorios vivos 
                de sostenibilidad, donde el alumnado se convierte en agente de cambio real.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-white text-green-800 hover:bg-white/90">
                  <School className="w-5 h-5 mr-2" />
                  Inscribe tu centro
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4" target="_blank" rel="noopener noreferrer">
                    <FileText className="w-5 h-5 mr-2" />
                    Descargar dossier
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-white shadow-xl -mt-16 relative z-10 mx-4 md:mx-8 lg:mx-16 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "50+", label: "Centros educativos", icon: School },
              { value: "5.000+", label: "Estudiantes formados", icon: Users },
              { value: "100+", label: "Talleres realizados", icon: BookOpen },
              { value: "10.000L", label: "Aceite reciclado", icon: Recycle }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 md:p-8 text-center"
              >
                <stat.icon className="w-8 h-8 text-asram mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* ¿Qué es? Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn} className="space-y-6">
            <Badge className="bg-green-100 text-green-800">Sobre el programa</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Educación ambiental que transforma
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              La Alianza Verde Escolar es el proyecto de ASRAM orientado a transformar la educación 
              ambiental en los centros educativos. Concebimos las escuelas como espacios comprometidos 
              con el medio ambiente, formando a estudiantes capaces de idear y ejecutar soluciones 
              reales a los retos ecológicos.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestro enfoque prioriza la diversión como motor de compromiso, combinando teoría 
              con experiencias vivenciales que refuercen el vínculo entre el alumnado y la naturaleza.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Target, title: "Misión", desc: "Formar agentes de cambio" },
                { icon: Lightbulb, title: "Metodología", desc: "Aprendizaje experiencial" },
                { icon: Heart, title: "Valores", desc: "Compromiso y sostenibilidad" },
                { icon: Users, title: "Comunidad", desc: "Red de centros verdes" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-asram/10 rounded-lg">
                    <item.icon className="w-5 h-5 text-asram" />
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
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
              alt="Estudiantes en clase de medio ambiente"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">3 Niveles</div>
                  <div className="text-gray-600">de certificación verde</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Certificación Section */}
        <section className="bg-gradient-to-br from-green-50 to-asram-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Sistema de certificación</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Niveles de Certificación Verde
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los centros participantes pueden obtener diferentes niveles de certificación 
              según su grado de compromiso e implementación del programa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                level: "Nivel 1", 
                name: "Centro Comprometido", 
                color: "bg-green-100 border-green-300",
                badgeColor: "bg-green-500",
                desc: "Primeros pasos en sostenibilidad",
                features: ["Instalación de punto de reciclaje", "Taller introductorio", "Material educativo básico"]
              },
              { 
                level: "Nivel 2", 
                name: "Centro Verde", 
                color: "bg-green-200 border-green-400",
                badgeColor: "bg-green-600",
                desc: "Compromiso activo y constante",
                features: ["Talleres mensuales", "Embajadores verdes", "Certificado oficial"]
              },
              { 
                level: "Nivel 3", 
                name: "Centro Ecosistema", 
                color: "bg-green-300 border-green-500",
                badgeColor: "bg-green-700",
                desc: "Máxima excelencia ambiental",
                features: ["Programa completo anual", "Huerto escolar", "Reconocimiento especial"]
              }
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`${cert.color} border-2 rounded-2xl p-6 relative overflow-hidden`}
              >
                <Badge className={`${cert.badgeColor} text-white mb-4`}>{cert.level}</Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 mb-4">{cert.desc}</p>
                <ul className="space-y-2">
                  {cert.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Actividades Section */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-asram-100 text-asram-800 mb-4">Talleres y actividades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aprende haciendo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diseñamos talleres adaptados a cada etapa educativa, desde primaria hasta bachillerato, 
              priorizando la diversión como motor de compromiso.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Leaf,
                title: "Jabón de la Abuela",
                desc: "Aprende a fabricar jabón artesanal con aceite reciclado de forma segura y divertida.",
                ages: ["Primaria", "ESO", "Bachillerato"],
                image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80"
              },
              {
                icon: Lightbulb,
                title: "Velas Infinitas",
                desc: "Crea velas sostenibles reutilizando aceite usado. Una actividad creativa y educativa.",
                ages: ["Primaria", "ESO"],
                image: "https://images.unsplash.com/photo-1602523961358-f9f03db06e38?w=400&q=80"
              },
              {
                icon: Recycle,
                title: "Biodiésel Casero",
                desc: "Transforma aceite usado en combustible de forma práctica y segura.",
                ages: ["ESO", "Bachillerato"],
                image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80"
              },
              {
                icon: Users,
                title: "Embajadores Verdes",
                desc: "Capacitación de alumnos como líderes ambientales de su comunidad educativa.",
                ages: ["ESO", "Primaria"],
                image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&q=80"
              }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-asram/10 rounded-lg">
                      <activity.icon className="w-5 h-5 text-asram" />
                    </div>
                    <h3 className="font-bold text-gray-900">{activity.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{activity.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {activity.ages.map((age, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{age}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impacto Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
              alt="Impacto ambiental positivo"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <TreeDeciduous className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">14/21</div>
                <div className="text-sm text-gray-600">Distritos de Madrid</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <Badge className="bg-asram-100 text-asram-800">Nuestro impacto</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Resultados que transforman
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Cada litro de aceite que reciclamos con nuestros estudiantes evita la contaminación 
              de miles de litros de agua y se convierte en biocombustible limpio.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "10.000L", label: "Aceite reciclado", desc: "Por nuestros centros" },
                { value: "1.245.000L", label: "Agua protegida", desc: "De contaminación" },
                { value: "3.735kg", label: "CO₂ evitado", desc: "Emisiones reducidas" },
                { value: "50+", label: "Talleres/año", desc: "Realizados" }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-asram">{stat.value}</div>
                  <div className="font-medium text-gray-900">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulario de inscripción */}
        <section className="bg-gradient-to-br from-green-600 to-asram rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">Únete al programa</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Inscribe tu centro educativo
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Forma parte de la red de centros comprometidos con el medio ambiente. 
                La inscripción es completamente gratuita y adaptamos el programa a las 
                necesidades de tu centro.
              </p>
              
              <div className="space-y-4">
                {[
                  "Instalación gratuita de punto de reciclaje",
                  "Talleres adaptados a cada etapa educativa",
                  "Materiales didácticos incluidos",
                  "Certificación oficial de centro verde",
                  "Seguimiento y apoyo continuo"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Formulario de inscripción</CardTitle>
                <CardDescription>Completa tus datos y nos pondremos en contacto</CardDescription>
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
                      <Label htmlFor="organizacion">Centro educativo *</Label>
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
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Dirección del centro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Etapas educativas *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Infantil", "Primaria", "ESO", "Bachillerato", "FP", "Adultos"].map((etapa) => (
                        <label key={etapa} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <Checkbox
                            checked={formData.etapasEducativas.includes(etapa)}
                            onCheckedChange={(checked) => handleEtapaChange(etapa, checked as boolean)}
                          />
                          <span className="text-sm">{etapa}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje adicional</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Cuéntanos más sobre tu centro..."
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-asram hover:bg-asram-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar inscripción
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
            ¿Tienes preguntas sobre el programa?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para resolver cualquier duda sobre la Alianza Verde Escolar
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/contacto">Contáctanos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.google.com/forms/d/1dPmgAZ34cYp6Hve6qsMBq7OCB9cAZkt8wQahhaHScT4" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver dossier completo
              </a>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AlianzaVerde;
