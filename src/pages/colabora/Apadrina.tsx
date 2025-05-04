
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

const Apadrina = () => {
  const isMobile = useIsMobile();
  
  return (
    <PageLayout 
      title="Apadrina una Calle" 
      subtitle="Ayúdanos a expandir nuestra red de reciclaje"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`grid ${isMobile ? "grid-cols-1 gap-6" : "md:grid-cols-3 gap-8"}`}>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Plan Básico</CardTitle>
              <div className="text-3xl font-bold text-asram mt-2">9.90€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {["Certificado digital de padrino", "Acceso a nuestra revista mensual", "Invitación a jornadas comunitarias y eventos de ASRAM"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full mt-6 ${isMobile ? "h-12" : ""}`}
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
              <div className="text-3xl font-bold text-asram mt-2">49.90€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Todo lo incuido en el plan basico",
                  "Placa conmemorativa con todos los padrinos de una calle",
                  "Acceso prioritario a charlas, talleres y encuentros",
                  "Mencion especial en nuestra revista",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full mt-6 ${isMobile ? "h-12" : ""}`}
                onClick={() => window.open("https://buy.stripe.com/test_9AQ8yvdp8bee45a5kl", "_blank")}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Plan Premium</CardTitle>
              <div className="text-3xl font-bold text-asram mt-2">99.90€/mes</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Todos los beneficios anteriores",
                  "Placa conmemorativa personalizada con tu nombre o el de tu organización",
                  "Informes personalizados del impacto generado",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-asram mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full mt-6 ${isMobile ? "h-12" : ""}`}
                onClick={() => window.open("https://buy.stripe.com/test_6oE9Czcl46XY6di9AC", "_blank")}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 bg-white/70 backdrop-blur-sm">
          <CardContent className={`p-6 ${isMobile ? "px-4" : "p-8"}`}>
            <h2 className="text-2xl font-bold text-asram-800 mb-4">
              ¿Por qué apadrinar una calle?
            </h2>
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "md:grid-cols-2 gap-6"}`}>
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
      {isMobile && <div className="h-16"></div>}
    </PageLayout>
  );
};

export default Apadrina;
