import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useVoluntarios } from "@/hooks/useVoluntarios";
import { useTrabajadores } from "@/hooks/useTrabajadores";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { useFacturacion } from "@/hooks/useFacturacion";
import { Building, Briefcase, Users, Home, CalendarDays, User, FileText, Bell, AlertCircle, Droplet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRecogidas } from "@/hooks/useRecogidas";

const AdminDashboard = () => {
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { voluntarios, loading: loadingVoluntarios } = useVoluntarios();
  const { trabajadores, loading: loadingTrabajadores } = useTrabajadores();
  const { instalaciones, loading: loadingInstalaciones } = useInstalaciones();
  const { ingresos, gastos, loading: loadingFacturacion } = useFacturacion();
  const { recogidas } = useRecogidas();

  // Calculate statistics - now counts all registered users plus active community clients
  const clientesActivos = usuarios.filter(u => u.activo).length;
  const clientesComunidad = usuarios.filter(u => u.activo && u.tipo === 'comunidad').length;
  const totalUsuariosRegistrados = usuarios.length;
  const totalVoluntarios = voluntarios.length;
  const totalTrabajadores = trabajadores.length;
  
  // Total viviendas and containers using instalaciones data
  const totalViviendas = instalaciones.reduce((acc, inst) => acc + (inst.numViviendas || 0), 0);
  const totalContenedores = instalaciones.reduce((acc, inst) => acc + (inst.numContenedores || 0), 0);
  
  // Calculate total litros recogidos from all puntos verdes
  const totalLitrosRecogidos = React.useMemo(() => {
    const litrosFromRecogidas = recogidas.reduce((acc, recogida) => 
      acc + (recogida.litrosRecogidos || 0), 0);
      
    const litrosFromUsuarios = usuarios.reduce((acc, usuario) => 
      acc + (usuario.litrosAportados || 0), 0);
      
    return litrosFromRecogidas + litrosFromUsuarios;
  }, [recogidas, usuarios]);
  
  // Notifications system
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo cliente registrado', content: 'Comunidad de propietarios Alcorcón', time: '10:32', read: false },
    { id: 2, title: 'Recogida completada', content: 'Ruta Centro - 54 litros', time: '09:15', read: false },
    { id: 3, title: 'Factura pendiente', content: 'Comunidad Alameda - 325€', time: 'Ayer', read: true },
    { id: 4, title: 'Nuevo voluntario', content: 'Ana Martínez se ha registrado', time: 'Ayer', read: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    toast.success("Todas las notificaciones marcadas como leídas");
  };
  
  // Calculate facturacion data from real data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const ingresosDelMes = ingresos
    .filter(i => {
      const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + (i.cantidad || 0), 0);
    
  const gastosDelMes = gastos
    .filter(g => {
      const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, g) => sum + (g.cantidad || 0), 0);
  
  // Estimate annual projection based on current data
  const monthsWithData = new Set([
    ...ingresos.map(i => {
      const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
      return `${fecha.getFullYear()}-${fecha.getMonth()}`;
    }),
    ...gastos.map(g => {
      const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
      return `${fecha.getFullYear()}-${fecha.getMonth()}`;
    })
  ]).size;
  
  const avgMonthlyIncome = monthsWithData > 0 
    ? ingresos.reduce((sum, i) => sum + (i.cantidad || 0), 0) / monthsWithData
    : 0;
  
  const previsionAnual = Math.round(avgMonthlyIncome * 12);
  
  // Calculate pending payments (simplified approach)
  const pendienteCobro = ingresos
    .filter(i => i.concepto?.toLowerCase().includes('pendiente') || i.notas?.toLowerCase().includes('pendiente'))
    .reduce((sum, i) => sum + (i.cantidad || 0), 0);
  
  // Prepare chart data for litros recogidos por distrito with improved styling
  const distritoData: Record<string, number> = {};
  puntosVerdes.forEach(punto => {
    if (!distritoData[punto.distrito]) {
      distritoData[punto.distrito] = 0;
    }
    distritoData[punto.distrito] += punto.litrosRecogidos || 0;
  });

  const litrosChartData = {
    labels: Object.keys(distritoData),
    datasets: [
      {
        label: 'Litros recogidos',
        data: Object.values(distritoData) as number[],
        backgroundColor: [
          'rgba(34, 211, 238, 0.7)', // cyan
          'rgba(168, 85, 247, 0.7)', // purple
          'rgba(16, 185, 129, 0.7)', // emerald
          'rgba(251, 146, 60, 0.7)', // orange
          'rgba(239, 68, 68, 0.7)', // red
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(249, 115, 22, 0.7)', // amber
          'rgba(139, 92, 246, 0.7)', // indigo
        ],
        borderWidth: 0,
        borderRadius: 8,
        hoverOffset: 5,
      },
    ],
  };
  
  // Prepare data for users by type with improved styling
  const usersByType: Record<string, number> = usuarios.reduce((acc, user) => {
    const type = user.tipo || 'otros';
    if (!acc[type]) acc[type] = 0;
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);
  
  const usersChartData = {
    labels: Object.keys(usersByType),
    datasets: [
      {
        label: 'Usuarios por tipo',
        data: Object.values(usersByType) as number[],
        backgroundColor: [
          'rgba(34, 211, 238, 0.7)', // cyan
          'rgba(168, 85, 247, 0.7)', // purple
          'rgba(16, 185, 129, 0.7)', // emerald
          'rgba(251, 146, 60, 0.7)', // orange
          'rgba(239, 68, 68, 0.7)', // red
          'rgba(59, 130, 246, 0.7)', // blue
        ],
        borderWidth: 0,
        borderRadius: 6,
        hoverOffset: 5,
      },
    ],
  };
  
  // Financial data over time
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();
  
  const monthLabels = last6Months.map(d => {
    const options = { month: 'short' } as Intl.DateTimeFormatOptions;
    return d.toLocaleDateString('es-ES', options);
  });
  
  const financialData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Ingresos',
        data: last6Months.map(date => {
          return ingresos
            .filter(i => {
              const ingDate = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
              return ingDate.getMonth() === date.getMonth() && 
                     ingDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, i) => sum + (i.cantidad || 0), 0);
        }),
        borderColor: 'rgba(16, 185, 129, 1)', // emerald
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Gastos',
        data: last6Months.map(date => {
          return gastos
            .filter(g => {
              const gastDate = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
              return gastDate.getMonth() === date.getMonth() && 
                     gastDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, g) => sum + (g.cantidad || 0), 0);
        }),
        borderColor: 'rgba(239, 68, 68, 1)', // red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const isLoading = loadingPuntos || loadingUsuarios || loadingVoluntarios || 
                   loadingTrabajadores || loadingInstalaciones || loadingFacturacion;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
          <p className="text-muted-foreground">
            Vista general del sistema ASRAM
          </p>
        </div>
        
        {/* Notifications bell */}
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-2 border-b">
                <h4 className="font-medium text-sm">Notificaciones</h4>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Marcar todo como leído
                </Button>
              </div>
              <ScrollArea className="h-80">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-3 flex items-start gap-2 ${!notification.read ? 'bg-muted/50' : ''}`}
                      >
                        <div className={`mt-1 p-1 rounded-full ${!notification.read ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No tienes notificaciones
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <Button variant="default" className="bg-asram hover:bg-asram-700">
            Actualizar datos
          </Button>
        </div>
      </div>

      {/* Cards de estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-asram hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Building className="h-5 w-5 text-asram" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : clientesActivos}
            </div>
            <p className="text-xs text-muted-foreground">
              Total usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Verdes</CardTitle>
            <Home className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalContenedores}
            </div>
            <p className="text-xs text-muted-foreground">
              Total contenedores instalados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipo ASRAM</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${totalTrabajadores} / ${totalVoluntarios}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Trabajadores / Voluntarios
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litros Recogidos</CardTitle>
            <Droplet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${totalLitrosRecogidos}L`}
            </div>
            <p className="text-xs text-muted-foreground">
              Total litros de aceite recogidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de facturación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
            <FileText className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? "..." : `${ingresosDelMes.toLocaleString()}€`}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mes</CardTitle>
            <FileText className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {isLoading ? "..." : `${gastosDelMes.toLocaleString()}€`}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsión Anual</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? "..." : `${previsionAnual.toLocaleString()}€`}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-amber-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente Cobro</CardTitle>
            <FileText className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {isLoading ? "..." : `${pendienteCobro.toLocaleString()}€`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con gráficas mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Evolución Financiera</CardTitle>
            <CardDescription>
              Ingresos y gastos de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={financialData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0,0,0,0.05)",
                    },
                    ticks: {
                      callback: (value) => `${value}€`,
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: "top",
                    align: "end"
                  },
                  tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    padding: 12,
                    usePointStyle: true,
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}€`;
                      }
                    }
                  }
                },
              }}
              className="h-80"
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="recogidas" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recogidas">Recogidas por Distrito</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios por Tipo</TabsTrigger>
          </TabsList>
          
          <Card className="flex-grow hover:shadow-lg transition-shadow">
            <TabsContent value="recogidas" className="m-0 h-full">
              <CardHeader>
                <CardTitle>Aceite Recogido por Distrito</CardTitle>
                <CardDescription>
                  Distribución de litros recogidos por cada distrito
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Chart
                  type="bar"
                  data={litrosChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            return `${context.raw} litros`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                        ticks: {
                          callback: (value) => `${value}L`,
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                  }}
                  className="h-80"
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="usuarios" className="m-0 h-full">
              <CardHeader>
                <CardTitle>Distribución de Usuarios</CardTitle>
                <CardDescription>
                  Tipos de usuarios registrados en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Chart
                  type="doughnut"
                  data={usersChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 15,
                          padding: 15
                        }
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            const percentage = Math.round((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '60%',
                    animation: {
                      animateScale: true,
                      animateRotate: true
                    }
                  }}
                  className="h-80"
                />
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
