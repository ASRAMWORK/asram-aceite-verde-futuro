
import { collection, getDocs, query, updateDoc, doc, where, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Hook para operaciones por lotes
export function useRecogidaBatchOperations() {
  // Función para completar todas las recogidas de una ruta
  const completarRecogidasRuta = async (rutaId: string) => {
    if (!rutaId) {
      console.error("ID de ruta no proporcionado");
      return false;
    }

    try {
      // Obtener todas las recogidas asociadas a esta ruta
      const recogidasRef = collection(db, "recogidas");
      const rutaRecogidasQuery = query(
        recogidasRef,
        where("rutaId", "==", rutaId)
      );
      
      const recogidasSnap = await getDocs(rutaRecogidasQuery);
      
      if (recogidasSnap.empty) {
        console.log("No hay recogidas existentes para esta ruta, puede ser normal");
        return true;
      }
      
      // Actualizar estado para cada recogida
      const updatePromises = recogidasSnap.docs.map(recogidaDoc => {
        return updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          completada: true,
          estadoRecogida: "completada",
          fechaCompletada: new Date(),
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      console.log(`${recogidasSnap.docs.length} recogidas actualizadas a completadas`);
      return true;
    } catch (err) {
      console.error("Error al completar recogidas de ruta:", err);
      toast.error("Error al actualizar las recogidas");
      return false;
    }
  };

  return {
    completarRecogidasRuta
  };
}
