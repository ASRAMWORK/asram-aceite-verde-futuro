import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig } from "@/types";
import { toast } from "sonner";

const SimuladorImpacto = () => {
  const [aceiteRecogido, setAceiteRecogido] = useState(0);
  const [factorConversion, setFactorConversion] = useState(1.5); // Litros de aceite a kg de CO2
  const [emisionesEvitadas, setEmisionesEvitadas] = useState(0);
  const [countYear, setCountYear] = useState([
    { name: "Enero", count: 2400 },
    { name: "Febrero", count: 1398 },
    { name: "Marzo", count: 9800 },
    { name: "Abril", count: 3908 },
    { name: "Mayo", count: 4800 },
    { name: "Junio", count: 3800 },
    { name: "Julio", count: 4300 },
    { name: "Agosto", count: 2400 },
    { name: "Septiembre", count: 1398 },
    { name: "Octubre", count: 9800 },
    { name: "Noviembre", count: 3908 },
    { name: "Diciembre", count: 4800 },
  ]);
  const [impactYear, setImpactYear] = useState([
    { name: "Enero", co2: 2400 },
    { name: "Febrero", co2: 1398 },
    { name: "Marzo", co2: 9800 },
    { name: "Abril", co2: 3908 },
    { name: "Mayo", co2: 4800 },
    { name: "Junio", co2: 3800 },
    { name: "Julio", co2: 4300 },
    { name: "Agosto", co2: 2400 },
    { name: "Septiembre", co2: 1398 },
    { name: "Octubre", co2: 9800 },
    { name: "Noviembre", co2: 3908 },
    { name: "Diciembre", co2: 4800 },
  ]);

  useEffect(() => {
    calcularImpacto();
  }, [aceiteRecogido, factorConversion]);

  const calcularImpacto = () => {
    const impacto = aceiteRecogido * factorConversion;
    setEmisionesEvitadas(impacto);
  };

  const handleAceiteChange = (e: any) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAceiteRecogido(value);
    }
  };

  const handleFactorChange = (e: any) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFactorConversion(value);
    }
  };

  const handleSimularImpacto = () => {
    toast.success("¡Simulación de impacto realizada con éxito!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simulador de Impacto Ambiental</CardTitle>
        <CardDescription>
          Calcula el impacto positivo de la recogida de aceite usado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="aceiteRecogido">Aceite Recogido (litros)</Label>
            <Input
              id="aceiteRecogido"
              type="number"
              placeholder="Litros de aceite recogido"
              value={aceiteRecogido}
              onChange={handleAceiteChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="factorConversion">
              Factor de Conversión (kg CO2/litro)
            </Label>
            <Input
              id="factorConversion"
              type="number"
              placeholder="Factor de conversión"
              value={factorConversion}
              onChange={handleFactorChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Emisiones de CO2 evitadas (kg)</Label>
            <div className="p-4 border rounded-md bg-gray-100">
              {emisionesEvitadas.toFixed(2)} kg
            </div>
          </div>
          <Button onClick={handleSimularImpacto}>Simular Impacto</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="w-full h-full">
              <ResponsiveContainer>
                <BarChart data={countYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="w-full h-full">
              <ResponsiveContainer>
                <BarChart data={impactYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="co2" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimuladorImpacto;
