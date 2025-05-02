
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RecogidaForm from "../RecogidaForm";
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
import { toast } from 'sonner';

interface RecogidaClienteButtonProps {
  cliente: Usuario;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const RecogidaClienteButton: React.FC<RecogidaClienteButtonProps> = ({
  cliente,
  variant = "default",
  size = "default"
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addRecogida } = useRecogidas();

  const handleAddRecogida = async (formData: any) => {
    try {
      // Pre-fill data from cliente
      const recogidaData = {
        ...formData,
        clienteId: cliente.id,
        cliente: cliente.nombre,
        direccionRecogida: formData.direccion || cliente.direccion,
        nombreContacto: cliente.nombre,
        telefonoContacto: cliente.telefono,
        emailContacto: cliente.email,
        direccion: formData.direccion || cliente.direccion,
        distrito: formData.distrito || cliente.distrito,
        barrio: formData.barrio || cliente.barrio
      };
      
      await addRecogida(recogidaData);
      setIsDialogOpen(false);
      toast.success(`Recogida programada para ${cliente.nombre}`);
    } catch (error) {
      console.error("Error al programar recogida:", error);
      toast.error("Error al programar la recogida");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        onClick={() => setIsDialogOpen(true)}
      >
        {size === "icon" ? <Droplet className="h-4 w-4" /> : (
          <>
            <Droplet className="mr-2 h-4 w-4" />
            Programar Recogida
          </>
        )}
      </Button>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programar Recogida</DialogTitle>
          <DialogDescription>
            Programa una recogida para {cliente.nombre}
          </DialogDescription>
        </DialogHeader>
        
        <RecogidaForm 
          onCancel={() => setIsDialogOpen(false)}
          onSubmit={handleAddRecogida}
          initialData={{
            direccion: cliente.direccion,
            distrito: cliente.distrito,
            barrio: cliente.barrio,
            nombreContacto: cliente.nombre,
            telefonoContacto: cliente.telefono,
            emailContacto: cliente.email,
            clienteId: cliente.id,
            fechaRecogida: new Date()
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecogidaClienteButton;

Recogidachart:
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RecogidasChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const RecogidasChart: React.FC<RecogidasChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter',
            weight: 500 // Changed from string to number
          },
          color: '#64748b',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        bodyFont: {
          family: 'Inter'
        },
        borderColor: 'rgba(220, 220, 220, 1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}L`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
          },
          color: '#64748b',
          padding: 8,
        },
        border: {
          dash: [4, 4],
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
          },
          color: '#64748b',
        },
        border: {
          display: false,
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const // Fixed: using "as const" to specify this is a valid easing value
    },
    elements: {
      bar: {
        borderRadius: 6,
      }
    }
  };

  return (
    <div className="h-[400px] w-full p-4 bg-white rounded-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RecogidasChart;
