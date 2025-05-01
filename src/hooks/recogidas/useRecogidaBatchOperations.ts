
import { collection, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Hook for batch operations on recogidas
export function useRecogidaBatchOperations() {
  const completarRecogidasRuta = async (rutaId: string) => {
    try {
      const recogidasQuery = query(
        collection(db, "recogidas"),
        where("rutaId", "==", rutaId)
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const updatePromises = recogidasSnap.docs.map(recogidaDoc => {
        return updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          estadoRecogida: "completada",
          completada: true,
          fechaCompletada: new Date(),
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      toast.success("Todas las recogidas de la ruta completadas");
      return true;
    } catch (err) {
      console.error("Error completando recogidas de ruta:", err);
      toast.error("Error al completar las recogidas");
      return false;
    }
  };

  return {
    completarRecogidasRuta
  };
}

// Fix missing import
import { doc } from 'firebase/firestore';
