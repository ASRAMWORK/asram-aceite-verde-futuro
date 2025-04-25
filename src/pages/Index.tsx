
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-asram">ASRAM</span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              className="bg-asram hover:bg-asram-700"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Gestión de Aceite Usado de Cocina</h1>
            <p className="text-xl text-gray-600 mb-10">
              Una solución completa para la trazabilidad y gestión sostenible del aceite usado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-asram hover:bg-asram-700 text-white text-lg py-6 px-8"
                onClick={() => navigate("/register")}
              >
                Comenzar ahora
              </Button>
              <Button
                variant="outline"
                className="text-lg py-6 px-8"
                onClick={() => navigate("/login")}
              >
                Acceder al sistema
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué reciclar aceite usado? 🌱
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="futuristic-card p-8 hover-scale">
                <div className="text-4xl mb-4">💧</div>
                <h3 className="text-xl font-bold mb-2">Protege el agua</h3>
                <p className="text-gray-600">
                  Un solo litro de aceite puede contaminar hasta 40.000 litros de agua
                </p>
              </div>
              
              <div className="futuristic-card p-8 hover-scale">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-2">Economía circular</h3>
                <p className="text-gray-600">
                  El aceite usado puede transformarse en biodiesel y otros productos
                </p>
              </div>
              
              <div className="futuristic-card p-8 hover-scale">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2">Reduce CO2</h3>
                <p className="text-gray-600">
                  Reduce la huella de carbono al evitar emisiones y contaminación
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              ASRAM - Nuestros servicios
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Soluciones completas para la gestión del aceite usado de cocina
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="futuristic-card p-6 hover-scale">
                <h3 className="text-lg font-bold mb-2">Puntos Verdes</h3>
                <p className="text-gray-600 mb-4">
                  Contenedores para el reciclaje de aceite en comunidades
                </p>
                <Button variant="link" className="text-asram p-0">
                  Saber más
                </Button>
              </div>
              
              <div className="futuristic-card p-6 hover-scale">
                <h3 className="text-lg font-bold mb-2">Alianza Verde Escolar</h3>
                <p className="text-gray-600 mb-4">
                  Programa educativo para centros escolares
                </p>
                <Button variant="link" className="text-asram p-0">
                  Saber más
                </Button>
              </div>
              
              <div className="futuristic-card p-6 hover-scale">
                <h3 className="text-lg font-bold mb-2">Apadrina una Calle</h3>
                <p className="text-gray-600 mb-4">
                  Programa de suscripción para apadrinar calles
                </p>
                <Button variant="link" className="text-asram p-0">
                  Saber más
                </Button>
              </div>
              
              <div className="futuristic-card p-6 hover-scale">
                <h3 className="text-lg font-bold mb-2">Recogida a Domicilio</h3>
                <p className="text-gray-600 mb-4">
                  Servicio de recogida a domicilio para particulares
                </p>
                <Button variant="link" className="text-asram p-0">
                  Saber más
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Únete a nuestra comunidad
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Forma parte de la solución para un futuro más sostenible.
              Regístrate ahora y comienza a reciclar tu aceite usado.
            </p>
            <Button
              className="bg-asram hover:bg-asram-700 text-white text-lg py-6 px-8"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ASRAM</h3>
              <p className="text-gray-600">
                Soluciones sostenibles para la gestión del aceite usado de cocina.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <p className="text-gray-600">
                Email: info@asramadrid.com<br />
                Teléfono: +34 915 123 456<br />
                Dirección: Calle de la Sostenibilidad, 28001 Madrid
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-asram hover:underline">Sobre nosotros</a></li>
                <li><a href="#" className="text-asram hover:underline">Servicios</a></li>
                <li><a href="#" className="text-asram hover:underline">Contacto</a></li>
                <li><a href="#" className="text-asram hover:underline">Política de privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} ASRAM. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
