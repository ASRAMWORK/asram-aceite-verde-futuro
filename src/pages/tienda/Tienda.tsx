
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, BookOpen, Users, Award } from "lucide-react";
import { useState } from "react";

// Mock data for demo purposes
const productos = [
  {
    id: 1,
    nombre: "Kit de reciclaje doméstico",
    descripcion: "Todo lo necesario para empezar a reciclar aceite en casa",
    precio: 24.99,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "productos"
  },
  {
    id: 2,
    nombre: "Embudo con filtro",
    descripcion: "Accesorio para facilitar el vertido del aceite usado",
    precio: 8.99,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "productos"
  },
  {
    id: 3,
    nombre: "Detergente ecológico ASRAM",
    descripcion: "Elaborado a partir de aceite reciclado",
    precio: 12.50,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "productos"
  }
];

const formaciones = [
  {
    id: 1,
    nombre: "Curso online: Economía circular",
    descripcion: "Fundamentos teóricos y casos prácticos. 10 horas de formación.",
    precio: 49.99,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "formaciones",
    fechaInicio: "15 de mayo",
  },
  {
    id: 2,
    nombre: "Taller: Elaboración de jabón casero",
    descripcion: "Aprende a crear tus propios productos de limpieza sostenibles",
    precio: 35.00,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "formaciones",
    fechaInicio: "22 de mayo",
  }
];

const talleres = [
  {
    id: 1,
    nombre: "Taller infantil: Pequeños recicladores",
    descripcion: "Actividad para niños de 6-12 años. Duración: 2 horas.",
    precio: 15.00,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "talleres",
    fechaInicio: "5 de junio",
    lugar: "Centro Cultural Las Rozas"
  },
  {
    id: 2,
    nombre: "Taller familiar: Huerto urbano",
    descripcion: "Aprende a crear tu propio huerto en casa. Para todas las edades.",
    precio: 25.00,
    imagen: "https://via.placeholder.com/300x200",
    categoria: "talleres",
    fechaInicio: "12 de junio",
    lugar: "Parque del Retiro"
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
    fechaInicio: "18 de junio",
    lugar: "Madrid Río"
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
  
  return (
    <PageLayout 
      title="Tienda ASRAM" 
      subtitle="Productos, formaciones, talleres y eventos para un futuro más sostenible"
    >
      <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="productos" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Productos</span>
          </TabsTrigger>
          <TabsTrigger value="formaciones" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Formaciones</span>
          </TabsTrigger>
          <TabsTrigger value="talleres" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Talleres</span>
          </TabsTrigger>
          <TabsTrigger value="eventos" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Eventos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="productos" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {productos.map(producto => (
              <Card key={producto.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{producto.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{producto.descripcion}</p>
                  <div className="mt-4 text-xl font-bold text-asram">{producto.precio.toFixed(2)}€</div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full">
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
            {formaciones.map(formacion => (
              <Card key={formacion.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src={formacion.imagen} 
                    alt={formacion.nombre}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
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
                  <Button className="w-full">
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
            {talleres.map(taller => (
              <Card key={taller.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src={taller.imagen} 
                    alt={taller.nombre}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
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
                  <Button className="w-full">
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
            {eventos.map(evento => (
              <Card key={evento.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src={evento.imagen} 
                    alt={evento.nombre}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{evento.nombre}</CardTitle>
                    {evento.gratuito && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Gratuito</span>
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
                  <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    {evento.gratuito ? "Inscribirme" : "Comprar entrada"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 p-6 bg-asram-50 rounded-lg">
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
    </PageLayout>
  );
};

export default Tienda;
