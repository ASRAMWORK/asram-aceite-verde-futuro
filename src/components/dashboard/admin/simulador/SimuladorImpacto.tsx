
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Calculator, Droplet, TreePine, Car, Factory, FileText, Download } from "lucide-react";

const SimuladorImpacto = () => {
  const [litrosAceite, setLitrosAceite] = useState(1000);
  const [activeTab, setActiveTab] = useState("medioambiente");
  const [showReport, setShowReport] = useState(false);

  // Constantes de conversión para el cálculo de impacto
  const factores = {
    co2EvitadoPorLitro: 2.3, // kg de CO2 por litro de aceite
    aguaContaminadaPorLitro: 1000, // litros de agua contaminada por litro de aceite
    biodieselPorLitro: 0.92, // litros de biodiesel producido por litro de aceite
    kmPorLitroBiodiesel: 12, // km recorridos por litro de biodiesel
    arbolesEquivalentesPorTonCO2: 50, // árboles por tonelada de CO2
  };

  const calcularImpacto = () => {
    const co2Evitado = litrosAceite * factores.co2EvitadoPorLitro;
    const aguaEvitada = litrosAceite * factores.aguaContaminadaPorLitro;
    const biodieselProducido = litrosAceite * factores.biodieselPorLitro;
    const distanciaRecorrida = biodieselProducido * factores.kmPorLitroBiodiesel;
    const arbolesEquivalentes = (co2Evitado / 1000) * factores.arbolesEquivalentesPorTonCO2;

    return {
      co2Evitado,
      aguaEvitada,
      biodieselProducido,
      distanciaRecorrida,
      arbolesEquivalentes: Math.round(arbolesEquivalentes)
    };
  };

  const impacto = calcularImpacto();

  const datosContaminacion = [
    { name: "CO₂ evitado", value: impacto.co2Evitado, color: "#10B981" },
    { name: "CO₂ equivalente sin reciclar", value: impacto.co2Evitado * 1.5, color: "#EF4444" }
  ];

  const datosBiodiesel = [
    { name: "Biodiesel producido", value: impacto.biodieselProducido, fill: "#3B82F6" },
    { name: "Km recorridos", value: impacto.distanciaRecorrida, fill: "#8B5CF6" }
  ];

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleDownloadReport = () => {
    // Lógica para descargar el reporte
    toast.success("Reporte descargado correctamente");
  };

  const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Simulador de Impacto Ambiental</h2>
        <div className="flex space-x-2">
          <Button onClick={handleGenerateReport} className="bg-asram hover:bg-asram-700">
            <FileText className="mr-2 h-4 w-4" /> Generar informe
          </Button>
          {showReport && (
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span>Parámetros de simulación</span>
            </CardTitle>
            <CardDescription>
              Ajusta los parámetros para calcular el impacto ambiental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="litros">Cantidad de aceite (litros)</Label>
                <span className="font-medium text-lg">{litrosAceite} L</span>
              </div>
              <div className="flex gap-4 items-center">
                <Input 
                  type="number" 
                  id="litros" 
                  value={litrosAceite}
                  onChange={(e) => setLitrosAceite(parseInt(e.target.value) || 0)}
                  className="w-24"
                  min="1"
                />
                <Slider 
                  value={[litrosAceite]} 
                  min={1} 
                  max={10000}
                  step={10}
                  onValueChange={(value) => setLitrosAceite(value[0])} 
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Droplet className="h-8 w-8 mx-auto text-green-600 mb-1" />
                <div className="text-xs text-green-700">Biodiesel producido</div>
                <div className="font-bold text-green-900 text-lg">
                  {impacto.biodieselProducido.toLocaleString()} L
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <TreePine className="h-8 w-8 mx-auto text-blue-600 mb-1" />
                <div className="text-xs text-blue-700">Árboles equivalentes</div>
                <div className="font-bold text-blue-900 text-lg">
                  {impacto.arbolesEquivalentes.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-1">¿Sabías que...?</h4>
              <p className="text-sm text-amber-700">
                Un solo litro de aceite usado puede contaminar hasta 1.000 litros de agua potable, lo que equivale al consumo de una persona durante un año.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="medioambiente">Medio Ambiente</TabsTrigger>
                <TabsTrigger value="biodiesel">Biodiesel</TabsTrigger>
                <TabsTrigger value="comparativa">Comparativa</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-80">
            <TabsContent value="medioambiente" className="h-full">
              <ChartContainer className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "CO₂ evitado", value: impacto.co2Evitado },
                        { name: "Agua no contaminada (m³)", value: impacto.aguaEvitada / 1000 },
                        { name: "Árboles equivalentes", value: impacto.arbolesEquivalentes * 5 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosContaminacion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === "CO₂ evitado") return [`${value.toLocaleString()} kg`, name];
                        if (name === "Agua no contaminada (m³)") return [`${value.toLocaleString()} m³`, name];
                        return [`${value.toLocaleString()}`, name];
                      }}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="biodiesel" className="h-full">
              <ChartContainer className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosBiodiesel}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Biodiesel producido") return [`${value.toLocaleString()} L`, name];
                        if (name === "Km recorridos") return [`${value.toLocaleString()} km`, name];
                        return [`${value.toLocaleString()}`, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Cantidad" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="comparativa" className="h-full">
              <div className="grid grid-cols-2 h-full gap-4">
                <div className="flex flex-col justify-center items-center space-y-4">
                  <div className="relative">
                    <Car className="h-16 w-16 text-purple-500" />
                    <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-purple-700">
                      {Math.round(impacto.distanciaRecorrida / 400)}
                    </div>
                  </div>
                  <p className="text-center text-sm">
                    <span className="font-bold text-purple-700">
                      {Math.round(impacto.distanciaRecorrida).toLocaleString()} km
                    </span>
                    <br />
                    <span className="text-gray-500">Equivalente a {Math.round(impacto.distanciaRecorrida / 400)} vueltas a España</span>
                  </p>
                </div>
                
                <div className="flex flex-col justify-center items-center space-y-4">
                  <div className="relative">
                    <TreePine className="h-16 w-16 text-green-500" />
                    <div className="absolute -top-1 -right-1 bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-green-700">
                      {impacto.arbolesEquivalentes}
                    </div>
                  </div>
                  <p className="text-center text-sm">
                    <span className="font-bold text-green-700">
                      {impacto.arbolesEquivalentes.toLocaleString()} árboles
                    </span>
                    <br />
                    <span className="text-gray-500">
                      Equivalente a {(impacto.arbolesEquivalentes / 100).toFixed(1)} hectáreas de bosque
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      {showReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informe de Impacto Ambiental
            </CardTitle>
            <CardDescription>
              Resumen del impacto ambiental generado por el reciclaje de {litrosAceite} litros de aceite usado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <Droplet className="h-4 w-4" /> Ahorro de agua
                </h3>
                <p className="text-2xl font-bold text-green-900">{impacto.aguaEvitada.toLocaleString()} L</p>
                <p className="text-sm text-green-700">
                  Agua potable que se ha evitado contaminar, equivalente al consumo anual de {Math.round(impacto.aguaEvitada / 50000)} personas.
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 flex items-center gap-2">
                  <Factory className="h-4 w-4" /> CO₂ evitado
                </h3>
                <p className="text-2xl font-bold text-amber-900">{impacto.co2Evitado.toLocaleString()} kg</p>
                <p className="text-sm text-amber-700">
                  Emisiones de CO₂ evitadas, equivalente a {Math.round(impacto.co2Evitado / 120)} días sin coches en Madrid.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 flex items-center gap-2">
                  <Car className="h-4 w-4" /> Biodiesel generado
                </h3>
                <p className="text-2xl font-bold text-blue-900">{impacto.biodieselProducido.toLocaleString()} L</p>
                <p className="text-sm text-blue-700">
                  Combustible renovable producido, capaz de recorrer {impacto.distanciaRecorrida.toLocaleString()} km.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Beneficios adicionales:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Reducción de la dependencia de combustibles fósiles</li>
                <li>Disminución de la carga en plantas de tratamiento de aguas residuales</li>
                <li>Prevención de obstrucciones en tuberías de alcantarillado</li>
                <li>Generación de empleo verde en el sector del reciclaje</li>
                <li>Contribución a la economía circular y sostenibilidad urbana</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" /> Descargar informe completo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SimuladorImpacto;
