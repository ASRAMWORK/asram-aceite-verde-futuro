
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
    try {
      console.log("Datos de recogida a añadir:", nuevaRecogida);
      
      // Si es una recogida histórica, asegurar que está completada y tiene fechaCompletada
      if (nuevaRecogida.esHistorico) {
        nuevaRecogida.completada = true;
        nuevaRecogida.estadoRecogida = "completada";
        nuevaRecogida.fechaCompletada = nuevaRecogida.fechaRecogida || nuevaRecogida.fecha || new Date();
      }
      
      const result = await addRecogidaBase(nuevaRecogida);
      if (result) {
        console.log("Recogida añadida correctamente, recargando datos...");
        await loadRecogidasData();
      }
      return result;
    } catch (error) {
      console.error("Error en addRecogida:", error);
      throw error;
    }
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
      
      if (recogidasSnap.empty) {
        console.log("No se encontraron recogidas existentes, creando nueva...");
        // Si no hay recogida existente, creamos una nueva para el historial
        await addRecogidaBase({
          rutaId: rutaId,
          clienteId: clienteId,
          fecha: new Date(),
          fechaRecogida: new Date(),
          litrosRecogidos: litros,
          completada: true,
          estadoRecogida: "completada",
          adminId: adminId, 
          administradorId: adminId,
          fechaCompletada: new Date(),
          esRecogidaZona: true,
          esHistorico: true 
        });
      } else {
        console.log(`Se encontraron ${recogidasSnap.size} recogidas existentes para actualizar`);
        // Si ya existe una recogida, actualizarla
        const updatePromises = recogidasSnap.docs.map(recogidaDoc =>
          updateDoc(doc(db, "recogidas", recogidaDoc.id), {
            litrosRecogidos: litros,
            completada: true,
            estadoRecogida: "completada",
            fechaCompletada: new Date(),
            esHistorico: true,
            updatedAt: serverTimestamp()
          })
        );
        
        await Promise.all(updatePromises);
      }
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
