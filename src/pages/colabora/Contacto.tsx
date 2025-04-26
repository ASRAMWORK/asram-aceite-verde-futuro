
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí iría la lógica para enviar el formulario
    alert("Gracias por contactar con nosotros. Te responderemos lo antes posible.");
  };

  return (
    <PageLayout 
      title="Contacto" 
      subtitle="Estamos aquí para ayudarte. Contáctanos para cualquier consulta o colaboración"
    >
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-asram-800 mb-6">
            Envíanos un mensaje
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nombre" className="text-sm font-medium">Nombre completo</label>
              <Input 
                id="nombre" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                placeholder="Tu nombre completo" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="tu@email.com" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
              <Input 
                id="telefono" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                placeholder="Tu número de teléfono" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="asunto" className="text-sm font-medium">Asunto</label>
              <Input 
                id="asunto" 
                name="asunto" 
                value={formData.asunto} 
                onChange={handleChange} 
                required 
                placeholder="Motivo de contacto" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mensaje" className="text-sm font-medium">Mensaje</label>
              <Textarea 
                id="mensaje" 
                name="mensaje" 
                value={formData.mensaje} 
                onChange={handleChange} 
                required 
                placeholder="Escribe tu mensaje aquí..." 
                rows={5}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Enviar mensaje
            </Button>
          </form>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 h-fit">
          <h3 className="text-2xl font-bold text-asram-800 mb-6">
            Datos de contacto
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Dirección</h4>
              <p>Calle Genciana, 6 – 28039 Madrid</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Teléfono</h4>
              <p>‪+34 695 83 17 84‬ (llamadas)</p>
              <p>‪+34 666 66 36 59‬ (WhatsApp)</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Correo</h4>
              <p>info@asramadrid.com</p>
              <p>colabora@asramadrid.com</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Horario de atención</h4>
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Fines de semana: Cerrado</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contacto;
