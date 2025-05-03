
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Apadrina = () => {
  return (
    <PageLayout 
      title="Apadrina una Calle" 
      subtitle="Ayúdanos a expandir nuestra red de reciclaje"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Plan Básico</CardTitle>
              <div className="text-3xl font-bold text-asram mt-2">29€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {["1 contenedor", "Mantenimiento básico", "Informes mensuales"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => window.open("https://buy.stripe.com/test_6oEcOL3Oygyy59e7ss", "_blank")}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-asram">
            <div className="absolute top-0 right-0 bg-asram text-white px-3 py-1 text-sm">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Plan Plus</CardTitle>
              <div className="text-3xl font-bold text-asram mt-2">49€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "2 contenedores",
                  "Mantenimiento premium",
                  "Informes semanales",
                  "Placa conmemorativa",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => window.open("https://buy.stripe.com/test_9AQ8yvdp8bee45a5kl", "_blank")}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Plan Premium</CardTitle>
              <div className="text-3xl font-bold text-asram mt-2">89€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "4 contenedores",
                  "Mantenimiento VIP",
                  "Informes personalizados",
                  "Placa conmemorativa",
                  "Eventos exclusivos",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => window.open("https://buy.stripe.com/test_6oE9Czcl46XY6di9AC", "_blank")}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-asram-800 mb-4">
              ¿Por qué apadrinar una calle?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-asram-700 mb-2">Impacto Ambiental</h3>
                <p className="text-gray-600">
                  Cada contenedor puede recolectar hasta 500L de aceite usado al mes, 
                  evitando la contaminación de millones de litros de agua.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-asram-700 mb-2">Reconocimiento</h3>
                <p className="text-gray-600">
                  Tu nombre o el de tu empresa aparecerá en los contenedores y en 
                  nuestra web como colaborador oficial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Apadrina;
