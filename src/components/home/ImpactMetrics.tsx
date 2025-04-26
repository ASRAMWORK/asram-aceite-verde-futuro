
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ImpactMetrics = () => {
  const recyclingData = [
    { distrito: "Centro", litros: 2500 },
    { distrito: "Salamanca", litros: 1800 },
    { distrito: "Chamberí", litros: 2200 },
    { distrito: "Retiro", litros: 1900 },
    { distrito: "Chamartín", litros: 2100 },
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Impacto por Distrito</CardTitle>
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
  );
};

export default ImpactMetrics;
