import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, FileText, ArrowRight, ThumbsUp, Droplet, CheckCircle, Search, Send, Loader2, Home, Building, Users, Recycle, Truck, Clock, Shield, Leaf, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const inscripcionSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().max(20).optional(),
  organizacion: z.string().trim().min(1, "El nombre de la comunidad/entidad es obligatorio").max(200),
  tipoSolicitante: z.string().min(1, "Selecciona el tipo de solicitante"),
  direccion: z.string().trim().min(1, "La dirección es obligatoria").max(500),
  numeroViviendas: z.string().optional(),
  mensaje: z.string().trim().max(1000).optional(),
});

const PuntosVerdes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    organizacion: "",
    tipoSolicitante: "",
    direccion: "",
    numeroViviendas: "",
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
          programa: 'puntos-verdes',
          ...formData
        }
      });

      if (error) throw error;

      toast.success("¡Solicitud enviada! Te contactaremos en 48 horas.");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        organizacion: "",
        tipoSolicitante: "",
        direccion: "",
        numeroViviendas: "",
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

  const districtCalendar = [
    { distrito: "Centro", semana1: "Lunes", semana2: "-", semana3: "Lunes", semana4: "-" },
    { distrito: "Chamberí", semana1: "Martes", semana2: "-", semana3: "Martes", semana4: "-" },
    { distrito: "Salamanca", semana1: "Miércoles", semana2: "-", semana3: "Miércoles", semana4: "-" },
    { distrito: "Retiro", semana1: "Jueves", semana2: "-", semana3: "Jueves", semana4: "-" },
    { distrito: "Chamartín", semana1: "Viernes", semana2: "-", semana3: "Viernes", semana4: "-" },
    { distrito: "Tetuán", semana1: "-", semana2: "Lunes", semana3: "-", semana4: "Lunes" },
    { distrito: "Moncloa", semana1: "-", semana2: "Martes", semana3: "-", semana4: "Martes" },
    { distrito: "Fuencarral", semana1: "-", semana2: "Miércoles", semana3: "-", semana4: "Miércoles" },
    { distrito: "Latina", semana1: "-", semana2: "Jueves", semana3: "-", semana4: "Jueves" },
    { distrito: "Carabanchel", semana1: "-", semana2: "Viernes", semana3: "-", semana4: "Viernes" }
  ];
  
  const filteredDistricts = districtCalendar.filter(
    district => district.distrito.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const processSteps = [
    {
      icon: MapPin,
      title: "Instalación gratuita",
      desc: "ASRAM instala contenedores especiales en tu comunidad junto con recipientes para cada hogar.",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: FileText,
      title: "Formación",
      desc: "Sesión informativa para explicar el correcto uso del sistema y resolver dudas.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Droplet,
      title: "Depósito",
      desc: "Los vecinos depositan aceite usado en botellas cerradas dentro del contenedor.",
      color: "bg-amber-100 text-amber-700"
    },
    {
      icon: Truck,
      title: "Recogida periódica",
      desc: "ASRAM vacía los contenedores según programación, sin coste alguno.",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <PageLayout 
      title="Puntos Verdes" 
      subtitle="Red de contenedores para el reciclaje de aceite usado"
    >
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-16 mb-16">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80"
            alt="Reciclaje sostenible en comunidades"
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
                  <Recycle className="w-4 h-4 mr-2" />
                  100% Gratuito
                </Badge>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Contenedores de reciclaje para tu comunidad
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/90 leading-relaxed">
                Los Puntos Verdes son contenedores gratuitos instalados en comunidades de vecinos, 
                centros escolares y entidades colaboradoras para depositar aceite de cocina usado 
                de forma segura e higiénica.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-white text-asram-800 hover:bg-white/90">
                  <Home className="w-5 h-5 mr-2" />
                  Solicitar Punto Verde
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver calendario de recogidas
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-white shadow-xl -mt-16 relative z-10 mx-4 md:mx-8 lg:mx-16 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "250+", label: "Puntos Verdes", icon: MapPin },
              { value: "180+", label: "Comunidades", icon: Home },
              { value: "45+", label: "Centros educativos", icon: Building },
              { value: "2.500L", label: "Recogidos/mes", icon: Droplet }
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
        {/* Cómo funciona */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-asram-100 text-asram-800 mb-4">El proceso</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo funcionan los Puntos Verdes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un sistema sencillo y gratuito para reciclar el aceite usado de tu comunidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                      <step.icon className="w-7 h-7" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100">{index + 1}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Beneficios */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Comunidad sostenible"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1.000L</div>
                  <div className="text-gray-600">agua protegida por litro</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-6">
            <Badge className="bg-green-100 text-green-800">Beneficios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              ¿Por qué instalar un Punto Verde?
            </h2>
            
            <div className="grid gap-4">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Home className="w-5 h-5" />
                    Para tu comunidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Solución higiénica para un residuo problemático",
                    "Prevención de atascos y problemas de fontanería",
                    "Mejora de imagen como espacio sostenible",
                    "Recogida gratuita y sin esfuerzo"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border-asram-200 bg-asram-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-asram-800">
                    <Leaf className="w-5 h-5" />
                    Para el medio ambiente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "1L de aceite contamina hasta 1.000L de agua",
                    "Reducción de huella de carbono",
                    "Conversión de residuo en biocombustible",
                    "Menor coste municipal de depuración"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-asram-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Calendario de recogidas */}
        <section className="bg-gradient-to-br from-asram-50 to-green-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Badge className="bg-asram-100 text-asram-800 mb-4">Calendario</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calendario de recogidas por distrito
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Consulta cuándo pasamos por tu zona
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar tu distrito..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-semibold">Distrito</th>
                        <th className="text-center p-4 font-semibold">Semana 1</th>
                        <th className="text-center p-4 font-semibold">Semana 2</th>
                        <th className="text-center p-4 font-semibold">Semana 3</th>
                        <th className="text-center p-4 font-semibold">Semana 4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistricts.map((district, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{district.distrito}</td>
                          <td className="p-4 text-center">
                            <Badge variant={district.semana1 !== "-" ? "default" : "secondary"}>
                              {district.semana1}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={district.semana2 !== "-" ? "default" : "secondary"}>
                              {district.semana2}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={district.semana3 !== "-" ? "default" : "secondary"}>
                              {district.semana3}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={district.semana4 !== "-" ? "default" : "secondary"}>
                              {district.semana4}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No encuentras tu distrito? <Link to="/contacto" className="text-asram underline">Contáctanos</Link> para más información
            </p>
          </div>
        </section>

        {/* Tipos de ubicaciones */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-asram-100 text-asram-800 mb-4">¿Dónde instalamos?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Puntos Verdes para todo tipo de espacios
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: "Comunidades de vecinos",
                desc: "El lugar más común. Instalamos contenedores en zonas comunes para uso de todos los residentes.",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
                stats: "180+ comunidades"
              },
              {
                icon: Building,
                title: "Centros educativos",
                desc: "Colegios, institutos y universidades como parte de nuestra Alianza Verde Escolar.",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
                stats: "45+ centros"
              },
              {
                icon: Users,
                title: "Empresas y comercios",
                desc: "Restaurantes, hoteles y empresas comprometidas con la sostenibilidad.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
                stats: "25+ empresas"
              }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-asram/10 rounded-lg">
                        <type.icon className="w-5 h-5 text-asram" />
                      </div>
                      <Badge variant="outline">{type.stats}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600">{type.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Formulario */}
        <section className="bg-gradient-to-br from-asram to-green-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">Solicita tu Punto Verde</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Instalación 100% gratuita
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Completa el formulario y nos pondremos en contacto contigo en 48 horas 
                para coordinar la instalación de tu Punto Verde.
              </p>
              
              <div className="space-y-4">
                {[
                  "Sin coste de instalación",
                  "Contenedores de alta calidad",
                  "Recipientes individuales para cada hogar",
                  "Formación incluida",
                  "Recogida periódica garantizada",
                  "Certificado de sostenibilidad"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Award className="w-12 h-12 text-yellow-300" />
                <div>
                  <div className="font-semibold">Respuesta en 48 horas</div>
                  <div className="text-sm text-white/80">Instalación en menos de 2 semanas</div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Formulario de solicitud</CardTitle>
                <CardDescription>Completa tus datos para solicitar la instalación</CardDescription>
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
                      <Label htmlFor="tipoSolicitante">Tipo de ubicación *</Label>
                      <Select 
                        value={formData.tipoSolicitante} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSolicitante: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comunidad">Comunidad de vecinos</SelectItem>
                          <SelectItem value="colegio">Centro educativo</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                          <SelectItem value="restaurante">Restaurante/Hostelería</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizacion">Nombre de la comunidad/entidad *</Label>
                    <Input
                      id="organizacion"
                      value={formData.organizacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
                      placeholder="Comunidad de Propietarios..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                        placeholder="Calle, número, código postal"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroViviendas">Nº viviendas</Label>
                      <Input
                        id="numeroViviendas"
                        type="number"
                        value={formData.numeroViviendas}
                        onChange={(e) => setFormData(prev => ({ ...prev, numeroViviendas: e.target.value }))}
                        placeholder="Ej: 24"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Comentarios adicionales</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Cualquier información adicional..."
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
                        Solicitar Punto Verde
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
            ¿Tienes dudas sobre los Puntos Verdes?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para resolver cualquier consulta
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

export default PuntosVerdes;
