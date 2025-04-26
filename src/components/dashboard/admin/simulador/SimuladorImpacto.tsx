
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chart } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, ThermometerSun, Trees, WavesSine, Waves, Wind, Cloud, Droplets } from "lucide-react";

const SimuladorImpacto = () => {
  const [litros, setLitros] = useState<number>(100);
  const [activeTab, setActiveTab] = useState("grafica");
  const [showExtraGraphs, setShowExtraGraphs] = useState(false);

  // Factores de conversión para beneficios medioambientales
  const factores = {
    co2: 2.61, // kg CO2 no emitido por litro
    agua: 1000, // litros de agua no contaminada por litro
    energia: 1.19, // kWh ahorrados por litro
  };
  
  const generarResultados = () => {
    // Cálculos básicos
    const co2 = litros * factores.co2;
    const agua = litros * factores.agua;
    const energia = litros * factores.energia;
    
    // Equivalencias prácticas
    const kmCoche = co2 * 7.14; // km en coche particular
    const duchas = agua / 80; // duchas de 80L cada una
    const bombillas = energia / 0.01; // bombilla LED de 10W durante 1 hora
    
    return { co2, agua, energia, kmCoche, duchas, bombillas };
  };
  
  const resultados = generarResultados();
  
  // Data para gráficos
  const proyeccionAnual = {
    labels: ['Actual', '3 meses', '6 meses', '1 año'],
    datasets: [
      {
        label: 'CO₂ no emitido (kg)',
        data: [
          resultados.co2, 
          resultados.co2 * 3, 
          resultados.co2 * 6, 
          resultados.co2 * 12
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 6,
      },
    ],
  };
  
  const distribucionResultados = {
    labels: ['CO₂ evitado', 'Agua no contaminada', 'Energía ahorrada'],
    datasets: [
      {
        data: [
          resultados.co2, 
          resultados.agua / 100, // Escalado para visualización
          resultados.energia * 10 // Escalado para visualización
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // verde
          'rgba(59, 130, 246, 0.7)', // azul
          'rgba(249, 115, 22, 0.7)', // naranja
        ],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };
  
  const impactoComparativo = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'CO₂ (kg)',
        data: [resultados.co2 * 0.7, resultados.co2 * 0.8, resultados.co2 * 0.9, resultados.co2, resultados.co2 * 1.1, resultados.co2 * 1.2],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Agua (L)',
        data: [resultados.agua * 0.7, resultados.agua * 0.8, resultados.agua * 0.9, resultados.agua, resultados.agua * 1.1, resultados.agua * 1.2],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const distribucionPorDistrito = {
    labels: ['Centro', 'Salamanca', 'Retiro', 'Chamberí', 'Chamartín', 'Tetuán'],
    datasets: [
      {
        label: 'Litros recogidos',
        data: [120, 95, 80, 70, 60, 50],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(234, 179, 8, 0.7)',
        ],
        borderWidth: 0,
        borderRadius: 6,
        hoverOffset: 15,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Simulador de Impacto</h2>
          <p className="text-muted-foreground">
            Calcula el impacto ambiental positivo del reciclaje de aceite
          </p>
        </div>
        <div>
          <Button 
            variant={showExtraGraphs ? "secondary" : "outline"}
            onClick={() => setShowExtraGraphs(!showExtraGraphs)}
          >
            {showExtraGraphs ? "Ocultar gráficas adicionales" : "Ver gráficas adicionales"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Calcula el impacto ambiental</CardTitle>
            <CardDescription>
              Introduce la cantidad de litros de aceite recogidos para calcular el impacto
              medioambiental positivo generado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="litros">Cantidad de aceite reciclado (litros)</Label>
                <Input
                  id="litros"
                  type="number"
                  min={1}
                  value={litros}
                  onChange={(e) => setLitros(Number(e.target.value) || 0)}
                  className="text-lg"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-6 h-auto"
                onClick={() => generarResultados()}
              >
                Calcular impacto
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-green-800">
                CO₂ no emitido
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Cloud className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{resultados.co2.toFixed(2)} kg</div>
            <p className="text-sm text-green-800/70 mt-1">
              Equivale a {Math.round(resultados.kmCoche)} km en coche
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-blue-800">
                Agua no contaminada
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{(resultados.agua / 1000).toFixed(2)} m³</div>
            <p className="text-sm text-blue-800/70 mt-1">
              Equivale a {Math.round(resultados.duchas)} duchas
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-amber-800">
                Energía ahorrada
              </CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <ThermometerSun className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{resultados.energia.toFixed(2)} kWh</div>
            <p className="text-sm text-amber-800/70 mt-1">
              Equivale a {Math.round(resultados.bombillas)} horas de bombilla LED
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="grafica" value={activeTab} onValueChange={setActiveTab} className="md:col-span-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grafica">Proyección Anual</TabsTrigger>
            <TabsTrigger value="distribucion">Distribución de Impacto</TabsTrigger>
            <TabsTrigger value="equivalencias">Equivalencias Prácticas</TabsTrigger>
          </TabsList>
          <TabsContent value="grafica">
            <Card>
              <CardHeader>
                <CardTitle>Proyección anual del impacto</CardTitle>
                <CardDescription>
                  Evolución del CO₂ no emitido en diferentes intervalos de tiempo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pt-4">
                <Chart
                  type="bar"
                  data={proyeccionAnual}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                        ticks: {
                          callback: (value) => `${value} kg`,
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
                        display: false
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            return `${context.raw} kg de CO₂`;
                          }
                        }
                      }
                    },
                    animation: {
                      animateScale: true
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="distribucion">
            <Card>
              <CardHeader>
                <CardTitle>Distribución del impacto medioambiental</CardTitle>
                <CardDescription>
                  Comparativa visual del impacto en diferentes áreas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pt-4">
                <Chart
                  type="doughnut"
                  data={distribucionResultados}
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
                            const index = context.dataIndex;
                            const value = context.raw;
                            switch(index) {
                              case 0: return `CO₂: ${resultados.co2.toFixed(2)} kg`;
                              case 1: return `Agua: ${(resultados.agua).toFixed(2)} L`;
                              case 2: return `Energía: ${resultados.energia.toFixed(2)} kWh`;
                              default: return '';
                            }
                          }
                        }
                      }
                    },
                    cutout: '65%',
                    rotation: -90,
                    circumference: 360,
                    animation: {
                      animateScale: true,
                      animateRotate: true
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="equivalencias">
            <Card>
              <CardHeader>
                <CardTitle>Equivalencias prácticas</CardTitle>
                <CardDescription>
                  Medidas tangibles del impacto generado
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-green-50/50 border border-green-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium">Ahorro en CO₂</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full">
                          <Cloud className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{Math.round(resultados.kmCoche)} km</p>
                        <p className="text-sm text-green-800/70">Conducción en coche</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{(resultados.co2 / 10).toFixed(1)} árboles</p>
                        <p className="text-sm text-green-800/70">Trabajo mensual de absorción</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{(resultados.co2 * 0.1).toFixed(1)} vuelos</p>
                        <p className="text-sm text-green-800/70">Vuelos Madrid-Barcelona</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50/50 border border-blue-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium">Ahorro en Agua</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Droplets className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(resultados.duchas)} duchas</p>
                        <p className="text-sm text-blue-800/70">Duchas de 80L</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-blue-600">{Math.round(resultados.agua / 5)} lavados</p>
                        <p className="text-sm text-blue-800/70">Lavadoras domésticas</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-blue-600">{(resultados.agua / 3000).toFixed(2)} piscinas</p>
                        <p className="text-sm text-blue-800/70">Piscinas particulares</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50/50 border border-amber-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium">Ahorro en Energía</CardTitle>
                        <div className="p-2 bg-amber-100 rounded-full">
                          <ThermometerSun className="h-5 w-5 text-amber-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{Math.round(resultados.bombillas)} horas</p>
                        <p className="text-sm text-amber-800/70">Bombilla LED encendida</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-600">{(resultados.energia / 0.8).toFixed(1)} horas</p>
                        <p className="text-sm text-amber-800/70">Uso de ordenador</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-600">{(resultados.energia / 2.5).toFixed(1)} horas</p>
                        <p className="text-sm text-amber-800/70">Uso de aire acondicionado</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {showExtraGraphs && (
          <>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Evolución del impacto medioambiental</CardTitle>
                <CardDescription>
                  Tendencia comparativa de los diferentes beneficios a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pt-4">
                <Chart
                  type="line"
                  data={impactoComparativo}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                        ticks: {
                          callback: (value) => `${value} kg`,
                          color: 'rgba(16, 185, 129, 1)',
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          callback: (value) => `${value} L`,
                          color: 'rgba(59, 130, 246, 1)',
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        usePointStyle: true,
                      }
                    },
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Distribución por distrito</CardTitle>
                <CardDescription>
                  Cantidad de aceite recogido por distrito (datos simulados)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pt-4">
                <Chart
                  type="pie"
                  data={distribucionPorDistrito}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 15,
                          padding: 15,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            const percentage = Math.round((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                            return `${context.label}: ${context.raw} L (${percentage}%)`;
                          }
                        }
                      }
                    },
                    animation: {
                      animateScale: true,
                      animateRotate: true
                    }
                  }}
                />
              </CardContent>
            </Card>
          </>
        )}
        
      </div>
    </div>
  );
};

export default SimuladorImpacto;
