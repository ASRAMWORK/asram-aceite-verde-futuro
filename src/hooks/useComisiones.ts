
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Comision } from '@/types/comercial';

export const useComisiones = () => {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Use user instead of currentUser to match AuthContext

  const fetchComisiones = async (comercialId?: string) => {
    try {
      setLoading(true);
      const comisionesRef = collection(db, 'comisiones');
      let comisionesQuery;
      
      if (comercialId) {
        // Si se proporciona un ID específico, filtrar por ese comercial
        comisionesQuery = query(comisionesRef, where('comercialId', '==', comercialId));
      } else if (user) {
        // Si no se proporciona ID pero hay un usuario autenticado, filtrar por ese usuario
        comisionesQuery = query(comisionesRef, where('comercialId', '==', user.uid));
      } else {
        // Si no hay filtro ni usuario, obtener todos (solo para admin)
        comisionesQuery = comisionesRef;
      }
      
      const querySnapshot = await getDocs(comisionesQuery);
      const comisionesList: Comision[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Comision;
        comisionesList.push({
          id: doc.id,
          comercialId: data.comercialId,
          clienteId: data.clienteId,
          nombreCliente: data.nombreCliente,
          litrosRecogidos: data.litrosRecogidos,
          importe: data.importe,
          estado: data.estado,
          fecha: data.fecha instanceof Date ? 
            data.fecha : 
            new Date(data.fecha),
        });
      });
      
      setComisiones(comisionesList);
    } catch (error) {
      console.error('Error al obtener comisiones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComisiones();
  }, [user?.uid]);

  const addComision = async (comision: Omit<Comision, 'id'>) => {
    try {
      const comisionRef = await addDoc(collection(db, 'comisiones'), {
        ...comision,
        fecha: new Date(),
      });
      
      const newComision: Comision = {
        id: comisionRef.id,
        ...comision,
        fecha: new Date(),
      };
      
      setComisiones((prevComisiones) => [...prevComisiones, newComision]);
      return newComision;
    } catch (error) {
      console.error('Error al añadir comisión:', error);
      throw error;
    }
  };

  const updateComision = async (id: string, data: Partial<Comision>) => {
    try {
      await updateDoc(doc(db, 'comisiones', id), data);
      
      setComisiones((prevComisiones) => 
        prevComisiones.map((comision) => 
          comision.id === id ? { ...comision, ...data } : comision
        )
      );
    } catch (error) {
      console.error('Error al actualizar comisión:', error);
      throw error;
    }
  };

  // Marcar comisión como abonada
  const marcarComisionAbonada = async (id: string) => {
    try {
      await updateComision(id, { estado: 'abonado' });
    } catch (error) {
      console.error('Error al marcar comisión como abonada:', error);
      throw error;
    }
  };

  // Obtener total de comisiones pendientes
  const getComisionesPendientes = () => {
    return comisiones
      .filter(comision => comision.estado === 'pendiente')
      .reduce((total, comision) => total + comision.importe, 0);
  };

  // Obtener total de comisiones abonadas
  const getComisionesAbonadas = () => {
    return comisiones
      .filter(comision => comision.estado === 'abonado')
      .reduce((total, comision) => total + comision.importe, 0);
  };
  
  // Add missing methods required by the components
  const getComisionesByComercialId = (comercialId: string) => {
    return comisiones.filter(comision => comision.comercialId === comercialId);
  };
  
  const getComisionesPendientesByComercialId = (comercialId: string) => {
    return comisiones
      .filter(comision => comision.comercialId === comercialId && comision.estado === 'pendiente')
      .reduce((total, comision) => total + comision.importe, 0);
  };
  
  const getComisionesAbonadasByComercialId = (comercialId: string) => {
    return comisiones
      .filter(comision => comision.comercialId === comercialId && comision.estado === 'abonado')
      .reduce((total, comision) => total + comision.importe, 0);
  };

  return {
    comisiones,
    loading,
    fetchComisiones,
    addComision,
    updateComision,
    marcarComisionAbonada,
    getComisionesPendientes,
    getComisionesAbonadas,
    getComisionesByComercialId,
    getComisionesPendientesByComercialId,
    getComisionesAbonadasByComercialId
  };
};
