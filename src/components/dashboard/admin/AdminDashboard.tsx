
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { useUsuarios } from "@/hooks/useUsuarios";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useAlianzaVerde } from "@/hooks/useAlianzaVerde";
import { useCallesApadrinadas } from "@/hooks/useCallesApadrinadas";
import { useRecogidas } from "@/hooks/useRecogidas";
import { Buildings, GraduationCap, MapPinned, Droplet, Truck, Users, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { alianzas, loading: loadingAlianzas } = useAlianzaVerde();
  const { calles, loading: loadingCalles } = useCallesApadrinadas();
  const { recogidas, loading: loadingRecogidas } = useRecogidas();

  const [chartData, setChartData] = useState<any[]>([]);
  const [distritosData, setDistritosData] = useState<any[]>([]);
  const [tipoClienteData, setTipoClienteData] = useState<any[]>([]);
  
  useEffect(() => {
    // Procesamos los datos para las gráficas cuando estén disponibles
    if (!loadingPuntos && !loadingRecogidas) {
      // Datos para la gráfica de recogida por meses
      const monthlyData = processMonthlyLitros(recogidas);
      setChartData(monthlyData);

      // Datos para la gráfica de distribución por distritos
      const distritos = processPuntosPorDistrito(puntosVerdes);
      setDistritosData(distritos);
    }

    // Datos para la gráfica de tipos de clientes
    if (!loadingUsuarios) {
      const tiposData = processTiposClientes(usuarios);
      setTipoClienteData(tiposData);
    }
  }, [loadingPuntos, loadingRecogidas, loadingUsuarios, puntosVerdes, recogidas, usuarios]);

  // Función para procesar datos de recogida mensual
  const processMonthlyLitros = (recogidas: any[]) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    
    // Inicializar datos con valores 0 para cada mes
    const monthlyLitros = months.map((month, index) => ({
      name: month,
      litros: 0,
      recogidas: 0
    }));

    // Contabilizar litros por mes
    recogidas.forEach(recogida => {
      if (recogida.completada && recogida.fechaCompletada) {
        const fecha = recogida.fechaCompletada.toDate ? recogida.fechaCompletada.toDate() : new Date(recogida.fechaCompletada);
        if (fecha.getFullYear() === currentYear) {
          const month = fecha.getMonth();
          monthlyLitros[month].litros += recogida.litrosRecogidos || 0;
          monthlyLitros[month].recogidas += 1;
        }
      }
    });

    return monthlyLitros;
  };

  // Función para procesar datos de puntos verdes por distrito
  const processPuntosPorDistrito = (puntos: any[]) => {
    const distritos: Record<string, number> = {};
    
    puntos.forEach(punto => {
      if (punto.distrito) {
        distritos[punto.distrito] = (distritos[punto.distrito] || 0) + 1;
      }
    });

    return Object.entries(distritos).map(([distrito, cantidad]) => ({
      name: distrito,
      value: cantidad,
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  };

  // Función para procesar datos de tipos de clientes
  const processTiposClientes = (usuarios: any[]) => {
    const tipos: Record<string, number> = {};
    
    usuarios.forEach(usuario => {
      if (usuario.tipo) {
        const tipoSimplificado = simplificarTipoCliente(usuario.tipo);
        tipos[tipoSimplificado] = (tipos[tipoSimplificado] || 0) + 1;
      }
    });

    return Object.entries(tipos).map(([tipo, cantidad]) => ({
      name: tipo,
      value: cantidad,
    }));
  };

  const simplificarTipoCliente = (tipo: string) => {
    if (tipo.includes('Comunidad')) return 'Comunidades';
    if (tipo.includes('Bar') || tipo.includes('Rest')) return 'Hostelería';
    if (tipo.includes('Hotel')) return 'Hoteles';
    if (tipo.includes('Asoc')) return 'Asociaciones';
    if (tipo.includes('Centro') || tipo.includes('Escolar')) return 'Centros Educativos';
    return 'Particulares';
  };

  // Calcular los totales para las tarjetas
  const totalClientes = usuarios.filter(u => u.activo).length;
  const totalPuntosVerdes = puntosVerdes.length;
  const totalCentrosEscolares = alianzas.filter(a => a.activo).length;
  const totalCallesApadrinadas = calles.filter(c => c.activo).length;
  const litrosRecogidos = puntosVerdes.reduce((sum, punto) => sum + (punto.litrosRecogidos || 0), 0);
  
  // Cálculo del CO2 evitado: 1L aceite ~ 2kg CO2
  const co2Evitado = litrosRecogidos * 2;

  // Colores para las gráficas
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
  
  // Datos para la gráfica de distribución del tipo de recogida
  const tipoRecogidaData = [
    { name: 'Individual', value: recogidas.filter(r => r.tipo === 'individual').length },
    { name: 'Por zona', value: recogidas.filter(r => r.tipo === 'zona').length }
  ];

  const loading = loadingUsuarios || loadingPuntos || loadingAlianzas || loadingCalles || loadingRecogidas;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando datos del panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
      
      <Tabs defaultValue="vista-general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vista-general">Vista General</TabsTrigger>
          <TabsTrigger value="puntos-verdes">Puntos Verdes</TabsTrigger>
          <TabsTrigger value="alianza-escolar">Alianza Escolar</TabsTrigger>
          <TabsTrigger value="calles-apadrinadas">Calles Apadrinadas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vista-general" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-white to-blue-50 shadow-md border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-blue-800">
                  <Users className="h-6 w-6 text-blue-600" />
                  Clientes Activos
                </CardTitle>
                <CardDescription>Total de clientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-900">
                  {totalClientes}
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  {usuarios.filter(u => {
                    if (!u.createdAt) return false;
                    const date = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return date > oneMonthAgo;
                  }).length} nuevos clientes este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-green-50 shadow-md border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-green-800">
                  <Buildings className="h-6 w-6 text-green-600" />
                  Puntos Verdes
                </CardTitle>
                <CardDescription>Contenedores activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-900">
                  {totalPuntosVerdes}
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {puntosVerdes.filter(p => {
                    if (!p.createdAt) return false;
                    const date = p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return date > oneMonthAgo;
                  }).length} nuevos puntos este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-amber-50 shadow-md border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-amber-800">
                  <Droplet className="h-6 w-6 text-amber-600" />
                  Litros Recogidos
                </CardTitle>
                <CardDescription>Aceite usado procesado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-900">
                  {litrosRecogidos.toLocaleString()}L
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  +{recogidas
                    .filter(r => {
                      if (!r.fechaCompletada || !r.completada) return false;
                      const date = r.fechaCompletada.toDate ? r.fechaCompletada.toDate() : new Date(r.fechaCompletada);
                      const oneMonthAgo = new Date();
                      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                      return date > oneMonthAgo;
                    })
                    .reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0)}L este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-teal-50 shadow-md border-teal-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-teal-800">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                  CO2 Evitado
                </CardTitle>
                <CardDescription>Impacto medioambiental</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-teal-900">
                  {co2Evitado.toLocaleString()}kg
                </div>
                <p className="text-xs text-teal-700 mt-1">
                  Equivalente a {Math.round(co2Evitado / 21)} árboles plantados
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-purple-50 shadow-md border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-purple-800">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  Alianza Verde Escolar
                </CardTitle>
                <CardDescription>Centros participantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-900">
                  {totalCentrosEscolares}
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  {alianzas.filter(a => {
                    if (!a.createdAt) return false;
                    const date = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return date > oneMonthAgo;
                  }).length} nuevos este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-rose-50 shadow-md border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-rose-800">
                  <MapPinned className="h-6 w-6 text-rose-600" />
                  Calles Apadrinadas
                </CardTitle>
                <CardDescription>Calles con padrinos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-rose-900">
                  {totalCallesApadrinadas}
                </div>
                <p className="text-xs text-rose-700 mt-1">
                  {calles.filter(c => {
                    if (!c.createdAt) return false;
                    const date = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return date > oneMonthAgo;
                  }).length} nuevas este mes
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-blue-100">
              <CardHeader>
                <CardTitle>Estadísticas de Recogida</CardTitle>
                <CardDescription>Litros de aceite recogidos durante los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData.slice(-6)}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}L`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', background: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
                      formatter={(value) => [`${value} litros`, 'Recogidos']} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="litros" 
                      name="Litros recogidos" 
                      stroke="#EE970D" 
                      fill="url(#colorUv)" 
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EE970D" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EE970D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-green-100">
              <CardHeader>
                <CardTitle>Distribución de Clientes</CardTitle>
                <CardDescription>Tipos de clientes registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full w-full flex items-center justify-center">
                  {tipoClienteData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tipoClienteData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {tipoClienteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} clientes`, '']} />
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center">No hay datos suficientes para mostrar</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="shadow-lg border-purple-100 col-span-1 xl:col-span-2">
              <CardHeader>
                <CardTitle>Distribución por Distritos</CardTitle>
                <CardDescription>Puntos verdes por distrito</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distritosData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 80,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value} puntos`, 'Cantidad']} />
                    <Bar dataKey="value" fill="#8B5CF6">
                      {distritosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS[index % COLORS.length]}90`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-amber-100">
              <CardHeader>
                <CardTitle>Tipo de Recogidas</CardTitle>
                <CardDescription>Distribución por tipo de recogida</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tipoRecogidaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell key="cell-1" fill="#10B981" />
                        <Cell key="cell-2" fill="#F59E0B" />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} recogidas`, '']} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="puntos-verdes">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de Puntos Verdes cargando...
          </p>
          {/* Here we would include the Puntos Verdes management component */}
        </TabsContent>
        
        <TabsContent value="alianza-escolar">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de la Alianza Verde Escolar cargando...
          </p>
          {/* Here we would include the Alianza Verde Escolar management component */}
        </TabsContent>
        
        <TabsContent value="calles-apadrinadas">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de Calles Apadrinadas cargando...
          </p>
          {/* Here we would include the Calles Apadrinadas management component */}
        </TabsContent>
        
        <TabsContent value="estadisticas">
          <p className="text-center text-muted-foreground py-8">
            Sección de reportes y estadísticas cargando...
          </p>
          {/* Here we would include the statistics and reports component */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
