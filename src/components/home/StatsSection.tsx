
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecycleIcon, Droplet, GraduationCap } from "lucide-react";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <RecycleIcon className="h-6 w-6 text-green-600" />
            <span>Aceite Reciclado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700">25L</div>
          <p className="text-sm text-green-600">Este mes</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Droplet className="h-6 w-6 text-blue-600" />
            <span>Agua Ahorrada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700">25,000L</div>
          <p className="text-sm text-blue-600">Impacto total</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            <span>Puntos Verdes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700">150</div>
          <p className="text-sm text-purple-600">Puntos acumulados</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSection;
