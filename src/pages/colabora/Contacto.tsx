
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube 
} from "lucide-react";
import { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would go the form submission logic
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    });
    // Show success message (would use a toast in a real app)
    alert("Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.");
  };
  
  return (
    <PageLayout 
      title="Contacto" 
      subtitle="Únete a nosotros y forma parte del cambio"
    >
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <Card className="bg-white/70 backdrop-blur-sm shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-asram-800">Información de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-asram mt-1" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p className="text-gray-600">Calle Genciana, 6 – 28039 Madrid</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-asram mt-1" />
                  <div>
                    <h3 className="font-semibold">Teléfono</h3>
                    <p className="text-gray-600">‪+34 695 83 17 84‬ (llamadas)</p>
                    <p className="text-gray-600">‪+34 666 66 36 59‬ (WhatsApp)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-asram mt-1" />
                  <div>
                    <h3 className="font-semibold">Correo electrónico</h3>
                    <p className="text-gray-600">info@asramadrid.com</p>
                    <p className="text-gray-600">colabora@asramadrid.com</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-4">Síguenos en redes sociales</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Youtube className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white/70 backdrop-blur-sm shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-asram-800">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <Input
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="Asunto del mensaje"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contacto;
