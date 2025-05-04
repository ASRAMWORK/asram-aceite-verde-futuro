import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, BookOpen, Users, Award, MapPin, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const productos = [
  {
    id: 1,
    nombre: "Kit para fabricar velas infinitas",
    descripcion: "Todo lo que necesitas para crear tu propia Vela Infinita. El kit incluye recipiente, mecha reutilizable, soporte y guía de uso. Solo añade aceite vegetal y disfruta de una llama cálida, ecológica y sin residuos. Perfecto para regalar, decorar o iniciarte en un consumo más sostenible.",
    precio: 19.99,
    imagen: "/lovable-uploads/d13e8bef-6a34-475e-b1a9-dbd4cfe6b3ba.png",
    categoria: "productos",
    stripeLink: "https://buy.stripe.com/test_fZebKH5WGdmm9pu3cf"
  },
  {
    id: 2,
    nombre: "Contenedor de Reciclaje, varios colores",
    descripcion: "Con una capacidad de 80 litros, este contenedor de basura es perfecto para gestionar grandes volúmenes de residuos. Su estructura robusta y diseño elegante en color azul lo convierten en una opción ideal para cualquier entorno, desde cocinas hasta oficinas, facilitando la correcta gestión de residuos. Sus dimensiones óptimas (700 mm de alto, base de 350 x 350 mm y abertura de tapa de 200 mm) lo hacen ideal para espacios reducidos sin sacrificar capacidad.",
    precio: 29.99,
    imagen: "/lovable-uploads/e3de3e40-8e1b-468c-9c91-fa93d6b8216a.png",
    categoria: "productos",
    stripeLink: "https://buy.stripe.com/test_7sI8yv84O0zA7hm004"
  },
  {
    id: 3,
    nombre: "Detergente ecológico ASRAM",
    descripcion: "Detergente ecológico ASRAM: eficaz, biodegradable y respetuoso con tu piel y el planeta. Formulado con ingredientes naturales, ideal para ropa blanca y de color. Sin fosfatos ni químicos agresivos. Limpia a fondo cuidando el medioambiente. ¡Elige limpio, elige sostenible!",
    precio: 19.99,
    imagen: "/lovable-uploads/fd435684-868a-4b15-842a-b80cea599978.png",
    categoria: "productos",
    stripeLink: "https://buy.stripe.com/test_14kcOLdp86XY316dQV"
  }
];

const formaciones = [
  {
    id: 1,
    nombre: "Curso online: Economía circular",
    descripcion: "Aprende desde casa los principios de la economía circular y cómo aplicarlos en tu vida, negocio o comunidad. Un curso online práctico y accesible que te ayudará a reducir residuos, optimizar recursos y generar un impacto positivo. ¡Transforma tu forma de consumir y producir!.Fundamentos teóricos y casos prácticos. 40 horas de formación.",
    precio: 49.99,
    imagen: "/lovable-uploads/94155982-51c6-404b-9586-ceb767dfa9e8.png",
    categoria: "formaciones",
    fechaInicio: "CONTINUO",
    stripeLink: "https://buy.stripe.com/test_3csaGD2Ku96645acMT"
  },
  {
    id: 2,
    nombre: "Taller: Elaboración de jabón casero",
    descripcion: "Aprende a crear jabones únicos y sostenibles en nuestro Taller de Jabón Reciclado. Reutilizamos restos de jabón y los transformamos en nuevas piezas aromáticas y decorativas. Una actividad creativa, ecológica y perfecta para todas las edades. ¡Cuida el planeta con tus propias manos!. Se aplican descuertos a grupos en presencial maximo 40 personas",
    precio: 9.99,
    imagen: "/lovable-uploads/36059e6a-aa65-4800-808f-67be41a76bc0.png",
    categoria: "formaciones",
    fechaInicio: "CONTINUO",
    stripeLink: "https://buy.stripe.com/test_aEUcOLfxg8229pueV2"
  }
];

const talleres = [
  {
    id: 1,
    nombre: "Taller infantil: Pequeños recicladores",
    descripcion: " En el taller "Pequeños Recicladores", los niños aprenden jugando la importancia de reducir, reutilizar y reciclar. A través de actividades creativas, descubrirán cómo dar una segunda vida a los residuos. Educación ambiental divertida y adaptada a todas las edades. ¡Reciclar nunca fue tan entretenido! Actividad para niños de 6-12 años. Duración: 2 horas.",
    precio: 19.99,
    imagen: "/lovable-uploads/7882a253-85f5-4147-bd23-636e45eadf54.png",
    categoria: "talleres",
    fechaInicio: "CONTINUO",
    lugar: "ONLINE",
    stripeLink: "https://buy.stripe.com/test_dR6aGD1Gq3LMatyeV3"
  },
  {
    id: 2,
    nombre: "Taller familiar: Huerto urbano",
    descripcion: "Descubre en familia cómo cultivar tus propios alimentos en casa con nuestro Taller de Huerto Urbano. Aprende a sembrar, cuidar y cosechar en espacios pequeños usando métodos sostenibles. Una actividad práctica, educativa y divertida para todas las edades. ¡Manos a la tierra!",
    precio: 24.99,
    imagen: "/lovable-uploads/9810563a-3e20-4f20-a965-f549375cbedd.png",
    categoria: "talleres",
    fechaInicio: "CONTINUO",
    lugar: "ONLINE",
    stripeLink: "https://buy.stripe.com/test_6oE01Zetc966eJO3ci"
  }
];

const eventos = [
  {
    id: 1,
    nombre: "Jornada de limpieza: Río Manzanares",
    descripcion: "Evento de voluntariado para la limpieza del río",
    precio: 0,
    gratuito: true,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "eventos",
    fechaInicio: "CONTINUO",
    lugar: ""
  },
  {
    id: 2,
    nombre: "Feria de Sostenibilidad",
    descripcion: "Exposición y venta de productos ecológicos y charlas formativas",
    precio: 5.00,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "eventos",
    fechaInicio: "30 de junio",
    lugar: "Plaza Mayor"
  }
];

const Tienda = () => {
  const [activeTab, setActiveTab] = useState("productos");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filterItems = (items: any[]) => {
    return items.filter(item => 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Function to handle product purchase via Stripe
  const handlePurchase = (stripeLink: string) => {
    window.open(stripeLink, '_blank');
  };

  return (
    <PageLayout 
      title="Tienda ASRAM" 
      subtitle="Productos, formaciones, talleres y eventos para un futuro más sostenible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar en la tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-background mb-8">
            <TabsTrigger value="productos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Productos</span>
            </TabsTrigger>
            <TabsTrigger value="formaciones" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Formaciones</span>
            </TabsTrigger>
            <TabsTrigger value="talleres" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Talleres</span>
            </TabsTrigger>
            <TabsTrigger value="eventos" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Eventos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="productos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(productos).map(producto => (
                <Card key={producto.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={producto.imagen} 
                      className="w-full h-full object-cover"
                      alt={producto.nombre}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{producto.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{producto.descripcion}</p>
                    <div className="mt-4 text-xl font-bold text-asram">{producto.precio.toFixed(2)}€</div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full bg-asram hover:bg-asram-600"
                      onClick={() => handlePurchase(producto.stripeLink)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Añadir al carrito
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="formaciones" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterItems(formaciones).map(formacion => (
                <Card key={formacion.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={formacion.imagen} 
                      className="w-full h-full object-cover"
                      alt={formacion.nombre}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{formacion.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{formacion.descripcion}</p>
                    <div className="flex items-center mt-4">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Comienza: {formacion.fechaInicio}</span>
                    </div>
                    <div className="mt-4 text-xl font-bold text-asram">{formacion.precio.toFixed(2)}€</div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full bg-asram hover:bg-asram-600"
                      onClick={() => handlePurchase(formacion.stripeLink)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Inscribirme
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="talleres" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterItems(talleres).map(taller => (
                <Card key={taller.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={taller.imagen} 
                      className="w-full h-full object-cover"
                      alt={taller.nombre}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{taller.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{taller.descripcion}</p>
                    <div className="flex items-center mt-4">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Fecha: {taller.fechaInicio}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{taller.lugar}</span>
                    </div>
                    <div className="mt-4 text-xl font-bold text-asram">{taller.precio.toFixed(2)}€</div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full bg-asram hover:bg-asram-600"
                      onClick={() => handlePurchase(taller.stripeLink)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Reservar plaza
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="eventos" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterItems(eventos).map(evento => (
                <Card key={evento.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={evento.imagen}
                      className="w-full h-full object-cover"
                      alt={evento.nombre}
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{evento.nombre}</CardTitle>
                      {evento.gratuito && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Gratuito
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{evento.descripcion}</p>
                    <div className="flex items-center mt-4">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Fecha: {evento.fechaInicio}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{evento.lugar}</span>
                    </div>
                    {!evento.gratuito && (
                      <div className="mt-4 text-xl font-bold text-asram">{evento.precio.toFixed(2)}€</div>
                    )}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full bg-asram hover:bg-asram-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {evento.gratuito ? "Inscribirme" : "Comprar entrada"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-gradient-to-br from-asram-50 to-asram-100 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-asram" />
              <div>
                <h3 className="text-xl font-bold text-asram-800">¿Eres una entidad educativa?</h3>
                <p className="text-gray-600">Consulta nuestros descuentos especiales para centros escolares</p>
              </div>
            </div>
            <Button variant="outline" className="border-asram text-asram hover:bg-asram hover:text-white">
              Solicitar información
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Tienda;
