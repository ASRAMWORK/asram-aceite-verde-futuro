import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { 
  Heart, 
  Users, 
  Leaf, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  Star,
  Recycle,
  HandHeart,
  GraduationCap,
  TreePine,
  Droplets,
  Globe
} from "lucide-react";

const Voluntarios = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
    disponibilidad: [] as string[],
    experiencia: "",
    motivacion: "",
    aceptaTerminos: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disponibilidadOptions = [
    "Mañanas entre semana",
    "Tardes entre semana",
    "Fines de semana",
    "Eventos puntuales",
    "Horario flexible"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDisponibilidadChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      disponibilidad: checked 
        ? [...prev.disponibilidad, option]
        : prev.disponibilidad.filter(d => d !== option)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aceptaTerminos) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    if (formData.disponibilidad.length === 0) {
      toast.error("Selecciona al menos una opción de disponibilidad");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: emailError } = await supabase.functions.invoke('send-solicitud-voluntario', {
        body: formData
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      toast.success("¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.");
      
      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        provincia: "",
        disponibilidad: [],
        experiencia: "",
        motivacion: "",
        aceptaTerminos: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const beneficios = [
    {
      icon: Leaf,
      title: "Impacto Ambiental",
      description: "Contribuye directamente a la protección del medio ambiente"
    },
    {
      icon: Users,
      title: "Comunidad Verde",
      description: "Conecta con personas comprometidas con la sostenibilidad"
    },
    {
      icon: GraduationCap,
      title: "Formación Ecológica",
      description: "Aprende sobre reciclaje, economía circular y sostenibilidad"
    },
    {
      icon: Globe,
      title: "Cambio Global",
      description: "Sé parte del movimiento por un planeta más limpio"
    }
  ];

  const actividades = [
    {
      icon: Droplets,
      title: "Recogida de Aceite",
      description: "Ayuda en las rutas de recogida de aceite usado, evitando la contaminación de miles de litros de agua"
    },
    {
      icon: TreePine,
      title: "Educación Ambiental",
      description: "Enseña a niños y adultos la importancia del reciclaje y el cuidado del medio ambiente"
    },
    {
      icon: Recycle,
      title: "Puntos Verdes",
      description: "Gestiona y mantiene nuestra red de puntos de recogida sostenibles"
    },
    {
      icon: HandHeart,
      title: "Eventos Ecológicos",
      description: "Participa en jornadas de limpieza, plantación de árboles y ferias verdes"
    }
  ];

  const impactoStats = [
    { value: "+50.000L", label: "Aceite reciclado" },
    { value: "+200", label: "Voluntarios activos" },
    { value: "21", label: "Distritos de Madrid" },
    { value: "-150T", label: "CO₂ evitado" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section con imagen medioambiental */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Manos sosteniendo una planta"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-asram/90 text-white px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Únete al cambio</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sé Voluntario en{" "}
              <span className="text-asram-light">ASRAM</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Tu compromiso con el medio ambiente puede cambiar el mundo. 
              Cada litro de aceite que reciclamos juntos protege 1.000 litros de agua.
            </p>

            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-asram-light" />
                <span>+200 voluntarios</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-asram-light" />
                <span>Comunidad de Madrid</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-asram-light" />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats de impacto */}
      <section className="py-8 bg-asram">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactoStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué ser voluntario */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Únete a nuestra misión</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              ¿Por qué ser voluntario?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ser voluntario en ASRAM es más que reciclar: es formar parte de un movimiento 
              que transforma Madrid en una ciudad más sostenible
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-asram to-asram-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <beneficio.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{beneficio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{beneficio.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen de naturaleza */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Bosque verde y sostenible"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <blockquote className="text-white text-2xl md:text-3xl font-light italic max-w-3xl">
              "La Tierra no es una herencia de nuestros padres, sino un préstamo de nuestros hijos"
            </blockquote>
            <p className="text-white/70 mt-4">— Proverbio indígena</p>
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Reciclaje y sostenibilidad"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-asram text-white p-6 rounded-xl shadow-xl">
                <Recycle className="w-10 h-10 mb-2" />
                <div className="text-2xl font-bold">+10K</div>
                <div className="text-sm text-white/80">Litros reciclados</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <span className="text-asram font-medium text-sm uppercase tracking-wider">Nuestra misión</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Transformamos aceite usado en un futuro sostenible
              </h2>
              <p className="text-muted-foreground text-lg">
                ASRAM es la Asociación para el Reciclaje de Aceite en Madrid. Trabajamos para 
                convertir el aceite usado de cocina en biodiesel y productos sostenibles, 
                protegiendo nuestros ríos y acuíferos.
              </p>
              <ul className="space-y-4">
                {[
                  "1 litro de aceite contamina 1.000 litros de agua",
                  "Transformamos residuos en recursos renovables",
                  "Fomentamos la economía circular en Madrid",
                  "Educamos a nuevas generaciones en sostenibilidad"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-asram mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Áreas de voluntariado</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              ¿En qué puedes colaborar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hay muchas formas de aportar tu granito de arena al medio ambiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {actividades.map((actividad, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardHeader className="flex flex-row items-start gap-5 pb-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-asram/20 to-asram/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-asram group-hover:to-asram-dark transition-all duration-300">
                    <actividad.icon className="w-7 h-7 text-asram group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{actividad.title}</CardTitle>
                    <CardDescription className="text-base">{actividad.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de imágenes medioambientales */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Paisaje montañoso verde"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1518173946687-a4c036bc3e96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Gotas de agua en hoja"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Campo de flores silvestres"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de inscripción */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background" id="formulario">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-asram/10 text-asram px-4 py-2 rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Inscripción abierta</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Únete a nuestro equipo
              </h2>
              <p className="text-muted-foreground text-lg">
                Completa el formulario y forma parte del cambio
              </p>
            </div>

            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-asram via-asram-light to-asram" />
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-asram" />
                  Datos del Voluntario
                </CardTitle>
                <CardDescription>
                  Los campos marcados con * son obligatorios
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Datos personales */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5 text-asram" />
                      Datos Personales
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          placeholder="Tu nombre"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input
                          id="apellidos"
                          name="apellidos"
                          value={formData.apellidos}
                          onChange={handleInputChange}
                          required
                          placeholder="Tus apellidos"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="tu@email.com"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                          placeholder="600 000 000"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                      <Input
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-asram" />
                      Dirección
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Calle, número, piso..."
                        className="h-11"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="codigoPostal">Código Postal</Label>
                        <Input
                          id="codigoPostal"
                          name="codigoPostal"
                          value={formData.codigoPostal}
                          onChange={handleInputChange}
                          placeholder="28000"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ciudad">Ciudad</Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          placeholder="Madrid"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Provincia</Label>
                        <Input
                          id="provincia"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleInputChange}
                          placeholder="Madrid"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Disponibilidad */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-asram" />
                      Disponibilidad *
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Selecciona cuándo podrías colaborar con nosotros
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {disponibilidadOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <Checkbox
                            id={option}
                            checked={formData.disponibilidad.includes(option)}
                            onCheckedChange={(checked) => 
                              handleDisponibilidadChange(option, checked as boolean)
                            }
                          />
                          <Label htmlFor={option} className="text-sm font-normal cursor-pointer flex-1">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experiencia y motivación */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Star className="w-5 h-5 text-asram" />
                      Cuéntanos más
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experiencia">Experiencia previa en voluntariado</Label>
                      <Textarea
                        id="experiencia"
                        name="experiencia"
                        value={formData.experiencia}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos si has participado en otros proyectos de voluntariado..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivacion">¿Por qué quieres ser voluntario en ASRAM? *</Label>
                      <Textarea
                        id="motivacion"
                        name="motivacion"
                        value={formData.motivacion}
                        onChange={handleInputChange}
                        required
                        placeholder="Cuéntanos qué te motiva a colaborar con nosotros..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                      <Checkbox
                        id="aceptaTerminos"
                        checked={formData.aceptaTerminos}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, aceptaTerminos: checked as boolean }))
                        }
                      />
                      <Label htmlFor="aceptaTerminos" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Acepto la{" "}
                        <Link to="/privacidad" className="text-asram hover:underline font-medium">
                          política de privacidad
                        </Link>{" "}
                        y consiento el tratamiento de mis datos para gestionar mi solicitud de voluntariado. *
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-asram hover:bg-asram/90 shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando solicitud..."
                    ) : (
                      <>
                        <Leaf className="w-5 h-5 mr-2" />
                        Enviar Solicitud de Voluntariado
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Paisaje natural al atardecer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-asram/85" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Leaf className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Tienes dudas?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos y te resolveremos cualquier pregunta sobre el voluntariado
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-asram hover:bg-white/90 shadow-xl"
          >
            <Link to="/contacto">
              Contactar con nosotros
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Voluntarios;
