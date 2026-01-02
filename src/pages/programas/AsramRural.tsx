import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Truck, Users, Building, ChevronRight, Mountain, Map, Home, Send, Loader2, TreeDeciduous, Tractor, Calendar, CheckCircle, Award, Leaf, Sun, Heart } from "lucide-react";
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

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const localities = [
    { name: "La Hiruela", region: "Sierra Norte", households: 85, status: "activo" },
    { name: "Puebla de la Sierra", region: "Sierra Norte", households: 110, status: "activo" },
    { name: "Buitrago del Lozoya", region: "Sierra Norte", households: 350, status: "activo" },
    { name: "Montejo de la Sierra", region: "Sierra Norte", households: 180, status: "próximo" },
    { name: "Patones", region: "Sierra Norte", households: 210, status: "próximo" },
    { name: "Torrelaguna", region: "Sierra Norte", households: 420, status: "próximo" }
  ];

  const programFeatures = [
    {
      icon: MapPin,
      title: "Puntos de recolección local",
      desc: "Instalamos puntos de recogida adaptados a las necesidades específicas de cada población.",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Users,
      title: "Talleres comunitarios",
      desc: "Sesiones formativas en escuelas rurales y asociaciones locales sobre reciclaje.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Truck,
      title: "Rutas optimizadas",
      desc: "Circuitos eficientes para minimizar la huella de carbono en el transporte.",
      color: "bg-amber-100 text-amber-700"
    },
    {
      icon: Building,
      title: "Alianzas locales",
      desc: "Colaboramos con cooperativas y entidades del territorio para fortalecer el tejido social.",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <PageLayout 
      title="ASRAM Rural" 
      subtitle="Llevamos el reciclaje sostenible a zonas rurales"
    >
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-16 mb-16">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Paisaje rural de la Sierra de Madrid"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-amber-800/60 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-white space-y-6"
            >
              <motion.div variants={fadeIn}>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  <Mountain className="w-4 h-4 mr-2" />
                  Programa de Extensión Rural
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Sostenibilidad sin fronteras geográficas
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/90 leading-relaxed">
                ASRAM Rural adapta nuestro modelo urbano a las particularidades de las zonas rurales, 
                garantizando que todas las comunidades, independientemente de su tamaño o ubicación, 
                contribuyan a la economía circular.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-white text-green-800 hover:bg-white/90">
                  <TreeDeciduous className="w-5 h-5 mr-2" />
                  Solicitar información
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver municipios participantes
                </Button>
              </motion.div>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium">12 municipios participantes</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-medium">Rutas ecológicas</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-white shadow-xl -mt-16 relative z-10 mx-4 md:mx-8 lg:mx-16 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "12", label: "Municipios", icon: MapPin },
              { value: "985", label: "Hogares servidos", icon: Home },
              { value: "1.250L", label: "Aceite reciclado", icon: Leaf },
              { value: "4", label: "Cooperativas aliadas", icon: Users }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 md:p-8 text-center"
              >
                <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Sobre ASRAM Rural */}
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
              El reciclaje llega al mundo rural
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Las zonas rurales enfrentan desafíos únicos en la gestión de residuos: 
              distancias mayores, menor densidad de población y acceso limitado a servicios. 
              ASRAM Rural nació para superar estas barreras y garantizar que ninguna 
              comunidad quede fuera de la economía circular.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Adaptamos nuestras rutas, calendarios y métodos de recogida a las 
              particularidades de cada municipio, trabajando siempre en colaboración 
              con ayuntamientos, cooperativas y asociaciones locales.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Mountain, title: "Sierra Norte", desc: "Nuestra zona principal" },
                { icon: Tractor, title: "Cooperativas", desc: "Alianzas productivas" },
                { icon: Calendar, title: "Flexibilidad", desc: "Adaptamos calendarios" },
                { icon: Heart, title: "Comunidad", desc: "Desarrollo local" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-green-600" />
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
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80"
              alt="Pueblo de la Sierra de Madrid"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Sun className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Sierra Norte</div>
                  <div className="text-gray-600">de Madrid</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Componentes del programa */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Componentes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un programa adaptado al entorno rural
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada elemento del programa está diseñado considerando las características 
              únicas de las comunidades rurales
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Adaptaciones especiales */}
        <section className="bg-gradient-to-br from-green-50 via-amber-50 to-green-50 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-amber-100 text-amber-800">Adaptaciones</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Entendemos el mundo rural
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                El programa ASRAM Rural reconoce las características únicas de las 
                comunidades rurales y adapta sus servicios para maximizar su impacto.
              </p>
              
              <div className="space-y-4">
                {[
                  { 
                    title: "Distancias y accesibilidad", 
                    desc: "Planificación de rutas que consideren la dispersión geográfica y el estado de los accesos." 
                  },
                  { 
                    title: "Estacionalidad", 
                    desc: "Ajuste de frecuencias de recogida según variaciones poblacionales durante temporadas turísticas." 
                  },
                  { 
                    title: "Coordinación con agendas locales", 
                    desc: "Sincronización con ferias, mercados y eventos locales para maximizar la participación." 
                  },
                  { 
                    title: "Vinculación con identidad local", 
                    desc: "Integración del programa con valores culturales y tradiciones de cada comunidad." 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80"
                alt="Paisaje rural"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1516253593875-bd7ba052f2b5?w=400&q=80"
                alt="Pueblo tradicional"
                className="w-full h-48 object-cover rounded-xl shadow-lg mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&q=80"
                alt="Campo de cultivo"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1559070169-a3077159ee16?w=400&q=80"
                alt="Montañas"
                className="w-full h-48 object-cover rounded-xl shadow-lg mt-8"
              />
            </div>
          </div>
        </section>

        {/* Municipios participantes */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Red de municipios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Municipios participantes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestra red crece cada día. Conoce los municipios que ya forman parte del programa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localities.map((locality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${locality.status === 'activo' ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{locality.name}</h3>
                        <p className="text-sm text-gray-600">{locality.region}</p>
                      </div>
                      <Badge className={locality.status === 'activo' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}>
                        {locality.status === 'activo' ? 'Activo' : 'Próximamente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{locality.households} hogares</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">¿Tu municipio no está en la lista?</p>
            <Button variant="outline" asChild>
              <Link to="/contacto">
                Solicita que lleguemos a tu zona
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Formulario */}
        <section className="bg-gradient-to-br from-green-700 to-amber-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">Únete al programa</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Lleva ASRAM Rural a tu municipio
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Si eres parte de un ayuntamiento, cooperativa o asociación local y 
                quieres que el reciclaje de aceite llegue a tu territorio, contáctanos.
              </p>
              
              <div className="space-y-4">
                {[
                  "Instalación adaptada a las características locales",
                  "Formación para la comunidad",
                  "Rutas de recogida optimizadas",
                  "Colaboración con entidades locales",
                  "Impacto medioambiental medible",
                  "Sin coste para el municipio"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Award className="w-12 h-12 text-amber-300" />
                <div>
                  <div className="font-semibold">Programa certificado</div>
                  <div className="text-sm text-white/80">Reconocido por su impacto social y ambiental</div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Formulario de contacto</CardTitle>
                <CardDescription>Cuéntanos sobre tu municipio</CardDescription>
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
                      <Label htmlFor="tipoSolicitante">Tipo de entidad *</Label>
                      <Select 
                        value={formData.tipoSolicitante} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSolicitante: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ayuntamiento">Ayuntamiento</SelectItem>
                          <SelectItem value="cooperativa">Cooperativa</SelectItem>
                          <SelectItem value="asociacion">Asociación local</SelectItem>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizacion">Municipio/Organización *</Label>
                    <Input
                      id="organizacion"
                      value={formData.organizacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                      placeholder="Nombre del municipio u organización"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Ubicación/Comarca</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Ej: Sierra Norte de Madrid"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Cuéntanos más</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Número de habitantes, situación actual de reciclaje, necesidades específicas..."
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar solicitud
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
            El reciclaje no conoce fronteras
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Trabajamos para que todas las comunidades, urbanas y rurales, 
            contribuyan a un futuro más sostenible
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/contacto">Contáctanos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/puntos-verdes">
                Ver Puntos Verdes urbanos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AsramRural;
