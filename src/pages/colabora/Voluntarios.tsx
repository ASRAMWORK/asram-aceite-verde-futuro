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
  TreePine
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
      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-solicitud-voluntario', {
        body: formData
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      toast.success("¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.");
      
      // Reset form
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
      icon: Heart,
      title: "Impacto Real",
      description: "Tu trabajo tiene un efecto directo en el medio ambiente y la comunidad"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Conoce personas con tus mismos valores e intereses"
    },
    {
      icon: GraduationCap,
      title: "Formación",
      description: "Accede a talleres y formaciones gratuitas sobre sostenibilidad"
    },
    {
      icon: Star,
      title: "Reconocimiento",
      description: "Certificados y reconocimientos por tu labor voluntaria"
    }
  ];

  const actividades = [
    {
      icon: Recycle,
      title: "Recogida de Aceite",
      description: "Ayuda en las rutas de recogida de aceite usado en comunidades y hogares"
    },
    {
      icon: TreePine,
      title: "Educación Ambiental",
      description: "Participa en talleres y charlas en colegios y centros comunitarios"
    },
    {
      icon: HandHeart,
      title: "Eventos Solidarios",
      description: "Colabora en mercadillos, ferias y eventos de concienciación"
    },
    {
      icon: Leaf,
      title: "Puntos Verdes",
      description: "Ayuda en la gestión y mantenimiento de nuestros puntos de recogida"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-asram/10 via-background to-accent/5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A7C59' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-asram/10 text-asram px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Únete a nuestro equipo</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sé Voluntario en{" "}
              <span className="text-asram">ASRAM</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Forma parte de una comunidad comprometida con el medio ambiente. 
              Tu tiempo y dedicación pueden marcar la diferencia en Madrid.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-asram" />
                <span>+200 voluntarios activos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-asram" />
                <span>Toda la Comunidad de Madrid</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-asram" />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imagen destacada */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Voluntarios trabajando juntos"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white text-xl font-medium">
                "Juntos construimos un Madrid más sostenible"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">¿Quiénes somos?</h2>
              <p className="text-lg text-muted-foreground">
                ASRAM es la Asociación para el Reciclaje de Aceite en Madrid
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Nuestra Misión</h3>
                <p className="text-muted-foreground">
                  Trabajamos para transformar el aceite usado de cocina en biodiesel y otros productos 
                  sostenibles, evitando la contaminación del agua y contribuyendo a la economía circular.
                </p>
                <p className="text-muted-foreground">
                  Cada litro de aceite reciclado evita la contaminación de hasta 1.000 litros de agua. 
                  Con tu ayuda, multiplicamos nuestro impacto.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Nuestros Programas</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-asram mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Alianza Verde Escolar:</strong> Educación ambiental en colegios
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-asram mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Puntos Verdes:</strong> Red de contenedores de reciclaje
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-asram mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>ASRAM Rural:</strong> Reciclaje en zonas rurales
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-asram mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>ASRAM Kids:</strong> Actividades para los más pequeños
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios de ser voluntario */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Por qué ser voluntario en ASRAM?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Más que voluntariado, es una experiencia de vida que te conecta con tu comunidad y el planeta
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 bg-asram/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <beneficio.icon className="w-7 h-7 text-asram" />
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

      {/* Actividades */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿En qué puedes colaborar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hay muchas formas de aportar tu granito de arena
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {actividades.map((actividad, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-asram/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <actividad.icon className="w-6 h-6 text-asram" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{actividad.title}</CardTitle>
                    <CardDescription>{actividad.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen motivacional */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Trabajo en equipo voluntarios"
                className="w-full h-[280px] object-cover"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Voluntarios ayudando"
                className="w-full h-[280px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de inscripción */}
      <section className="py-16" id="formulario">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-asram/10 text-asram px-4 py-2 rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Inscripción abierta</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Formulario de Inscripción
              </h2>
              <p className="text-muted-foreground">
                Completa el formulario y nos pondremos en contacto contigo
              </p>
            </div>

            <Card className="shadow-lg border-t-4 border-t-asram">
              <CardHeader>
                <CardTitle>Datos del Voluntario</CardTitle>
                <CardDescription>
                  Todos los campos marcados con * son obligatorios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos personales */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground border-b pb-2">Datos Personales</h3>
                    
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
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground border-b pb-2">Dirección</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Calle, número, piso..."
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
                        />
                      </div>
                    </div>
                  </div>

                  {/* Disponibilidad */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground border-b pb-2">Disponibilidad *</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecciona cuándo podrías colaborar con nosotros
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {disponibilidadOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={formData.disponibilidad.includes(option)}
                            onCheckedChange={(checked) => 
                              handleDisponibilidadChange(option, checked as boolean)
                            }
                          />
                          <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experiencia y motivación */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground border-b pb-2">Cuéntanos más</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experiencia">Experiencia previa en voluntariado</Label>
                      <Textarea
                        id="experiencia"
                        name="experiencia"
                        value={formData.experiencia}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos si has participado en otros proyectos de voluntariado..."
                        rows={3}
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
                      />
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="aceptaTerminos"
                        checked={formData.aceptaTerminos}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, aceptaTerminos: checked as boolean }))
                        }
                      />
                      <Label htmlFor="aceptaTerminos" className="text-sm font-normal cursor-pointer">
                        Acepto la{" "}
                        <Link to="/privacidad" className="text-asram hover:underline">
                          política de privacidad
                        </Link>{" "}
                        y consiento el tratamiento de mis datos para gestionar mi solicitud de voluntariado. *
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-asram hover:bg-asram/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud de Voluntariado"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-asram text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes dudas?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos y te resolveremos cualquier pregunta sobre el voluntariado
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-asram"
          >
            <Link to="/contacto">
              Contactar
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Voluntarios;
