
import { collection, getDocs, query, updateDoc, doc, where, serverTimestamp, addDoc, getDoc } from 'firebase/firestore';
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
      console.log(`Completando todas las recogidas para ruta: ${rutaId}`);
      
      // Obtener todas las recogidas asociadas a esta ruta
      const recogidasRef = collection(db, "recogidas");
      const rutaRecogidasQuery = query(
        recogidasRef,
        where("rutaId", "==", rutaId)
      );
      
      const recogidasSnap = await getDocs(rutaRecogidasQuery);
      
      // Get the route information to link client data
      const rutaDocRef = doc(db, "rutas", rutaId);
      const rutaDocSnap = await getDoc(rutaDocRef);
      
      if (!rutaDocSnap.exists()) {
        console.error("La ruta no existe");
        return false;
      }
      
      const rutaData = rutaDocSnap.data();
      const clientes = rutaData?.clientes || [];
      
      if (recogidasSnap.empty) {
        console.log("No hay recogidas existentes para esta ruta. Creando registros históricos...");
        
        // Si no hay recogidas, crear una para cada cliente con los litros guardados
        if (clientes.length > 0) {
          const createPromises = clientes
            .filter((cliente: any) => cliente.litros && cliente.litros > 0)
            .map((cliente: any) => {
              return addDoc(collection(db, "recogidas"), {
                rutaId: rutaId,
                clienteId: cliente.id,
                fechaRecogida: new Date(),
                fecha: new Date(),
                litrosRecogidos: cliente.litros,
                estadoRecogida: "completada",
                completada: true,
                direccion: cliente.direccion,
                direccionRecogida: cliente.direccion,
                nombreContacto: cliente.nombre,
                cliente: cliente.nombre,
                distrito: cliente.distrito,
                barrio: cliente.barrio,
                fechaCompletada: new Date(),
                esRecogidaZona: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            });
          
          await Promise.all(createPromises);
          console.log(`Creadas ${createPromises.length} nuevas entradas históricas de recogidas`);
        }
      } else {
        // Actualizar estado para cada recogida
        const updatePromises = recogidasSnap.docs.map(recogidaDoc => {
          // Buscar el cliente correspondiente en la ruta para obtener los litros
          const clienteId = recogidaDoc.data().clienteId;
          const cliente = clientes.find((c: any) => c.id === clienteId);
          const litros = cliente ? cliente.litros : 0;
          
          return updateDoc(doc(db, "recogidas", recogidaDoc.id), {
            completada: true,
            estadoRecogida: "completada",
            fechaCompletada: new Date(),
            litrosRecogidos: litros,
            updatedAt: serverTimestamp()
          });
        });
        
        await Promise.all(updatePromises);
        console.log(`${recogidasSnap.docs.length} recogidas actualizadas a completadas`);
      }
      
      toast.success("Recogidas actualizadas correctamente");
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
