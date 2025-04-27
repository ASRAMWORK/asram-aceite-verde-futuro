
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Recycle, Percent } from "lucide-react";

const StatsOverview = () => {
  return (
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
            <p className="text-gray-600">Habitantes en Madrid</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Recycle className="w-10 h-10 text-green-500" />
            <CardTitle className="text-lg">Aceite Reciclado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">25,000L</div>
            <p className="text-gray-600">Total de aceite recuperado</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Percent className="w-10 h-10 text-purple-500" />
            <CardTitle className="text-lg">Participación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">35%</div>
            <p className="text-gray-600">De hogares participando</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StatsOverview;
