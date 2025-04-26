
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Mision = () => {
  return (
    <PageLayout 
      title="Misión y Visión" 
      subtitle="Nuestros objetivos y valores que guían nuestro trabajo diario"
    >
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-white/50 backdrop-blur-sm shadow-md border-asram/20">
          <CardHeader>
            <CardTitle className="text-asram-800">Misión</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Impulsar el reciclaje de aceite doméstico mediante prácticas sostenibles que generen un impacto medioambiental y social positivo.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm shadow-md border-asram/20">
          <CardHeader>
            <CardTitle className="text-asram-800">Visión</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ser un referente de economía circular en entornos urbanos y rurales, transformando residuos en el motor que sustenta las acciones de la asociación.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm shadow-md border-asram/20">
          <CardHeader>
            <CardTitle className="text-asram-800">Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Educación</li>
              <li>Protección</li>
              <li>Inserción</li>
              <li>Igualdad</li>
              <li>Transparencia</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Mision;
