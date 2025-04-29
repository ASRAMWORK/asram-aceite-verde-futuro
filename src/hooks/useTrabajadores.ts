import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Trabajador } from '@/types';
import { toast } from 'sonner';

export function useTrabajadores() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrabajadoresData = async () => {
    try {
      setLoading(true);
      const trabajadoresRef = collection(db, "trabajadores");
      // Change from apellido to apellidos in the orderBy
      const trabajadoresSnap = await getDocs(query(trabajadoresRef, orderBy("apellidos")));
      
      const trabajadoresData: Trabajador[] = [];
      trabajadoresSnap.forEach((doc) => {
        const data = doc.data();
        trabajadoresData.push({
          id: doc.id,
          nombre: data.nombre || '',
          // Handle both apellido and apellidos for backward compatibility
          apellidos: data.apellidos || data.apellido || '',
          apellido: data.apellido || data.apellidos || '',
          dni: data.dni || '',
          fechaNacimiento: data.fechaNacimiento,
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          foto: data.foto,
          fechaAlta: data.fechaAlta,
          tipoContrato: data.tipoContrato,
          tipoJornada: data.tipoJornada,
          roles: data.roles || [],
          vehiculoAsignado: data.vehiculoAsignado,
          rutasAsignadas: data.rutasAsignadas || [],
          activo: data.activo ?? true,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          departamento: data.departamento || '',
          fechaContratacion: data.fechaContratacion,
          cargo: data.cargo || '',
          ciudad: data.ciudad || '',
          provincia: data.provincia || '',
          codigoPostal: data.codigoPostal || '',
          pais: data.pais || ''
        });
      });
      
      setTrabajadores(trabajadoresData);
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
      setError("Error al cargar datos de trabajadores");
    } finally {
      setLoading(false);
    }
  };

  const getTrabajadoresPorRol = (rol: any) => {
    return trabajadores.filter(t => t.roles.includes(rol));
  };

  const getTrabajadoresActivos = () => {
    return trabajadores.filter(t => t.activo);
  };

  const addTrabajador = async (data: Omit<Trabajador, "id">) => {
    try {
      const trabajadorData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "trabajadores"), trabajadorData);
      toast.success("Trabajador añadido correctamente");
      await loadTrabajadoresData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo trabajador:", err);
      toast.error("Error al añadir el trabajador");
      throw err;
    }
  };

  const updateTrabajador = async (id: string, data: Partial<Trabajador>) => {
    try {
      await updateDoc(doc(db, "trabajadores", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Trabajador actualizado correctamente");
      await loadTrabajadoresData();
      return true;
    } catch (err) {
      console.error("Error actualizando trabajador:", err);
      toast.error("Error al actualizar el trabajador");
      return false;
    }
  };

  const deleteTrabajador = async (id: string) => {
    try {
      // Soft delete approach
      await updateDoc(doc(db, "trabajadores", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Trabajador desactivado correctamente");
      await loadTrabajadoresData();
      return true;
    } catch (err) {
      console.error("Error eliminando trabajador:", err);
      toast.error("Error al desactivar el trabajador");
      return false;
    }
  };

  useEffect(() => {
    loadTrabajadoresData();
  }, []);

  return { 
    trabajadores, 
    loading, 
    error, 
    loadTrabajadoresData,
    getTrabajadoresPorRol,
    getTrabajadoresActivos,
    addTrabajador,
    updateTrabajador,
    deleteTrabajador
  };
}
