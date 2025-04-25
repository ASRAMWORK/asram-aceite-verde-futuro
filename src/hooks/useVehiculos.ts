
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, where, serverTimestamp } from 'firebase/firestore';
import type { Vehiculo } from '@/types';
import { toast } from 'sonner';

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehiculosData = async () => {
    try {
      setLoading(true);
      const vehiculosRef = collection(db, "vehiculos");
      const vehiculosSnap = await getDocs(query(vehiculosRef, orderBy("matricula")));
      
      const vehiculosData: Vehiculo[] = [];
      vehiculosSnap.forEach((doc) => {
        const data = doc.data();
        vehiculosData.push({
          id: doc.id,
          matricula: data.matricula || '',
          modelo: data.modelo || '',
          tipo: data.tipo || '',
          capacidad: data.capacidad || 0,
          estado: data.estado || 'disponible',
          ultimoMantenimiento: data.ultimoMantenimiento,
          conductorAsignado: data.conductorAsignado,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setVehiculos(vehiculosData);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
      setError("Error al cargar datos de vehículos");
    } finally {
      setLoading(false);
    }
  };
  
  const getVehiculosDisponibles = () => {
    return vehiculos.filter(v => v.estado === 'disponible');
  };

  const addVehiculo = async (data: Omit<Vehiculo, "id">) => {
    try {
      const vehiculoData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "vehiculos"), vehiculoData);
      toast.success("Vehículo añadido correctamente");
      await loadVehiculosData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo vehículo:", err);
      toast.error("Error al añadir el vehículo");
      throw err;
    }
  };

  const updateVehiculo = async (id: string, data: Partial<Vehiculo>) => {
    try {
      await updateDoc(doc(db, "vehiculos", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Vehículo actualizado correctamente");
      await loadVehiculosData();
      return true;
    } catch (err) {
      console.error("Error actualizando vehículo:", err);
      toast.error("Error al actualizar el vehículo");
      return false;
    }
  };

  const asignarConductor = async (vehiculoId: string, conductorId: string) => {
    try {
      await updateDoc(doc(db, "vehiculos", vehiculoId), {
        conductorAsignado: conductorId,
        updatedAt: serverTimestamp()
      });
      toast.success("Conductor asignado correctamente");
      await loadVehiculosData();
      return true;
    } catch (err) {
      console.error("Error asignando conductor:", err);
      toast.error("Error al asignar conductor");
      return false;
    }
  };

  useEffect(() => {
    loadVehiculosData();
  }, []);

  return { 
    vehiculos, 
    loading, 
    error, 
    loadVehiculosData,
    getVehiculosDisponibles,
    addVehiculo,
    updateVehiculo,
    asignarConductor
  };
}
