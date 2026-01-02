import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Heart, 
  Leaf, 
  Users, 
  Award,
  Lightbulb,
  Globe,
  CheckCircle,
  TreePine,
  Droplets,
  Recycle,
  Building,
  GraduationCap,
  HandHeart
} from "lucide-react";
import { useEffect } from "react";

const Mision = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const valores = [
    {
      icon: Leaf,
      title: "Sostenibilidad",
      description: "Compromiso con el medio ambiente y las generaciones futuras a través de prácticas responsables.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Búsqueda constante de soluciones creativas y eficientes para el reciclaje de aceite.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Trabajo colaborativo con vecinos y organizaciones para crear una red de apoyo.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Award,
      title: "Transparencia",
      description: "Gestión clara y honesta en todas nuestras operaciones y comunicación.",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const objetivos = [
    { icon: Building, text: "Red completa de puntos de recogida en toda la ciudad" },
    { icon: Droplets, text: "Reducir la contaminación de aguas en Madrid en un 15% para 2026" },
    { icon: HandHeart, text: "Crear 50 nuevos empleos verdes en comunidades vulnerables" },
    { icon: GraduationCap, text: "Programas educativos que lleguen a 100 escuelas" },
    { icon: Recycle, text: "Alianzas con 20 empresas para reutilizar aceite reciclado" }
  ];

  const impactoStats = [
    { value: "-150T", label: "CO₂ evitado" },
    { value: "+10K", label: "Litros reciclados" },
    { value: "100%", label: "Compromiso" },
    { value: "0€", label: "Coste para ti" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Amanecer en la naturaleza"
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
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Nuestro propósito</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Misión y{" "}
              <span className="text-asram-light">Visión</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Trabajamos cada día para transformar Madrid en una ciudad más sostenible, 
              donde el reciclaje sea parte de la vida cotidiana de cada ciudadano.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Misión y Visión */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-none shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-asram to-asram-light" />
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-asram to-asram-dark rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Nuestra Misión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Transformar la gestión del aceite usado en Madrid a través de un modelo 
                    sostenible y socialmente responsable, creando conciencia ambiental y 
                    generando valor para la comunidad.
                  </p>
                  <p className="text-muted-foreground">
                    Buscamos implementar soluciones innovadoras que conecten a la ciudadanía 
                    con la economía circular, facilitando el reciclaje y promoviendo hábitos 
                    sostenibles en los hogares y comercios madrileños.
                  </p>
                  <ul className="space-y-3 pt-4">
                    {[
                      "Recogida gratuita de aceite usado",
                      "Educación ambiental continua",
                      "Transformación en recursos sostenibles"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-asram flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-none shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-asram-light to-asram" />
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-asram-light to-asram rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Nuestra Visión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Ser referentes en la economía circular en Madrid, liderando la 
                    transformación hacia una sociedad más sostenible y consciente del 
                    impacto ambiental.
                  </p>
                  <p className="text-muted-foreground">
                    Aspiramos a crear una red integral de reciclaje que sea accesible 
                    para todos los ciudadanos, contribuyendo significativamente a la 
                    reducción de la contaminación y al desarrollo de una economía 
                    local basada en la sostenibilidad.
                  </p>
                  <ul className="space-y-3 pt-4">
                    {[
                      "Madrid libre de vertidos de aceite",
                      "Empleo verde para todos",
                      "Referentes nacionales en reciclaje"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-asram flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Imagen inspiracional */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Vista aérea de bosque verde"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <blockquote className="text-white text-2xl md:text-3xl font-light italic max-w-3xl">
              "No heredamos la tierra de nuestros ancestros, la tomamos prestada de nuestros hijos"
            </blockquote>
            <p className="text-white/70 mt-4">— Proverbio nativo americano</p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Lo que nos guía</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Principios fundamentales que orientan cada decisión y acción de ASRAM
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {valores.map((valor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${valor.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <valor.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{valor.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{valor.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-asram font-medium text-sm uppercase tracking-wider">Hacia dónde vamos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Objetivos Estratégicos
              </h2>
              <p className="text-lg text-muted-foreground">
                Metas concretas que guían nuestro trabajo diario
              </p>
            </div>
            
            <div className="space-y-4">
              {objetivos.map((objetivo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className="flex h-12 w-12 rounded-full bg-asram/10 items-center justify-center flex-shrink-0">
                        <objetivo.icon className="w-6 h-6 text-asram" />
                      </div>
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-asram font-bold text-xl">0{index + 1}</span>
                        <p className="font-medium text-foreground">{objetivo.text}</p>
                      </div>
                    </CardContent>
                  </Card>
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
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Naturaleza verde"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Lago cristalino"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-[250px]">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Montaña verde"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <TreePine className="w-16 h-16 text-asram mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Únete a nuestra misión
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Juntos podemos transformar Madrid en una ciudad más limpia y sostenible. 
              Cada litro de aceite que reciclas marca la diferencia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-asram hover:bg-asram-dark" asChild>
                <Link to="/contacto">Solicitar recogida</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/voluntarios">Ser voluntario</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Mision;
