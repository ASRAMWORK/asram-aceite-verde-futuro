
import PageLayout from "@/components/layout/PageLayout";

const PuntosVerdes = () => {
  return (
    <PageLayout 
      title="Puntos Verdes" 
      subtitle="Red de contenedores para el reciclaje de aceite usado"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            Recogida segura e higiénica
          </h3>
          
          <p className="mb-6">
            Nuestros Puntos Verdes son contenedores gratuitos especialmente diseñados para depositar 
            aceite de cocina usado de forma segura e higiénica, instalados estratégicamente en 
            comunidades de vecinos, centros escolares y entidades colaboradoras.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">Características principales</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 items-center">
              <span className="h-2 w-2 bg-asram rounded-full"></span>
              <span>Recipientes sellados para evitar derrames y olores</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="h-2 w-2 bg-asram rounded-full"></span>
              <span>Diseño atractivo y reconocible</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="h-2 w-2 bg-asram rounded-full"></span>
              <span>Recogida periódica por nuestro equipo especializado</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="h-2 w-2 bg-asram rounded-full"></span>
              <span>Información clara sobre uso y beneficios</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="h-2 w-2 bg-asram rounded-full"></span>
              <span>Tecnología de monitoreo para optimizar las recogidas</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center bg-asram-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">¿Quieres un Punto Verde cerca de ti?</h3>
          <p className="mb-6">Contacta con nosotros para solicitar la instalación de un punto de recogida</p>
          <div className="mt-4">
            <a href="/contacto" className="inline-block px-6 py-3 rounded-md bg-asram text-white font-medium hover:bg-asram-600 transition-colors">
              Solicitar Punto Verde
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PuntosVerdes;
