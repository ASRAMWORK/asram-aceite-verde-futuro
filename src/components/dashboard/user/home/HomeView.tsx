import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Droplet, Recycle, Book, Earth, HandHelping, Users, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const HomeView = () => {
  // Datos de ejemplo para Madrid
  const recyclingData = [
    { distrito: "Centro", litros: 2500 },
    { distrito: "Salamanca", litros: 1800 },
    { distrito: "Chamberí", litros: 2200 },
    { distrito: "Retiro", litros: 1900 },
    { distrito: "Chamartín", litros: 2100 },
  ];

  const participationData = [
    { name: "Participan", value: 35, color: "#10B981" },
    { name: "No Participan", value: 65, color: "#EF4444" },
  ];

  const impactData = [
    { name: "Litros de agua ahorrados", value: 2500000 },
    { name: "kg CO2 evitados", value: 15000 },
    { name: "Litros aceite reciclados", value: 2500 },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-asram">ASRAM</h1>
        <p className="text-xl text-gray-600">
          Juntos por un futuro más sostenible
        </p>
      </section>

      {/* Estadísticas Generales */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Impacto en Madrid</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-500" />
              <CardTitle className="text-lg">Población Impactada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">3.2M</div>
              <p className="text-gray-600">
                Habitantes en Madrid
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Recycle className="w-10 h-10 text-green-500" />
              <CardTitle className="text-lg">Aceite Reciclado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">25,000L</div>
              <p className="text-gray-600">
                Total de aceite recuperado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Percent className="w-10 h-10 text-purple-500" />
              <CardTitle className="text-lg">Participación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">35%</div>
              <p className="text-gray-600">
                De hogares participando
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gráficas de Impacto */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Reciclaje por Distrito</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recyclingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="distrito" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="litros" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Participación Ciudadana</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {participationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* How it Works Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Cómo funcionan nuestros servicios?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Container className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Instalación gratuita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                ASRAM proporciona los contenedores adaptados y pequeños envases para que cada hogar almacene el aceite.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Recycle className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Recogida mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se establece un calendario de vaciado por distrito para garantizar un servicio ordenado.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Droplet className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Tipo de aceite</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se recoge aceite vegetal usado de cocina libre de restos sólidos y contaminantes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Beneficios e impacto ambiental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Droplet className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Reducción de contaminación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un litro de aceite usado puede contaminar hasta 1.000 L de agua.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Recycle className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Economía circular</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Convertimos residuos en recursos útiles, generando empleo verde.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Book className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Concienciación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fomentamos la responsabilidad ambiental mediante talleres y campañas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Oil Destination Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Destino del aceite recogido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <HandHelping className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Iniciativas solidarias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Proyectos de elaboración de detergente sostenible y otras iniciativas sociales.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Earth className="w-10 h-10 text-asram" />
              <CardTitle className="text-lg">Gestión autorizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Transformación en biodiésel u otros productos a través de gestoras autorizadas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Impacto Medioambiental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactData.map((item, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Earth className="w-10 h-10 text-green-500" />
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {item.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
