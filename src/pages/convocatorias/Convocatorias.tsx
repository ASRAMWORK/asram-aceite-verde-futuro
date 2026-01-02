import React, { useState, useEffect } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Leaf, 
  SprayCan, 
  Building2, 
  Zap, 
  Baby, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Users,
  Heart,
  Sparkles,
  Award,
  Gift,
  Recycle,
  HandHeart,
  Shield
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface Convocatoria {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  bonificacion_maxima: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  requisitos: string[];
  documentos_requeridos: string[];
}

const categoriaIconos: Record<string, React.ReactNode> = {
  jardineria: <Leaf className="w-8 h-8" />,
  limpieza: <SprayCan className="w-8 h-8" />,
  porteria: <Building2 className="w-8 h-8" />,
  electricidad: <Zap className="w-8 h-8" />,
  infantil: <Baby className="w-8 h-8" />,
};

const categoriaColores: Record<string, string> = {
  jardineria: 'bg-green-100 text-green-800 border-green-200',
  limpieza: 'bg-blue-100 text-blue-800 border-blue-200',
  porteria: 'bg-purple-100 text-purple-800 border-purple-200',
  electricidad: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  infantil: 'bg-pink-100 text-pink-800 border-pink-200',
};

const estadoBadge: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  abierta: { 
    color: 'bg-green-500 text-white', 
    icon: <CheckCircle2 className="w-4 h-4" />, 
    label: 'Convocatoria Abierta' 
  },
  proxima: { 
    color: 'bg-amber-500 text-white', 
    icon: <Clock className="w-4 h-4" />, 
    label: 'Próximamente' 
  },
  cerrada: { 
    color: 'bg-gray-500 text-white', 
    icon: <AlertCircle className="w-4 h-4" />, 
    label: 'Cerrada' 
  },
};

const programasASRAM = [
  'Recogida de Aceite Usado',
  'Alianza Verde Escolar',
  'ASRAM Kids',
  'Puntos Verdes',
  'ASRAM Rural',
  'Apadrina una Calle',
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_comunidad: '',
    cif: '',
    direccion: '',
    codigo_postal: '',
    ciudad: '',
    provincia: '',
    nombre_contacto: '',
    email: '',
    telefono: '',
    numero_viviendas: '',
    participa_programa: false,
    programa_participacion: '',
    observaciones: '',
  });

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      const { data, error } = await supabase
        .from('convocatorias')
        .select('*')
        .order('estado', { ascending: true })
        .order('fecha_inicio', { ascending: true });

      if (error) throw error;
      setConvocatorias(data || []);
    } catch (error) {
      console.error('Error fetching convocatorias:', error);
      toast.error('Error al cargar las convocatorias');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, participa_programa: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvocatoria) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('solicitudes_convocatoria')
        .insert({
          convocatoria_id: selectedConvocatoria.id,
          nombre_comunidad: formData.nombre_comunidad.trim(),
          cif: formData.cif.trim().toUpperCase(),
          direccion: formData.direccion.trim(),
          codigo_postal: formData.codigo_postal.trim(),
          ciudad: formData.ciudad.trim(),
          provincia: formData.provincia.trim(),
          nombre_contacto: formData.nombre_contacto.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.telefono.trim(),
          numero_viviendas: formData.numero_viviendas ? parseInt(formData.numero_viviendas) : null,
          participa_programa: formData.participa_programa,
          programa_participacion: formData.programa_participacion || null,
          observaciones: formData.observaciones.trim() || null,
        });

      if (error) throw error;

      const emailPayload = {
        convocatoria_nombre: selectedConvocatoria.nombre,
        nombre_comunidad: formData.nombre_comunidad.trim(),
        cif: formData.cif.trim().toUpperCase(),
        direccion: formData.direccion.trim(),
        codigo_postal: formData.codigo_postal.trim(),
        ciudad: formData.ciudad.trim(),
        provincia: formData.provincia.trim(),
        nombre_contacto: formData.nombre_contacto.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        numero_viviendas: formData.numero_viviendas ? parseInt(formData.numero_viviendas) : null,
        participa_programa: formData.participa_programa,
        programa_participacion: formData.programa_participacion || null,
        observaciones: formData.observaciones.trim() || null,
      };

      const { error: emailError } = await supabase.functions.invoke('send-solicitud-convocatoria', {
        body: emailPayload,
      });

      if (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      toast.success('Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.');
      setDialogOpen(false);
      setFormData({
        nombre_comunidad: '',
        cif: '',
        direccion: '',
        codigo_postal: '',
        ciudad: '',
        provincia: '',
        nombre_contacto: '',
        email: '',
        telefono: '',
        numero_viviendas: '',
        participa_programa: false,
        programa_participacion: '',
        observaciones: '',
      });
    } catch (error) {
      console.error('Error submitting solicitud:', error);
      toast.error('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const openSolicitudDialog = (convocatoria: Convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const convocatoriasAbiertas = convocatorias.filter(c => c.estado === 'abierta');
  const convocatoriasProximas = convocatorias.filter(c => c.estado === 'proxima');
  const convocatoriasCerradas = convocatorias.filter(c => c.estado === 'cerrada');

  return (
    <PageLayout 
      title="Convocatorias y Ayudas" 
      subtitle="Programa de ayudas sociales para comunidades de propietarios"
    >
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-16 mb-16">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1920&q=80"
            alt="Comunidad sostenible y solidaria"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-asram-900/90 via-green-800/70 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-white space-y-6"
            >
              <motion.div variants={fadeIn}>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Nuevo en 2025
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Economía 360° para una vida mejor
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/90 leading-relaxed">
                Programa innovador de ayudas sociales diseñado para mejorar la calidad de vida 
                de particulares y comunidades de propietarios a través de la economía circular.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-white text-asram-800 hover:bg-white/90">
                  <Gift className="w-5 h-5 mr-2" />
                  Ver convocatorias
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Cómo participar
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-white shadow-xl -mt-16 relative z-10 mx-4 md:mx-8 lg:mx-16 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "50%", label: "Bonificación máxima", icon: Award },
              { value: "5+", label: "Tipos de servicios", icon: Leaf },
              { value: "100+", label: "Familias beneficiadas", icon: Users },
              { value: "24/7", label: "Soporte disponible", icon: Shield }
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
        {/* Qué ofrecemos */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn} className="space-y-6">
            <Badge className="bg-asram-100 text-asram-800">Sobre el programa</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ayudas para comunidades comprometidas
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Desde ASRAM lanzamos un innovador programa de ayudas sociales diseñado para 
              mejorar la calidad de vida de particulares y comunidades de propietarios a 
              través de técnicas de economía circular y sostenible.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Las comunidades que participan activamente en nuestros programas de reciclaje 
              pueden acceder a bonificaciones de hasta el 50% en servicios esenciales.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Leaf, title: "Jardinería", desc: "Mantenimiento de zonas verdes" },
                { icon: SprayCan, title: "Limpieza", desc: "Servicios de limpieza" },
                { icon: Building2, title: "Portería", desc: "Conserjería y vigilancia" },
                { icon: Zap, title: "Electricidad", desc: "Optimización energética" }
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
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80"
              alt="Comunidad de vecinos"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <HandHeart className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Hasta 50%</div>
                  <div className="text-gray-600">de bonificación</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Requisito importante */}
        <section className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 bg-amber-100 rounded-xl">
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-amber-900">Requisito importante</h3>
              <p className="text-lg text-amber-800">
                Estas ayudas están exclusivamente dirigidas a comunidades de propietarios y particulares 
                que sean <strong>participantes activos</strong> de alguno de nuestros programas (Recogida de Aceite, 
                Alianza Verde, ASRAM Kids, Puntos Verdes, etc.).
              </p>
              <p className="text-amber-700">
                Si aún no participas en ningún programa, <a href="/contacto" className="underline font-medium">contacta con nosotros</a> para inscribirte primero.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Recogida de Aceite', 'Alianza Verde', 'ASRAM Kids', 'Puntos Verdes', 'ASRAM Rural'].map((prog, i) => (
                  <Badge key={i} className="bg-amber-200 text-amber-800">{prog}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Convocatorias Abiertas */}
        {convocatoriasAbiertas.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-500 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Convocatorias Abiertas</h2>
                <p className="text-gray-600">Solicita ahora y accede a los beneficios</p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {convocatoriasAbiertas.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-green-200 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row">
                      <div className={`p-8 flex items-center justify-center ${categoriaColores[conv.categoria]} lg:w-56`}>
                        <div className="text-center">
                          {categoriaIconos[conv.categoria]}
                          <p className="mt-3 font-bold capitalize text-lg">{conv.categoria}</p>
                        </div>
                      </div>
                      <div className="flex-1 p-6 lg:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <Badge className={estadoBadge[conv.estado].color + " mb-2"}>
                              {estadoBadge[conv.estado].icon}
                              <span className="ml-1">{estadoBadge[conv.estado].label}</span>
                            </Badge>
                            <h3 className="text-2xl font-bold text-gray-900">{conv.nombre}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-asram">Hasta {conv.bonificacion_maxima}%</div>
                            <div className="text-gray-500">de bonificación</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-lg mb-6">{conv.descripcion}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-asram" />
                              Requisitos
                            </h4>
                            <ul className="space-y-2">
                              {conv.requisitos?.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-asram" />
                              Documentación
                            </h4>
                            <ul className="space-y-2">
                              {conv.documentos_requeridos?.map((doc, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-600">
                                  <ChevronRight className="w-4 h-4 text-asram flex-shrink-0 mt-1" />
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-5 h-5" />
                            <span>Plazo: {formatDate(conv.fecha_inicio)} - {formatDate(conv.fecha_fin)}</span>
                          </div>
                          <Button 
                            size="lg" 
                            className="bg-asram hover:bg-asram-600"
                            onClick={() => openSolicitudDialog(conv)}
                          >
                            Solicitar ayuda
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Próximas Convocatorias */}
        {convocatoriasProximas.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Próximas Convocatorias</h2>
                <p className="text-gray-600">Próximamente disponibles</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {convocatoriasProximas.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-amber-200 opacity-80 hover:opacity-100 transition-opacity">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl ${categoriaColores[conv.categoria]} flex items-center justify-center mb-4`}>
                        {categoriaIconos[conv.categoria]}
                      </div>
                      <Badge className={estadoBadge[conv.estado].color + " w-fit"}>
                        {estadoBadge[conv.estado].icon}
                        <span className="ml-1">{estadoBadge[conv.estado].label}</span>
                      </Badge>
                      <CardTitle className="mt-2">{conv.nombre}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{conv.descripcion}</p>
                      <div className="text-2xl font-bold text-asram">Hasta {conv.bonificacion_maxima}%</div>
                      <div className="text-sm text-gray-500 mt-2">
                        Disponible a partir del {formatDate(conv.fecha_inicio)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Cómo funciona */}
        <section className="bg-gradient-to-br from-asram-50 to-green-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <Badge className="bg-asram-100 text-asram-800 mb-4">El proceso</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo solicitar una ayuda?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Verifica tu elegibilidad", desc: "Asegúrate de participar en algún programa ASRAM" },
              { step: "2", title: "Elige la convocatoria", desc: "Selecciona el servicio que necesitas" },
              { step: "3", title: "Completa la solicitud", desc: "Rellena el formulario con los datos requeridos" },
              { step: "4", title: "Recibe tu bonificación", desc: "Disfruta del descuento en tu factura" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-asram text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tienes dudas sobre las convocatorias?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para ayudarte con cualquier consulta sobre el programa de ayudas
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/contacto">Contáctanos</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/puntos-verdes">
                Únete a un programa
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </section>
      </div>

      {/* Dialog de solicitud */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Solicitud de ayuda</DialogTitle>
            <DialogDescription>
              {selectedConvocatoria?.nombre} - Hasta {selectedConvocatoria?.bonificacion_maxima}% de bonificación
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_comunidad">Nombre de la comunidad *</Label>
                <Input
                  id="nombre_comunidad"
                  name="nombre_comunidad"
                  value={formData.nombre_comunidad}
                  onChange={handleInputChange}
                  placeholder="Comunidad de Propietarios..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cif">CIF *</Label>
                <Input
                  id="cif"
                  name="cif"
                  value={formData.cif}
                  onChange={handleInputChange}
                  placeholder="A12345678"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle, número, piso..."
                required
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_postal">Código postal *</Label>
                <Input
                  id="codigo_postal"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  placeholder="28001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  placeholder="Madrid"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <Input
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                  placeholder="Madrid"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_contacto">Nombre de contacto *</Label>
                <Input
                  id="nombre_contacto"
                  name="nombre_contacto"
                  value={formData.nombre_contacto}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="600 000 000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_viviendas">Número de viviendas</Label>
                <Input
                  id="numero_viviendas"
                  name="numero_viviendas"
                  type="number"
                  value={formData.numero_viviendas}
                  onChange={handleInputChange}
                  placeholder="24"
                />
              </div>
            </div>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="participa_programa"
                  checked={formData.participa_programa}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="participa_programa">
                  Participo en algún programa de ASRAM
                </Label>
              </div>
              
              {formData.participa_programa && (
                <div className="space-y-2">
                  <Label htmlFor="programa_participacion">¿En qué programa participas?</Label>
                  <Select 
                    value={formData.programa_participacion} 
                    onValueChange={(value) => handleSelectChange('programa_participacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un programa" />
                    </SelectTrigger>
                    <SelectContent>
                      {programasASRAM.map((programa) => (
                        <SelectItem key={programa} value={programa}>{programa}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones adicionales</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Cualquier información adicional que quieras compartir..."
                rows={3}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Convocatorias;
