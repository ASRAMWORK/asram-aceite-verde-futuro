
import { useRecogidaData } from './recogidas/useRecogidaData';
import { useRecogidaOperations } from './recogidas/useRecogidaOperations';
import { useRecogidaStats } from './recogidas/useRecogidaStats';
import { useRecogidaFilters } from './recogidas/useRecogidaFilters';
import { useRecogidaBatchOperations } from './recogidas/useRecogidaBatchOperations';
import { collection, getDocs, query, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Main hook that combines all recogida functionality
export function useRecogidas(adminId?: string) {
  // Load data
  const { 
    recogidas, 
    loading, 
    error, 
    loadRecogidasData 
  } = useRecogidaData(adminId);
  
  // Operations
  const { 
    addRecogida: addRecogidaBase, 
    updateRecogida: updateRecogidaBase, 
    deleteRecogida: deleteRecogidaBase, 
    completarRecogida: completarRecogidaBase,
    updateRutaRecogida: updateRutaRecogidaBase
  } = useRecogidaOperations(adminId);
  
  // Stats
  const { 
    getTotalLitrosRecogidos,
    getTotalLitrosRecogidosPorRuta,
    getLitrosRecolectadosPorDistrito,
    calcularPromedioLitrosPorRecogida,
    calcularPromedioLitrosPorPeriodo
  } = useRecogidaStats(recogidas);
  
  // Filters
  const { 
    getRecogidasByClientId, 
    getRecogidasByRutaId 
  } = useRecogidaFilters(recogidas);
  
  // Batch operations
  const { 
    completarRecogidasRuta: completarRecogidasRutaBase 
  } = useRecogidaBatchOperations();
  
  // Wrap operations to refresh data after completion
  const addRecogida = async (nuevaRecogida: any) => {
    const result = await addRecogidaBase(nuevaRecogida);
    if (result) await loadRecogidasData();
    return result;
  };
  
  const updateRecogida = async (id: string, data: any) => {
    const result = await updateRecogidaBase(id, data, recogidas);
    if (result) await loadRecogidasData();
    return result;
  };
  
  const deleteRecogida = async (id: string) => {
    const result = await deleteRecogidaBase(id, recogidas);
    if (result) await loadRecogidasData();
    return result;
  };
  
  const completarRecogida = async (id: string, litrosRecogidos: number) => {
    const result = await completarRecogidaBase(id, litrosRecogidos, recogidas);
    if (result) await loadRecogidasData();
    return result;
  };
  
  // Alias for completarRecogida for backwards compatibility
  const completeRecogida = async (id: string, litrosRecogidos: number = 0) => {
    return completarRecogida(id, litrosRecogidos);
  };
  
  const completarRecogidasRuta = async (rutaId: string) => {
    const result = await completarRecogidasRutaBase(rutaId);
    if (result) await loadRecogidasData();
    return result;
  };
  
  const updateRutaRecogida = async (rutaId: string, clienteId: string, litros: number) => {
    const result = await updateRutaRecogidaBase(rutaId, clienteId, litros);
    
    // Also update any recogidas associated with this client in this route
    try {
      const recogidasQuery = query(
        collection(db, "recogidas"),
        where("rutaId", "==", rutaId),
        where("clienteId", "==", clienteId)
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const updatePromises = recogidasSnap.docs.map(recogidaDoc =>
        updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          litrosRecogidos: litros,
          updatedAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
    } catch (err) {
      console.error("Error updating related recogidas:", err);
    }
    
    if (result) await loadRecogidasData();
    return result;
  };

  return {
    // Data
    recogidas,
    loading,
    error,
    loadRecogidasData,
    
    // Operations
    addRecogida,
    updateRecogida,
    deleteRecogida,
    completarRecogida,
    completeRecogida,
    completarRecogidasRuta,
    updateRutaRecogida,
    
    // Stats
    getTotalLitrosRecogidos,
    getTotalLitrosRecogidosPorRuta,
    getLitrosRecolectadosPorDistrito,
    calcularPromedioLitrosPorRecogida,
    calcularPromedioLitrosPorPeriodo,
    
    // Filters
    getRecogidasByClientId,
    getRecogidasByRutaId
  };
}
