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
  Sparkles
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
      // Save to database
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

      // Send notification email
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
        // Don't throw - the solicitud was saved successfully
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
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-asram-50 via-white to-green-50 rounded-2xl p-8 md:p-12 mb-12 border border-asram-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-asram" />
                <span className="text-asram font-semibold">Nuevo en 2025</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Economía 360° para una vida mejor
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Desde ASRAM lanzamos un innovador programa de ayudas sociales diseñado para mejorar 
                la calidad de vida de particulares y comunidades de propietarios a través de técnicas 
                de economía circular y sostenible.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">Red de apoyo comunitario</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-asram" />
                  <span className="text-sm font-medium">Para participantes de programas ASRAM</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Beneficios principales</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Bonificaciones de hasta el 50% directamente en factura</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Servicios de jardinería, limpieza, portería y más</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Optimización de consumo eléctrico</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Actividades infantiles educativas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Compromiso con el entorno y la sostenibilidad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Requisito importante</h3>
              <p className="text-amber-700">
                Estas ayudas están exclusivamente dirigidas a comunidades de propietarios y particulares 
                que sean participantes activos de alguno de nuestros programas (Recogida de Aceite, 
                Alianza Verde, ASRAM Kids, etc.). Si aún no participas, 
                <a href="/contacto" className="underline font-medium ml-1">contacta con nosotros</a> 
                para inscribirte primero.
              </p>
            </div>
          </div>
        </div>

        {/* Convocatorias Abiertas */}
        {convocatoriasAbiertas.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Convocatorias Abiertas</h2>
              <Badge className="bg-green-500 text-white">Solicitar ahora</Badge>
            </div>
            
            <div className="grid gap-6">
              {convocatoriasAbiertas.map((conv) => (
                <Card key={conv.id} className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-white overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className={`p-6 flex items-center justify-center ${categoriaColores[conv.categoria]} lg:w-48`}>
                      <div className="text-center">
                        {categoriaIconos[conv.categoria]}
                        <p className="mt-2 font-semibold capitalize">{conv.categoria}</p>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <Badge className={estadoBadge[conv.estado].color + " mb-2"}>
                            {estadoBadge[conv.estado].icon}
                            <span className="ml-1">{estadoBadge[conv.estado].label}</span>
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900">{conv.nombre}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-asram">Hasta {conv.bonificacion_maxima}%</div>
                          <div className="text-sm text-gray-500">de bonificación</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{conv.descripcion}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Requisitos
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {conv.requisitos?.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-asram flex-shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Documentación necesaria
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {conv.documentos_requeridos?.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-asram flex-shrink-0 mt-0.5" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Plazo: {formatDate(conv.fecha_inicio)} - {formatDate(conv.fecha_fin)}</span>
                          </div>
                        </div>
                        <Button 
                          size="lg" 
                          className="bg-asram hover:bg-asram-600"
                          onClick={() => openSolicitudDialog(conv)}
                        >
                          Solicitar ayuda
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Próximas Convocatorias */}
        {convocatoriasProximas.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Próximas Convocatorias</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {convocatoriasProximas.map((conv) => (
                <Card key={conv.id} className="border border-gray-200 overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                  <CardHeader className={`${categoriaColores[conv.categoria]} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {categoriaIconos[conv.categoria]}
                        <div>
                          <Badge className={estadoBadge[conv.estado].color + " mb-1"}>
                            {estadoBadge[conv.estado].icon}
                            <span className="ml-1">{estadoBadge[conv.estado].label}</span>
                          </Badge>
                          <CardTitle className="text-lg">{conv.nombre}</CardTitle>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">Hasta {conv.bonificacion_maxima}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 text-sm mb-4">{conv.descripcion}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Apertura prevista: {formatDate(conv.fecha_inicio)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <Button variant="outline" disabled className="w-full">
                      Próximamente disponible
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Cómo solicitar */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Cómo solicitar una ayuda?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 bg-white">
              <div className="w-12 h-12 bg-asram-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-asram">1</span>
              </div>
              <h3 className="font-semibold mb-2">Verifica tu participación</h3>
              <p className="text-sm text-gray-600">Asegúrate de ser participante activo de algún programa ASRAM</p>
            </Card>
            <Card className="text-center p-6 bg-white">
              <div className="w-12 h-12 bg-asram-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-asram">2</span>
              </div>
              <h3 className="font-semibold mb-2">Elige la convocatoria</h3>
              <p className="text-sm text-gray-600">Selecciona la ayuda que mejor se adapte a las necesidades de tu comunidad</p>
            </Card>
            <Card className="text-center p-6 bg-white">
              <div className="w-12 h-12 bg-asram-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-asram">3</span>
              </div>
              <h3 className="font-semibold mb-2">Completa el formulario</h3>
              <p className="text-sm text-gray-600">Rellena todos los datos de tu comunidad y adjunta la documentación</p>
            </Card>
            <Card className="text-center p-6 bg-white">
              <div className="w-12 h-12 bg-asram-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-asram">4</span>
              </div>
              <h3 className="font-semibold mb-2">Recibe tu bonificación</h3>
              <p className="text-sm text-gray-600">Una vez aprobada, recibirás el descuento directamente en tu factura</p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-asram rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Tienes dudas sobre las convocatorias?</h2>
          <p className="text-asram-100 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está disponible para ayudarte con cualquier consulta sobre el proceso 
            de solicitud, requisitos o documentación necesaria.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-asram hover:bg-gray-100"
            onClick={() => window.location.href = '/contacto'}
          >
            Contactar con ASRAM
          </Button>
        </div>
      </div>

      {/* Dialog de Solicitud */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Solicitud de Ayuda</DialogTitle>
            <DialogDescription>
              {selectedConvocatoria?.nombre}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Datos de la Comunidad */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Datos de la Comunidad</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_comunidad">Nombre de la Comunidad *</Label>
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
                  <Label htmlFor="cif">CIF de la Comunidad *</Label>
                  <Input 
                    id="cif"
                    name="cif"
                    value={formData.cif}
                    onChange={handleInputChange}
                    placeholder="H12345678"
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
                  <Label htmlFor="codigo_postal">Código Postal *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="numero_viviendas">Número de Viviendas</Label>
                <Input 
                  id="numero_viviendas"
                  name="numero_viviendas"
                  type="number"
                  value={formData.numero_viviendas}
                  onChange={handleInputChange}
                  placeholder="Ej: 50"
                />
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Datos de Contacto</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nombre_contacto">Nombre de la persona de contacto *</Label>
                <Input 
                  id="nombre_contacto"
                  name="nombre_contacto"
                  value={formData.nombre_contacto}
                  onChange={handleInputChange}
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>
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
              </div>
            </div>

            {/* Participación en Programas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Participación en Programas ASRAM</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="participa_programa"
                  checked={formData.participa_programa}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="participa_programa">
                  Confirmo que la comunidad participa activamente en un programa ASRAM
                </Label>
              </div>

              {formData.participa_programa && (
                <div className="space-y-2">
                  <Label htmlFor="programa_participacion">¿En qué programa participa?</Label>
                  <Select 
                    value={formData.programa_participacion} 
                    onValueChange={(value) => handleSelectChange('programa_participacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un programa" />
                    </SelectTrigger>
                    <SelectContent>
                      {programasASRAM.map((programa) => (
                        <SelectItem key={programa} value={programa}>
                          {programa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones adicionales</Label>
              <Textarea 
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Información adicional que consideres relevante..."
                rows={3}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">Documentación a presentar:</p>
              <ul className="list-disc list-inside space-y-1">
                {selectedConvocatoria?.documentos_requeridos?.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs">
                * Una vez enviada la solicitud, nos pondremos en contacto contigo para solicitar 
                la documentación necesaria.
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-asram hover:bg-asram-600"
                disabled={submitting || !formData.participa_programa}
              >
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Convocatorias;
