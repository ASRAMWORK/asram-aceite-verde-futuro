
import PageLayout from "@/components/layout/PageLayout";

const Detergente = () => {
  return (
    <PageLayout 
      title="Detergente Solidario" 
      subtitle="Proyecto de emergencia social para comunidades afectadas"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            Del aceite usado al impacto social positivo
          </h3>
          
          <p className="mb-6">
            El proyecto "Detergente Solidario" transforma aceite de cocina usado en detergente 
            sostenible, que posteriormente donamos a zonas afectadas por catástrofes como la DANA 
            y otras situaciones de emergencia, ayudando a comunidades vulnerables mientras 
            reducimos la contaminación.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">Beneficios del proyecto</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Beneficio medioambiental</h5>
              <p>Evitamos que el aceite contamine el agua y le damos una segunda vida útil.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Beneficio social</h5>
              <p>Proporcionamos productos esenciales a personas en situaciones vulnerables.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Beneficio económico</h5>
              <p>Generamos empleos en la producción y distribución del detergente solidario.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Beneficio educativo</h5>
              <p>Sensibilizamos sobre la importancia del reciclaje y la solidaridad.</p>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-xl font-semibold text-asram-800 mb-4">¿Cómo colaborar?</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-asram font-bold">•</span>
                <span>Donando aceite usado para la producción de detergente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-asram font-bold">•</span>
                <span>Aportando recursos económicos para mejorar la producción</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-asram font-bold">•</span>
                <span>Participando como voluntario en la elaboración y distribución</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-asram font-bold">•</span>
                <span>Difundiendo el proyecto para llegar a más personas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Detergente;
