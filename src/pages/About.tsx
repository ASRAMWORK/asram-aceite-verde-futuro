
import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout 
      title="Sobre Nosotros" 
      subtitle="ASRAM - Asociación para el Reciclaje de Aceite en Madrid"
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-lg">
            ASRAM es una organización sin ánimo de lucro fundada en 2024 por jóvenes emprendedores 
            en colaboración con entidades locales de la Comunidad de Madrid. Nació para afrontar el problema 
            de que solo el 10% del aceite de cocina usado se recicla en España.
          </p>
          <p>
            Ofrecemos un servicio gratuito, accesible, seguro e higiénico para que los hogares 
            conviertan este residuo contaminante en un recurso útil, contribuyendo así a la economía 
            circular y la sostenibilidad medioambiental.
          </p>
          <p>
            Formamos parte del Grupo Reciclaje de Aceite Peninsular, colaborando con administraciones 
            locales, empresas y entidades sociales para escalar nuestros proyectos y reforzar la 
            inserción laboral de personas en riesgo de exclusión.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h3 className="text-2xl font-bold text-asram-800">Datos de contacto</h3>
          <div className="space-y-3">
            <p><strong>Dirección:</strong> Calle Genciana, 6 – 28039 Madrid</p>
            <p><strong>Teléfono:</strong> ‪+34 695 83 17 84‬ (llamadas) / ‪+34 666 66 36 59‬ (WhatsApp)</p>
            <p>
              <strong>Correo:</strong> info@asramadrid.com / colabora@asramadrid.com
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
