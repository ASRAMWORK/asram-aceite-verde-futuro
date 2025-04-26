
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

const Apadrina = () => {
  return (
    <PageLayout 
      title="Apadrina una Calle" 
      subtitle="Extiende la red de reciclaje de aceite en tu comunidad"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            ¿Cómo funciona?
          </h3>
          
          <p className="mb-6">
            El programa "Apadrina una Calle" permite a cualquier persona, familia o empresa "apadrinar" 
            una calle que aún no disponga de servicio de reciclaje de aceite, facilitando la instalación 
            de un punto de recolección y formando a la comunidad para su correcto mantenimiento y uso.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">¿Qué implica apadrinar?</h4>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-asram text-white font-bold">1</div>
              <div className="pt-1">
                <p>Identificar una calle o comunidad sin punto de reciclaje de aceite.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-asram text-white font-bold">2</div>
              <div className="pt-1">
                <p>Contactar con ASRAM para convertirte en padrino/madrina.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-asram text-white font-bold">3</div>
              <div className="pt-1">
                <p>Recibir formación sobre el proyecto y los beneficios del reciclaje.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-asram text-white font-bold">4</div>
              <div className="pt-1">
                <p>Colaborar en la difusión del punto de reciclaje entre los vecinos.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-asram text-white font-bold">5</div>
              <div className="pt-1">
                <p>Recibir informes periódicos sobre el impacto positivo generado.</p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="text-center bg-asram-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">¿Quieres apadrinar una calle?</h3>
          <p className="mb-6">
            Únete al movimiento y ayúdanos a expandir la red de reciclaje de aceite en Madrid
          </p>
          <Button className="mt-4" size="lg">
            Quiero apadrinar
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Apadrina;
