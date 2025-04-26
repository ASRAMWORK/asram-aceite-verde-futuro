
import PageLayout from "@/components/layout/PageLayout";

const AlianzaVerde = () => {
  return (
    <PageLayout 
      title="Alianza Verde Escolar" 
      subtitle="Laboratorios vivos de sostenibilidad en centros educativos"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            Formando a los embajadores verdes del futuro
          </h3>
          
          <p className="mb-6">
            Alianza Verde Escolar es uno de nuestros programas más ambiciosos, centrado en 
            crear espacios de aprendizaje práctico sobre sostenibilidad en colegios e institutos 
            de la Comunidad de Madrid.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">Actividades del programa</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 bg-asram-50/50 rounded-lg">
              <div className="font-bold text-asram mt-1">•</div>
              <div>
                <strong>Talleres de reciclaje creativo</strong>
                <p className="mt-1 text-gray-600">Transformación de residuos en objetos útiles y artísticos</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-asram-50/50 rounded-lg">
              <div className="font-bold text-asram mt-1">•</div>
              <div>
                <strong>Mini huertos urbanos</strong>
                <p className="mt-1 text-gray-600">Cultivo de plantas y alimentos utilizando técnicas sostenibles</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-asram-50/50 rounded-lg">
              <div className="font-bold text-asram mt-1">•</div>
              <div>
                <strong>Conservación del agua</strong>
                <p className="mt-1 text-gray-600">Prácticas para el uso responsable del agua y su reaprovechamiento</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-asram-50/50 rounded-lg">
              <div className="font-bold text-asram mt-1">•</div>
              <div>
                <strong>Energías renovables</strong>
                <p className="mt-1 text-gray-600">Experimentos y demostraciones sobre energía solar, eólica y más</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default AlianzaVerde;
