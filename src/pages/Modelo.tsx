import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import { 
  Recycle, 
  Droplets, 
  Fuel,
  Leaf,
  TreePine,
  Factory,
  Truck,
  Home,
  Store,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Zap
} from "lucide-react";
import { useEffect } from "react";

const Modelo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cicloSteps = [
    {
      icon: Home,
      title: "1. Generación",
      description: "Hogares y comercios generan aceite usado de cocina después de freír alimentos.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Droplets,
      title: "2. Recogida",
      description: "ASRAM recoge el aceite en contenedores especiales de forma gratuita y segura.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Truck,
      title: "3. Transporte",
      description: "El aceite es transportado a plantas de procesamiento autorizadas.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Factory,
      title: "4. Transformación",
      description: "Se procesa para convertirlo en biodiesel, jabones y otros productos sostenibles.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Fuel,
      title: "5. Reutilización",
      description: "Los productos derivados vuelven al mercado como recursos renovables.",
      color: "from-asram to-asram-dark"
    }
  ];

  const beneficiosAmbientales = [
    { icon: Droplets, text: "1L de aceite contamina 1.000L de agua", highlight: "Evitamos esta contaminación" },
    { icon: TreePine, text: "Reducción de emisiones de CO₂", highlight: "-150 toneladas al año" },
    { icon: Leaf, text: "Preservación de ecosistemas acuáticos", highlight: "Ríos y acuíferos limpios" },
    { icon: Globe, text: "Contribución al cambio climático", highlight: "Energía limpia y renovable" }
  ];

  const beneficiosSociales = [
    { icon: Zap, text: "Creación de empleo verde local" },
    { icon: Sparkles, text: "Educación ambiental en la comunidad" },
    { icon: Store, text: "Apoyo a comercios sostenibles" },
    { icon: Recycle, text: "Fomento de la economía circular" }
  ];

  const productos = [
    { name: "Biodiesel", description: "Combustible limpio para vehículos", icon: Fuel },
    { name: "Jabones ecológicos", description: "Productos de limpieza naturales", icon: Sparkles },
    { name: "Lubricantes industriales", description: "Para maquinaria y equipos", icon: Factory },
    { name: "Velas naturales", description: "Decoración sostenible", icon: Leaf }
  ];

  const stats = [
    { value: "+10K", label: "Litros procesados" },
    { value: "100%", label: "Aprovechamiento" },
    { value: "0", label: "Residuos" },
    { value: "-150T", label: "CO₂ evitado" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Naturaleza y sostenibilidad"
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
              <span className="text-sm font-medium">Economía Circular</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Modelo{" "}
              <span className="text-asram-light">Circular</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Transformamos el aceite usado de cocina en recursos valiosos, 
              creando un ciclo sostenible que beneficia al medio ambiente 
              y a toda la comunidad madrileña.
            </p>

            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-asram-light" />
                <span>0 residuos</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-asram-light" />
                <span>100% aprovechamiento</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-asram-light" />
                <span>Impacto global</span>
              </div>
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
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué es la economía circular */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-asram font-medium text-sm uppercase tracking-wider">Concepto</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                ¿Qué es la Economía Circular?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  La economía circular es un modelo de producción y consumo que implica 
                  <strong className="text-foreground"> compartir, reutilizar, reparar, renovar y reciclar</strong> 
                  materiales y productos existentes todas las veces que sea posible.
                </p>
                <p>
                  A diferencia del modelo lineal tradicional (producir, usar, tirar), la economía 
                  circular busca que los recursos permanezcan en uso el mayor tiempo posible, 
                  extrayendo el máximo valor mientras están en uso.
                </p>
                <p>
                  En ASRAM aplicamos este modelo al aceite usado de cocina, transformando 
                  lo que antes era un residuo contaminante en recursos valiosos como 
                  biodiesel, jabones y lubricantes.
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
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Reciclaje sostenible"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-asram text-white p-6 rounded-xl shadow-xl">
                <Recycle className="w-10 h-10 mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-white/80">Aprovechamiento</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ciclo del aceite */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Proceso completo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              El Ciclo del Aceite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desde tu cocina hasta convertirse en energía limpia, así funciona nuestro modelo
            </p>
          </div>
          
          {/* Visual del ciclo */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {cicloSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                    <CardHeader className="pb-2">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-base">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < cicloSteps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-asram" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Flecha circular indicando el ciclo */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-2 bg-asram/10 text-asram px-6 py-3 rounded-full">
                <Recycle className="w-5 h-5" />
                <span className="font-medium">El ciclo se repite continuamente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imagen inspiracional */}
      <section className="relative h-[350px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Campo de flores"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <blockquote className="text-white text-2xl md:text-3xl font-light italic max-w-3xl">
              "No existe el residuo, solo recursos en el lugar equivocado"
            </blockquote>
            <p className="text-white/70 mt-4">— Principio de la Economía Circular</p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Impacto real</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Beneficios del Modelo
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Beneficios Ambientales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Beneficios Ambientales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {beneficiosAmbientales.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.text}</p>
                        <p className="text-sm text-asram font-semibold">{item.highlight}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Beneficios Sociales */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-asram to-asram-light" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-asram/10 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-asram" />
                    </div>
                    <CardTitle className="text-2xl">Beneficios Sociales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {beneficiosSociales.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="w-10 h-10 bg-asram/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-asram" />
                      </div>
                      <p className="font-medium text-foreground">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Productos derivados */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-asram font-medium text-sm uppercase tracking-wider">Transformación</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              ¿En qué se convierte el aceite?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              El aceite usado se transforma en productos útiles y sostenibles
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {productos.map((producto, index) => (
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
                      <producto.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{producto.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{producto.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Bosque verde"
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
            <Recycle className="w-16 h-16 text-asram mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sé parte del ciclo
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tu aceite usado puede convertirse en energía limpia. 
              Únete al modelo circular de ASRAM y ayuda a proteger el medio ambiente.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-asram hover:bg-asram-dark" asChild>
                <Link to="/contacto">Solicitar recogida gratuita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/puntos-verdes">Ver puntos de recogida</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Modelo;
