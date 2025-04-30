
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ComercialUser, ClienteCaptado, Comision } from '@/types/comercial';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useComerciales() {
  const [comerciales, setComerciales] = useState<ComercialUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadComercialesData = async () => {
    try {
      setLoading(true);
      
      // Base query for comerciales
      const comercialesQuery = query(
        collection(db, "usuarios"),
        where("role", "==", "comercial"),
        orderBy("nombre")
      );
      
      const comercialesSnap = await getDocs(comercialesQuery);
      
      const comercialesData: ComercialUser[] = [];
      comercialesSnap.forEach((doc) => {
        const data = doc.data();
        comercialesData.push({
          id: doc.id,
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          email: data.email || '',
          telefono: data.telefono || '',
          fechaRegistro: data.createdAt?.toDate() || new Date(),
          codigo: data.codigo || '',
          activo: data.activo ?? true,
          aprobado: data.aprobado ?? false,
          saldo: data.saldo || 0,
          comisionesTotales: data.comisionesTotales || 0,
          comisionesPendientes: data.comisionesPendientes || 0,
          metodoPago: data.metodoPago || null,
          datosPersonalizados: data.datosPersonalizados
        });
      });
      
      setComerciales(comercialesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando comerciales:", err);
      setError("Error al cargar datos de comerciales");
    } finally {
      setLoading(false);
    }
  };

  const getComercialById = (id: string) => {
    return comerciales.find(comercial => comercial.id === id) || null;
  };

  const addComercial = async (comercialData: Partial<ComercialUser>) => {
    try {
      // Generate unique referral code
      const codigo = generateUniqueCode();
      
      const docRef = await addDoc(collection(db, "usuarios"), {
        ...comercialData,
        role: "comercial",
        codigo,
        activo: true,
        aprobado: false,
        saldo: 0,
        comisionesTotales: 0,
        comisionesPendientes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial añadido correctamente");
      await loadComercialesData();
      return docRef.id;
    } catch (err) {
      console.error("Error añadiendo comercial:", err);
      toast.error("Error al añadir comercial");
      throw err;
    }
  };

  const updateComercial = async (id: string, data: Partial<ComercialUser>) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial actualizado correctamente");
      await loadComercialesData();
    } catch (err) {
      console.error("Error actualizando comercial:", err);
      toast.error("Error al actualizar comercial");
      throw err;
    }
  };

  const toggleComercialStatus = async (id: string, activo: boolean) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        activo,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Comercial ${activo ? 'activado' : 'desactivado'} correctamente`);
      await loadComercialesData();
    } catch (err) {
      console.error("Error actualizando estado de comercial:", err);
      toast.error("Error al actualizar estado del comercial");
      throw err;
    }
  };

  const aprobarComercial = async (id: string) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        aprobado: true,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial aprobado correctamente");
      await loadComercialesData();
    } catch (err) {
      console.error("Error aprobando comercial:", err);
      toast.error("Error al aprobar comercial");
      throw err;
    }
  };

  const generateUniqueCode = () => {
    // Generate 8 characters unique code
    return uuidv4().substring(0, 8).toUpperCase();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadComercialesData();
  }, []);

  return {
    comerciales,
    loading,
    error,
    loadComercialesData,
    getComercialById,
    addComercial,
    updateComercial,
    toggleComercialStatus,
    aprobarComercial,
    generateUniqueCode
  };
}
