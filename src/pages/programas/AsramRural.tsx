
import PageLayout from "@/components/layout/PageLayout";

const AsramRural = () => {
  return (
    <PageLayout 
      title="ASRAM Rural" 
      subtitle="Llevamos el reciclaje sostenible a zonas rurales"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            Adaptando el modelo urbano a entornos rurales
          </h3>
          
          <p className="mb-6">
            ASRAM Rural es una adaptación de nuestro modelo urbano a las particularidades de las zonas 
            rurales, donde la gestión de residuos puede presentar desafíos diferentes. Este programa 
            busca garantizar que todas las comunidades, independientemente de su tamaño o ubicación, 
            puedan contribuir a la economía circular y beneficiarse de ella.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">Componentes del programa</h4>
          <div className="space-y-6">
            <div className="p-5 border-l-4 border-asram bg-asram-50/30">
              <h5 className="font-bold mb-2">Puntos de recolección local</h5>
              <p>Instalamos puntos de recogida adaptados a las necesidades específicas de cada población.</p>
            </div>
            <div className="p-5 border-l-4 border-asram bg-asram-50/30">
              <h5 className="font-bold mb-2">Talleres gratuitos comunitarios</h5>
              <p>Organizamos sesiones formativas en escuelas rurales y asociaciones de pueblo.</p>
            </div>
            <div className="p-5 border-l-4 border-asram bg-asram-50/30">
              <h5 className="font-bold mb-2">Rutas de recogida optimizadas</h5>
              <p>Diseñamos circuitos eficientes para minimizar la huella de carbono en el transporte.</p>
            </div>
            <div className="p-5 border-l-4 border-asram bg-asram-50/30">
              <h5 className="font-bold mb-2">Alianzas con cooperativas locales</h5>
              <p>Colaboramos con entidades del territorio para fortalecer el tejido social y económico.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AsramRural;
