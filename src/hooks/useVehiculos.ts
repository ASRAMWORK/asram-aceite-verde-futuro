import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehiculo } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVehiculosData();
  }, []);

  const loadVehiculosData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('vehiculos');
      if (storedData) {
        setVehiculos(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading vehiculos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVehiculo = async (data: Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVehiculo: Vehiculo = {
      id: uuidv4(),
      matricula: data.matricula,
      modelo: data.modelo,
      tipo: data.tipo,
      estado: data.estado,
      capacidad: data.capacidad,
      ultimaRevision: data.ultimaRevision,
      proximaRevision: data.proximaRevision,
      kilometraje: data.kilometraje,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setVehiculos(prev => [...prev, newVehiculo]);
    localStorage.setItem('vehiculos', JSON.stringify([...vehiculos, newVehiculo]));
    
    toast({
      title: "Vehículo añadido",
      description: "El vehículo ha sido añadido correctamente."
    });
    return newVehiculo;
  };

  const updateVehiculo = async (id: string, data: Partial<Vehiculo>): Promise<void> => {
    try {
      const updatedVehiculos = vehiculos.map(vehiculo =>
        vehiculo.id === id ? { ...vehiculo, ...data } : vehiculo
      );
      setVehiculos(updatedVehiculos);
      localStorage.setItem('vehiculos', JSON.stringify(updatedVehiculos));
      toast({
        title: "Vehículo actualizado",
        description: "El vehículo ha sido actualizado correctamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el vehículo."
      });
    }
  };

  const deleteVehiculo = async (id: string): Promise<void> => {
    try {
      const updatedVehiculos = vehiculos.filter(vehiculo => vehiculo.id !== id);
      setVehiculos(updatedVehiculos);
      localStorage.setItem('vehiculos', JSON.stringify(updatedVehiculos));
      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado correctamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el vehículo."
      });
    }
  };

  return {
    vehiculos,
    loading,
    loadVehiculosData,
    addVehiculo,
    updateVehiculo,
    deleteVehiculo
  };
};
