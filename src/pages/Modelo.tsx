
import PageLayout from "@/components/layout/PageLayout";

const Modelo = () => {
  return (
    <PageLayout 
      title="Modelo de Economía Circular" 
      subtitle="Transformando residuos en recursos sostenibles"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">¿Cómo funciona?</h3>
          
          <div className="space-y-6">
            <p className="text-lg">
              ASRAM recoge el aceite usado y lo procesa para obtener biodiésel u otros productos, 
              reinvirtiendo los ingresos generados en ampliar servicios y programas de sensibilización.
            </p>
            <p>
              De este modo, el propio residuo financia su gestión y promueve la sostenibilidad, 
              creando un ciclo virtuoso donde el desperdicio se convierte en un recurso valioso.
            </p>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-asram-700 mb-4">Beneficios del modelo circular</h4>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">01</span>
                <span>Reducción de la contaminación del agua</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">02</span>
                <span>Producción de energía renovable</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">03</span>
                <span>Creación de empleo local</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">04</span>
                <span>Sensibilización ciudadana</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">05</span>
                <span>Reducción de emisiones de CO₂</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-asram-50 rounded-lg">
                <span className="text-asram font-bold">06</span>
                <span>Economía autosostenible</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Modelo;
