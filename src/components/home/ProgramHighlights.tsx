
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Droplet, RecycleIcon, Book } from "lucide-react";

const ProgramHighlights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <Container className="w-10 h-10 text-asram" />
          <CardTitle className="text-lg">Instalación gratuita</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Proporcionamos contenedores adaptados y envases para almacenar el aceite.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <RecycleIcon className="w-10 h-10 text-asram" />
          <CardTitle className="text-lg">Recogida mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Calendario de vaciado por distrito para un servicio ordenado.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <Droplet className="w-10 h-10 text-asram" />
          <CardTitle className="text-lg">Impacto ambiental</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Cada litro reciclado evita contaminar 1.000L de agua.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <Book className="w-10 h-10 text-asram" />
          <CardTitle className="text-lg">Educación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Programas de concienciación y formación ambiental.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramHighlights;
