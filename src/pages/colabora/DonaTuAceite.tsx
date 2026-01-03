import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { 
  FileCheck, 
  Leaf, 
  TrendingUp, 
  Award, 
  Building2, 
  Utensils, 
  Hotel, 
  Factory,
  CheckCircle,
  FileText,
  BarChart3,
  Heart,
  Recycle,
  Handshake,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Shield,
  Target,
  Users,
  Gift
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DonaTuAceite = () => {
  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    tipoNegocio: "",
    nombreContacto: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    litrosMensuales: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.");
    setFormData({
      nombreEmpresa: "",
      tipoNegocio: "",
      nombreContacto: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      litrosMensuales: "",
      mensaje: ""
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const beneficios = [
    {
      icon: Gift,
      title: "Servicio Gratuito",
      description: "La recogida de aceite usado es completamente gratuita. Te facilitamos los bidones necesarios y el documento de identificación de residuos (DI)."
    },
    {
      icon: Heart,
      title: "Doble Impacto Positivo",
      description: "Tu donación contribuye a cuidar el medio ambiente y financia la recogida gratuita de aceite en hogares y comunidades de vecinos de Madrid."
    },
    {
      icon: Recycle,
      title: "Sostenibilidad con Propósito",
      description: "El rendimiento económico obtenido se invierte íntegramente en la recogida doméstica y proyectos de alto impacto social y medioambiental."
    },
    {
      icon: FileCheck,
      title: "Certificado de Donación",
      description: "Como donante, obtendrás un certificado anual de donación con valor fiscal, desgravable hasta un 50% en el Impuesto de Sociedades."
    },
    {
      icon: BarChart3,
      title: "Informe de Impacto Anual",
      description: "Recibirás un informe detallado de tu impacto medioambiental y social, ideal para comunicar tus acciones RSC a clientes y stakeholders."
    },
    {
      icon: Award,
      title: "Certificaciones de Sostenibilidad",
      description: "Te ayudamos a cumplir con indicadores de sostenibilidad y normativas europeas CSRD adaptadas a PYMES."
    }
  ];

  const tiposNegocio = [
    {
      icon: Utensils,
      title: "Bares y Restaurantes",
      description: "Gestión eficiente del aceite de fritura con recogidas programadas según tu volumen"
    },
    {
      icon: Hotel,
      title: "Hoteles y Hostales",
      description: "Solución integral para cocinas de alto volumen con certificaciones de sostenibilidad"
    },
    {
      icon: Building2,
      title: "Comedores Colectivos",
      description: "Colegios, hospitales y empresas con servicio de catering y comedores"
    },
    {
      icon: Factory,
      title: "Industria Alimentaria",
      description: "Grandes productores de aceite usado con necesidades de gestión especializada"
    }
  ];

  const estadisticas = [
    { value: "+150", label: "Empresas Colaboradoras", icon: Building2 },
    { value: "45.000L", label: "Aceite Recogido/Año", icon: Recycle },
    { value: "100%", label: "Gratuito", icon: Gift },
    { value: "+35.000", label: "Hogares Beneficiados", icon: Users }
  ];

  const ods = [
    { numero: 11, titulo: "Ciudades Sostenibles", color: "bg-amber-500" },
    { numero: 12, titulo: "Consumo Responsable", color: "bg-yellow-600" },
    { numero: 13, titulo: "Acción Climática", color: "bg-green-600" },
    { numero: 17, titulo: "Alianzas", color: "bg-blue-800" }
  ];

  const procesoSimple = [
    {
      paso: "1",
      titulo: "Contacta con Nosotros",
      descripcion: "Completa el formulario o llámanos. Te facilitaremos toda la información y el acuerdo de aceptación de residuos."
    },
    {
      paso: "2",
      titulo: "Recibe los Bidones",
      descripcion: "Te proporcionamos los bidones homologados necesarios para almacenar tu aceite usado de forma segura."
    },
    {
      paso: "3",
      titulo: "Recogida Programada",
      descripcion: "Establecemos una frecuencia de recogida adaptada a tu volumen. Cada retirada incluye albarán firmado."
    },
    {
      paso: "4",
      titulo: "Certificado Anual",
      descripcion: "Recibes tu certificado de donación e informe de impacto para tu memoria de sostenibilidad."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-asram/95 via-asram/80 to-asram/60" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Handshake className="h-5 w-5" />
              <span className="text-sm font-medium">Únete a nuestra red de colaboradores</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Dona tu Aceite Usado
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-4 text-white/90"
            >
              Tu aceite residual financia la recogida gratuita en hogares madrileños
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg mb-8 text-white/80 max-w-3xl mx-auto"
            >
              Bares, restaurantes, hoteles y grandes productores: vuestro aceite usado es un recurso valioso 
              que nos permite llevar el servicio de recogida gratuito a miles de familias y comunidades de vecinos.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="bg-white text-asram hover:bg-gray-100 gap-2"
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Hazte Donante
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 gap-2"
                onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Beneficios
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-t-2xl shadow-2xl p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {estadisticas.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-asram/10 text-asram mb-2">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-asram">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Por qué necesitamos tu aceite */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-asram/10 text-asram rounded-full text-sm font-medium mb-4">
                Nuestra Misión
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Uniendo Fuerzas por un Madrid Más Sostenible
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                La recogida de aceite doméstico en hogares y comunidades de vecinos es un servicio esencial 
                que actualmente no puede financiarse por sí solo. Sin embargo, <strong>el aceite usado es un 
                residuo valorizado</strong> que puede transformarse en biocombustible.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Los grandes productores de aceite usado —bares, restaurantes, hoteles e industrias alimentarias— 
                pueden ayudarnos a hacer viable esta actividad. <strong>Tu donación de aceite financia directamente 
                la recogida gratuita para miles de familias madrileñas.</strong>
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                {ods.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`${item.color} text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold`}>
                      ODS {item.numero}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.titulo}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Cocina profesional"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1 litro</div>
                    <div className="text-sm text-gray-500">contamina 1.000L de agua</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* A quién va dirigido */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 bg-asram/10 text-asram rounded-full text-sm font-medium mb-4">
              Colaboradores
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿A Quién Va Dirigido?
            </h2>
            <p className="text-lg text-gray-600">
              Cualquier negocio que genere aceite usado de cocina puede sumarse a nuestra red de donantes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiposNegocio.map((tipo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-asram/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-asram group-hover:text-white transition-all duration-300">
                      <tipo.icon className="h-8 w-8 text-asram group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tipo.title}</h3>
                    <p className="text-gray-600 text-sm">{tipo.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-asram via-asram to-green-700 text-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Ventajas para tu empresa
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beneficios de Ser Donante
            </h2>
            <p className="text-xl text-white/80">
              Obtén ventajas fiscales, certificaciones y contribuye al bienestar de tu comunidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <beneficio.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{beneficio.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{beneficio.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Destacado certificado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Certificado de Donación Fiscal</h3>
                <p className="text-white/80 mb-4">
                  Recibirás un certificado anual de donaciones valorado en <strong>250€ por tonelada de aceite retirado</strong>, 
                  desgravable hasta el <strong>50% en el Impuesto de Sociedades</strong>.
                </p>
                <ul className="space-y-2">
                  {[
                    "Documento oficial válido para Hacienda",
                    "Desgravación fiscal automática",
                    "Válido para memorias de RSC"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-white/80" />
                <div className="text-4xl font-bold mb-2">Hasta 50%</div>
                <div className="text-white/80">Desgravación en Impuesto de Sociedades</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 bg-asram/10 text-asram rounded-full text-sm font-medium mb-4">
              Proceso Simple
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg text-gray-600">
              Hacerse donante es muy sencillo. En solo 4 pasos estarás contribuyendo a un Madrid más sostenible
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {procesoSimple.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-asram/20" />
                )}
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="w-12 h-12 rounded-full bg-asram text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                    {item.paso}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm">{item.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="formulario" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-asram/10 text-asram rounded-full text-sm font-medium mb-4">
                Únete a Nosotros
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hazte Donante de Aceite
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Completa el formulario y nos pondremos en contacto contigo para iniciar 
                la colaboración. El servicio es completamente gratuito.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-asram/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-asram" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Teléfono</h4>
                    <p className="text-gray-600">+34 910 123 456</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-asram/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-asram" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <p className="text-gray-600">donantes@asram.org</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-asram/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-asram" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Zona de Servicio</h4>
                    <p className="text-gray-600">Comunidad de Madrid</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Gestión Legal Garantizada</h4>
                    <p className="text-sm text-gray-600">
                      Cumplimos con toda la normativa de gestión de residuos. 
                      Cada recogida incluye albarán firmado y documentación legal completa.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
                        <Input 
                          id="nombreEmpresa"
                          name="nombreEmpresa"
                          value={formData.nombreEmpresa}
                          onChange={handleChange}
                          required 
                          placeholder="Tu empresa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipoNegocio">Tipo de Negocio *</Label>
                        <Select 
                          value={formData.tipoNegocio} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, tipoNegocio: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="restaurante">Restaurante</SelectItem>
                            <SelectItem value="bar">Bar / Cafetería</SelectItem>
                            <SelectItem value="hotel">Hotel / Hostal</SelectItem>
                            <SelectItem value="comedor">Comedor Colectivo</SelectItem>
                            <SelectItem value="catering">Catering</SelectItem>
                            <SelectItem value="industria">Industria Alimentaria</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombreContacto">Persona de Contacto *</Label>
                        <Input 
                          id="nombreContacto"
                          name="nombreContacto"
                          value={formData.nombreContacto}
                          onChange={handleChange}
                          required 
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          placeholder="email@empresa.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input 
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          required 
                          placeholder="+34 600 000 000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="litrosMensuales">Litros Mensuales (aprox.)</Label>
                        <Select 
                          value={formData.litrosMensuales} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, litrosMensuales: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menos-50">Menos de 50L</SelectItem>
                            <SelectItem value="50-100">50 - 100L</SelectItem>
                            <SelectItem value="100-200">100 - 200L</SelectItem>
                            <SelectItem value="200-500">200 - 500L</SelectItem>
                            <SelectItem value="mas-500">Más de 500L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input 
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required 
                        placeholder="Calle, número..."
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input 
                          id="ciudad"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          required 
                          placeholder="Madrid"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="codigoPostal">Código Postal *</Label>
                        <Input 
                          id="codigoPostal"
                          name="codigoPostal"
                          value={formData.codigoPostal}
                          onChange={handleChange}
                          required 
                          placeholder="28001"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje (opcional)</Label>
                      <Textarea 
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Cuéntanos más sobre tu negocio o cualquier necesidad especial..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-asram hover:bg-asram-700 text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Solicitar Alta como Donante"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Al enviar este formulario aceptas nuestra política de privacidad. 
                      Nos pondremos en contacto contigo en un plazo máximo de 48 horas.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-asram text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Juntos hacemos posible la recogida gratuita en hogares
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Cada litro de aceite que donas financia directamente el servicio de recogida 
              para familias y comunidades de vecinos en Madrid.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-asram hover:bg-gray-100"
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Hazte Donante Ahora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
                asChild
              >
                <Link to="/contacto">Más Información</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonaTuAceite;
