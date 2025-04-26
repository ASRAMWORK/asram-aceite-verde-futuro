
import PageLayout from "@/components/layout/PageLayout";

const AsramKids = () => {
  return (
    <PageLayout 
      title="ASRAM Kids" 
      subtitle="Actividades lúdico-educativas para los más pequeños"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-asram-800 mb-4">
            Aprendiendo hábitos responsables jugando
          </h3>
          
          <p className="mb-6">
            ASRAM Kids es un espacio lúdico-educativo vinculado a nuestra Alianza Verde Escolar, 
            donde los más pequeños desarrollan conciencia medioambiental a través de juegos, 
            cuentos y actividades adaptadas a su edad.
          </p>
          
          <h4 className="text-xl font-semibold text-asram-700 mt-8 mb-4">Actividades principales</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Juegos de reciclaje</h5>
              <p>Actividades interactivas donde aprenden a clasificar residuos de forma divertida.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Cuentacuentos verdes</h5>
              <p>Narraciones que transmiten valores de cuidado y respeto por el medio ambiente.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Manualidades sostenibles</h5>
              <p>Creación de juguetes y objetos decorativos con materiales reciclados.</p>
            </div>
            <div className="p-5 border border-asram-100 rounded-lg bg-asram-50/30">
              <h5 className="font-bold mb-2">Mini jardinería</h5>
              <p>Iniciación al cuidado de plantas y cultivo de pequeños huertos.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AsramKids;
