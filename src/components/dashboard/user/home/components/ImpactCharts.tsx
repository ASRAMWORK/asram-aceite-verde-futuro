
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const ImpactCharts = () => {
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

  return (
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
  );
};

export default ImpactCharts;
