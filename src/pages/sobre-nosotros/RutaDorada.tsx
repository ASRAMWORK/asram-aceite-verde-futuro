import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { 
  Store, 
  Users, 
  Calendar, 
  MapPin, 
  Star,
  Utensils,
  Heart,
  Trophy,
  Megaphone,
  PartyPopper,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

const RutaDorada = () => {
  const [barFormData, setBarFormData] = useState({
    nombreEstablecimiento: "",
    tipoNegocio: "",
    nombreContacto: "",
    email: "",
    telefono: "",
    direccion: "",
    codigoPostal: "",
    barrio: "",
    descripcion: "",
    colaboraASRAM: false,
    aceptaTerminos: false
  });

  const [personaFormData, setPersonaFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    codigoPostal: "",
    comoConociste: "",
    aceptaTerminos: false
  });

  const [isSubmittingBar, setIsSubmittingBar] = useState(false);
  const [isSubmittingPersona, setIsSubmittingPersona] = useState(false);

  const handleBarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBarFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonaFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barFormData.aceptaTerminos) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    setIsSubmittingBar(true);

    try {
      const { error: emailError } = await supabase.functions.invoke('send-inscripcion-ruta-dorada', {
        body: { tipo: 'establecimiento', ...barFormData }
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      toast.success("¡Inscripción enviada! Nos pondremos en contacto contigo pronto.");
      
      setBarFormData({
        nombreEstablecimiento: "",
        tipoNegocio: "",
        nombreContacto: "",
        email: "",
        telefono: "",
        direccion: "",
        codigoPostal: "",
        barrio: "",
        descripcion: "",
        colaboraASRAM: false,
        aceptaTerminos: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar la inscripción. Inténtalo de nuevo.");
    } finally {
      setIsSubmittingBar(false);
    }
  };

  const handlePersonaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personaFormData.aceptaTerminos) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    setIsSubmittingPersona(true);

    try {
      const { error: emailError } = await supabase.functions.invoke('send-inscripcion-ruta-dorada', {
        body: { tipo: 'persona', ...personaFormData }
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      toast.success("¡Te has inscrito correctamente! Te mantendremos informado.");
      
      setPersonaFormData({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        codigoPostal: "",
        comoConociste: "",
        aceptaTerminos: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar la inscripción. Inténtalo de nuevo.");
    } finally {
      setIsSubmittingPersona(false);
    }
  };

  const beneficiosEstablecimientos = [
    {
      icon: Megaphone,
      title: "Visibilidad",
      description: "Llega a cientos de nuevos clientes potenciales"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Forma parte de una red de comercios sostenibles"
    },
    {
      icon: Trophy,
      title: "Reconocimiento",
      description: "Sello de establecimiento colaborador ASRAM"
    },
    {
      icon: Heart,
      title: "Impacto Social",
      description: "Contribuye al medio ambiente y la economía local"
    }
  ];

  const comoFunciona = [
    {
      step: "1",
      title: "Inscríbete",
      description: "Registra tu establecimiento en el formulario"
    },
    {
      step: "2",
      title: "Prepárate",
      description: "Te contactaremos con toda la información"
    },
    {
      step: "3",
      title: "Participa",
      description: "Abre tus puertas el día del evento"
    },
    {
      step: "4",
      title: "Conecta",
      description: "Conoce nuevos clientes y otros comercios"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Bar y restaurante acogedor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-amber-700/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/90 text-white px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Mayo 2026</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ruta{" "}
              <span className="text-amber-300">Dorada</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Una iniciativa de ASRAM para premiar y dar visibilidad a los comercios locales 
              que colaboran con nosotros reciclando su aceite usado.
            </p>

            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>Mayo 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-300" />
                <span>Madrid</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-300" />
                <span>Bares y Restaurantes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es la Ruta Dorada */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">La iniciativa</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                ¿Qué es la Ruta Dorada?
              </h2>
              <p className="text-muted-foreground text-lg">
                La Ruta Dorada es un evento anual organizado por ASRAM para reconocer y premiar 
                a todos los bares, restaurantes y comercios de hostelería que colaboran con 
                nosotros donando su aceite usado.
              </p>
              <p className="text-muted-foreground text-lg">
                Durante un fin de semana de mayo de 2026, los establecimientos inscritos abrirán 
                sus puertas a cientos de visitantes que recorrerán la ciudad descubriendo nuevos 
                lugares, disfrutando de ofertas especiales y apoyando el comercio local sostenible.
              </p>
              <ul className="space-y-3">
                {[
                  "Evento gratuito para establecimientos y visitantes",
                  "Mapa interactivo con todos los locales participantes",
                  "Promoción en redes sociales y medios locales",
                  "Premios para los establecimientos más visitados"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Interior de bar acogedor"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white p-6 rounded-xl shadow-xl">
                <PartyPopper className="w-10 h-10 mb-2" />
                <div className="text-2xl font-bold">Mayo</div>
                <div className="text-sm text-white/80">2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios para establecimientos */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">Para comercios</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Beneficios para tu establecimiento
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Da igual el tamaño o la ubicación de tu negocio. Todos los establecimientos 
              participantes disfrutan de las mismas ventajas.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {beneficiosEstablecimientos.map((beneficio, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
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

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">Proceso</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              ¿Cómo funciona?
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comoFunciona.map((paso, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                      {paso.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{paso.title}</h3>
                    <p className="text-sm text-muted-foreground">{paso.description}</p>
                  </div>
                  {index < comoFunciona.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-6 -right-3 w-6 h-6 text-amber-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Imagen promocional */}
      <section className="relative h-[350px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Restaurante con ambiente cálido"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Una red comunitaria donde todos ganan
              </h3>
              <p className="text-white/90 text-lg">
                Comercios, vecinos y medio ambiente unidos en un mismo evento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formularios de inscripción */}
      <section className="py-20 bg-muted/30" id="inscripcion">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Inscripciones abiertas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inscríbete en la Ruta Dorada
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige tu tipo de inscripción y forma parte de este gran evento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="establecimiento" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
                <TabsTrigger value="establecimiento" className="text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <Store className="w-5 h-5" />
                  Soy un Establecimiento
                </TabsTrigger>
                <TabsTrigger value="persona" className="text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <Users className="w-5 h-5" />
                  Quiero Participar
                </TabsTrigger>
              </TabsList>

              {/* Formulario para establecimientos */}
              <TabsContent value="establecimiento">
                <Card className="shadow-xl border-0 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                    <CardTitle className="flex items-center gap-3">
                      <Utensils className="w-6 h-6 text-amber-500" />
                      Inscripción de Establecimiento
                    </CardTitle>
                    <CardDescription>
                      Registra tu bar, restaurante o comercio de hostelería
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleBarSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombreEstablecimiento">Nombre del Establecimiento *</Label>
                          <Input
                            id="nombreEstablecimiento"
                            name="nombreEstablecimiento"
                            value={barFormData.nombreEstablecimiento}
                            onChange={handleBarInputChange}
                            required
                            placeholder="Bar La Esquina"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tipoNegocio">Tipo de Negocio *</Label>
                          <Input
                            id="tipoNegocio"
                            name="tipoNegocio"
                            value={barFormData.tipoNegocio}
                            onChange={handleBarInputChange}
                            required
                            placeholder="Bar, Restaurante, Cafetería..."
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombreContacto">Persona de Contacto *</Label>
                          <Input
                            id="nombreContacto"
                            name="nombreContacto"
                            value={barFormData.nombreContacto}
                            onChange={handleBarInputChange}
                            required
                            placeholder="Nombre y apellidos"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={barFormData.email}
                            onChange={handleBarInputChange}
                            required
                            placeholder="email@establecimiento.com"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono *</Label>
                          <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            value={barFormData.telefono}
                            onChange={handleBarInputChange}
                            required
                            placeholder="600 000 000"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="barrio">Barrio</Label>
                          <Input
                            id="barrio"
                            name="barrio"
                            value={barFormData.barrio}
                            onChange={handleBarInputChange}
                            placeholder="Malasaña, Lavapiés..."
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="direccion">Dirección *</Label>
                          <Input
                            id="direccion"
                            name="direccion"
                            value={barFormData.direccion}
                            onChange={handleBarInputChange}
                            required
                            placeholder="Calle, número..."
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="codigoPostal">Código Postal *</Label>
                          <Input
                            id="codigoPostal"
                            name="codigoPostal"
                            value={barFormData.codigoPostal}
                            onChange={handleBarInputChange}
                            required
                            placeholder="28000"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descripcion">Cuéntanos sobre tu establecimiento</Label>
                        <Textarea
                          id="descripcion"
                          name="descripcion"
                          value={barFormData.descripcion}
                          onChange={handleBarInputChange}
                          placeholder="Tipo de cocina, ambiente, especialidades..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                        <Checkbox
                          id="colaboraASRAM"
                          checked={barFormData.colaboraASRAM}
                          onCheckedChange={(checked) => 
                            setBarFormData(prev => ({ ...prev, colaboraASRAM: checked as boolean }))
                          }
                        />
                        <Label htmlFor="colaboraASRAM" className="text-sm font-normal cursor-pointer">
                          Ya colaboro con ASRAM donando mi aceite usado
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-4 rounded-lg border">
                        <Checkbox
                          id="aceptaTerminosBar"
                          checked={barFormData.aceptaTerminos}
                          onCheckedChange={(checked) => 
                            setBarFormData(prev => ({ ...prev, aceptaTerminos: checked as boolean }))
                          }
                        />
                        <Label htmlFor="aceptaTerminosBar" className="text-sm font-normal cursor-pointer leading-relaxed">
                          Acepto la{" "}
                          <Link to="/privacidad" className="text-amber-600 hover:underline font-medium">
                            política de privacidad
                          </Link>{" "}
                          y consiento el tratamiento de mis datos. *
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base bg-amber-500 hover:bg-amber-600 shadow-lg"
                        disabled={isSubmittingBar}
                      >
                        {isSubmittingBar ? (
                          "Enviando inscripción..."
                        ) : (
                          <>
                            <Store className="w-5 h-5 mr-2" />
                            Inscribir mi Establecimiento
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Formulario para personas */}
              <TabsContent value="persona">
                <Card className="shadow-xl border-0 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                    <CardTitle className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-amber-500" />
                      Inscripción de Participante
                    </CardTitle>
                    <CardDescription>
                      Regístrate para recibir información y participar en el evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handlePersonaSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombrePersona">Nombre *</Label>
                          <Input
                            id="nombrePersona"
                            name="nombre"
                            value={personaFormData.nombre}
                            onChange={handlePersonaInputChange}
                            required
                            placeholder="Tu nombre"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellidosPersona">Apellidos *</Label>
                          <Input
                            id="apellidosPersona"
                            name="apellidos"
                            value={personaFormData.apellidos}
                            onChange={handlePersonaInputChange}
                            required
                            placeholder="Tus apellidos"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emailPersona">Email *</Label>
                          <Input
                            id="emailPersona"
                            name="email"
                            type="email"
                            value={personaFormData.email}
                            onChange={handlePersonaInputChange}
                            required
                            placeholder="tu@email.com"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefonoPersona">Teléfono</Label>
                          <Input
                            id="telefonoPersona"
                            name="telefono"
                            type="tel"
                            value={personaFormData.telefono}
                            onChange={handlePersonaInputChange}
                            placeholder="600 000 000"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="codigoPostalPersona">Código Postal</Label>
                          <Input
                            id="codigoPostalPersona"
                            name="codigoPostal"
                            value={personaFormData.codigoPostal}
                            onChange={handlePersonaInputChange}
                            placeholder="28000"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comoConociste">¿Cómo nos conociste?</Label>
                          <Input
                            id="comoConociste"
                            name="comoConociste"
                            value={personaFormData.comoConociste}
                            onChange={handlePersonaInputChange}
                            placeholder="Redes sociales, amigos..."
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 rounded-lg border">
                        <Checkbox
                          id="aceptaTerminosPersona"
                          checked={personaFormData.aceptaTerminos}
                          onCheckedChange={(checked) => 
                            setPersonaFormData(prev => ({ ...prev, aceptaTerminos: checked as boolean }))
                          }
                        />
                        <Label htmlFor="aceptaTerminosPersona" className="text-sm font-normal cursor-pointer leading-relaxed">
                          Acepto la{" "}
                          <Link to="/privacidad" className="text-amber-600 hover:underline font-medium">
                            política de privacidad
                          </Link>{" "}
                          y quiero recibir información sobre la Ruta Dorada. *
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base bg-amber-500 hover:bg-amber-600 shadow-lg"
                        disabled={isSubmittingPersona}
                      >
                        {isSubmittingPersona ? (
                          "Enviando inscripción..."
                        ) : (
                          <>
                            <Star className="w-5 h-5 mr-2" />
                            Quiero Participar
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Calle con terrazas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-amber-900/85" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Store className="w-12 h-12 text-amber-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Tienes preguntas?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos y te explicamos todo sobre la Ruta Dorada
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-amber-600 hover:bg-white/90 shadow-xl"
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

export default RutaDorada;
