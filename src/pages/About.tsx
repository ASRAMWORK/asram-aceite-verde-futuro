import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import { 
  Recycle, 
  Users, 
  Leaf, 
  MapPin, 
  Phone, 
  Mail,
  Building,
  Award,
  Target,
  Heart,
  CheckCircle,
  Calendar,
  Globe,
  Droplets,
  TreePine
} from "lucide-react";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { value: "+10K", label: "Litros reciclados", icon: Droplets },
    { value: "+1000", label: "Puntos verdes", icon: MapPin },
    { value: "21", label: "Distritos", icon: Building },
    { value: "2024", label: "Año fundación", icon: Calendar }
  ];

  const pilares = [
    {
      icon: Leaf,
      title: "Sostenibilidad",
      description: "Transformamos residuos en recursos, fomentando la economía circular y reduciendo el impacto ambiental."
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Trabajamos junto a vecinos, empresas y administraciones para crear una red de reciclaje accesible."
    },
    {
      icon: Heart,
      title: "Impacto Social",
      description: "Generamos empleo verde y apoyamos la inserción laboral de personas en riesgo de exclusión."
    },
    {
      icon: Award,
      title: "Innovación",
      description: "Desarrollamos soluciones creativas para hacer el reciclaje más fácil y eficiente."
    }
  ];

  const timeline = [
    { year: "2024", title: "Fundación", description: "ASRAM nace como asociación sin ánimo de lucro en Madrid." },
    { year: "2024", title: "Primera Ruta", description: "Iniciamos la recogida de aceite en el distrito Centro." },
    { year: "2025", title: "Expansión", description: "Ampliamos a 21 distritos y más de 1000 puntos verdes." },
    { year: "2026", title: "Ruta Dorada", description: "Lanzamiento del programa para comercios sostenibles." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Reciclaje sostenible"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-asram/90 text-white px-4 py-2 rounded-full mb-6">
              <Recycle className="w-4 h-4" />
              <span className="text-sm font-medium">Conoce nuestra historia</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Asociación para el Reciclaje de Aceite en{" "}
              <span className="text-asram-light">Madrid</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Somos una organización sin ánimo de lucro que transforma el aceite 
              de cocina usado en recursos sostenibles, protegiendo el medio ambiente 
              y creando valor para nuestra comunidad.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-asram hover:bg-asram-dark" asChild>
                <Link to="/contacto">Únete a nosotros</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
                <Link to="/voluntarios">Sé voluntario</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-asram">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-asram font-medium text-sm uppercase tracking-wider">Nuestra historia</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                ¿Quiénes somos?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  ASRAM es una organización sin ánimo de lucro fundada en 2024 por jóvenes 
                  emprendedores en colaboración con entidades locales de la Comunidad de Madrid.
                </p>
                <p>
                  Nacimos para afrontar un problema urgente: <strong className="text-foreground">solo el 10% del aceite 
                  de cocina usado se recicla en España</strong>. El resto termina contaminando ríos, 
                  suelos y sistemas de alcantarillado.
                </p>
                <p>
                  Ofrecemos un servicio gratuito, accesible, seguro e higiénico para que los 
                  hogares y comercios conviertan este residuo contaminante en un recurso útil, 
                  contribuyendo así a la economía circular y la sostenibilidad medioambiental.
                </p>
                <p>
                  Formamos parte del <strong className="text-foreground">Grupo Reciclaje de Aceite Peninsular</strong>, 
                  colaborando con administraciones locales, empresas y entidades sociales para 
                  escalar nuestros proyectos y reforzar la inserción laboral de personas en 
                  riesgo de exclusión.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Manos sosteniendo planta"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-asram text-white p-6 rounded-xl shadow-xl">
                <Globe className="w-10 h-10 mb-2" />
                <div className="text-2xl font-bold">1L = 1000L</div>
                <div className="text-sm text-white/80">de agua protegida</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Imagen dividida */}
      <section className="relative h-[350px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Bosque verde"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <blockquote className="text-white text-2xl md:text-3xl font-light italic max-w-3xl">
              "1 litro de aceite vertido por el desagüe puede contaminar hasta 1.000 litros de agua"
            </blockquote>
            <p className="text-white/70 mt-4">— Ministerio para la Transición Ecológica</p>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Lo que nos define</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Nuestros pilares
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cuatro valores fundamentales que guían cada acción de ASRAM
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pilares.map((pilar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-asram to-asram-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <pilar.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{pilar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{pilar.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Nuestra trayectoria</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Historia de ASRAM
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-asram/30" />
              
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center gap-6 mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <Card className="inline-block shadow-lg border-none">
                      <CardContent className="p-6">
                        <span className="text-asram font-bold text-xl">{item.year}</span>
                        <h3 className="font-semibold text-lg mt-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-asram rounded-full border-4 border-background shadow" />
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Paisaje verde"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1518173946687-a4c036bc3e96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Gotas de agua"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Campo de flores"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-asram font-medium text-sm uppercase tracking-wider">Estamos aquí</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Contacta con nosotros
              </h2>
            </div>
            
            <Card className="shadow-2xl border-none overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-asram via-asram-light to-asram" />
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-asram/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-asram" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Dirección</h3>
                        <p className="text-muted-foreground">Calle Genciana, 6 – 28039 Madrid</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-asram/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-asram" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Teléfono</h3>
                        <p className="text-muted-foreground">+34 695 83 17 84 (llamadas)</p>
                        <p className="text-muted-foreground">+34 666 66 36 59 (WhatsApp)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-asram/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-asram" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <p className="text-muted-foreground">info@asramadrid.com</p>
                        <p className="text-muted-foreground">colabora@asramadrid.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center text-center p-6 bg-muted/30 rounded-xl">
                    <TreePine className="w-16 h-16 text-asram mb-4" />
                    <h3 className="font-bold text-xl mb-2">¿Quieres colaborar?</h3>
                    <p className="text-muted-foreground mb-6">
                      Únete a nuestra red de reciclaje y ayúdanos a proteger el medio ambiente
                    </p>
                    <Button className="bg-asram hover:bg-asram-dark" asChild>
                      <Link to="/contacto">Solicitar información</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
