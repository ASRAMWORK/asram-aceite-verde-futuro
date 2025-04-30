
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { PuntoVerde, Usuario } from '@/types';
import { toast } from 'sonner';
import { useUsuarios } from './useUsuarios';
import { geocodeAddress } from '@/lib/googleMaps';

export function usePuntosVerdes(administradorId?: string) {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addUsuario } = useUsuarios();

  const loadPuntosVerdesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const puntosRef = collection(db, "puntosVerdes");
      
      let puntosQuery;
      if (administradorId) {
        puntosQuery = query(
          puntosRef,
          where("administradorId", "==", administradorId),
          orderBy("distrito")
        );
      } else {
        puntosQuery = query(puntosRef, orderBy("distrito"));
      }
      
      const puntosSnap = await getDocs(puntosQuery);
      
      const puntosData: PuntoVerde[] = [];
      puntosSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        puntosData.push({ 
          id: doc.id, 
          nombre: data.nombre || "",
          ciudad: data.ciudad || "",
          provincia: data.provincia || "",
          codigoPostal: data.codigoPostal || "",
          pais: data.pais || "",
          latitud: data.latitud || 0,
          longitud: data.longitud || 0,
          tipo: data.tipo || "",
          descripcion: data.descripcion || "",
          horario: data.horario || "",
          email: data.email || "",
          contacto: data.contacto || "",
          activo: data.activo !== undefined ? data.activo : true,
          distrito: data.distrito,
          barrio: data.barrio,
          direccion: data.direccion,
          numViviendas: data.numViviendas,
          numContenedores: data.numContenedores,
          telefono: data.telefono,
          litrosRecogidos: data.litrosRecogidos,
          administradorId: data.administradorId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      // Ordenamos en memoria por distrito y luego por barrio
      const puntosOrdenados = puntosData.sort((a, b) => {
        if (a.distrito === b.distrito) {
          return a.barrio.localeCompare(b.barrio);
        }
        return a.distrito.localeCompare(b.distrito);
      });
      
      setPuntosVerdes(puntosOrdenados);
    } catch (err) {
      console.error("Error cargando puntos verdes:", err);
      setError("Error al cargar datos de Puntos Verdes");
    } finally {
      setLoading(false);
    }
  };

  const addPuntoVerde = async (nuevoPunto: Omit<PuntoVerde, 'id'>) => {
    try {
      // If the punto has an address but no coordinates, try to geocode it
      if (nuevoPunto.direccion && (!nuevoPunto.latitud || !nuevoPunto.longitud)) {
        try {
          const addressData = await geocodeAddress(nuevoPunto.direccion);
          if (addressData) {
            nuevoPunto.latitud = addressData.latitud || 0;
            nuevoPunto.longitud = addressData.longitud || 0;
            
            // Update other address fields if they're not already set
            if (!nuevoPunto.ciudad && addressData.ciudad) {
              nuevoPunto.ciudad = addressData.ciudad;
            }
            if (!nuevoPunto.provincia && addressData.provincia) {
              nuevoPunto.provincia = addressData.provincia;
            }
            if (!nuevoPunto.pais && addressData.pais) {
              nuevoPunto.pais = addressData.pais;
            }
            if (!nuevoPunto.codigoPostal && addressData.codigoPostal) {
              nuevoPunto.codigoPostal = addressData.codigoPostal;
            }
            if (!nuevoPunto.distrito && addressData.distrito) {
              nuevoPunto.distrito = addressData.distrito;
            }
            if (!nuevoPunto.barrio && addressData.barrio) {
              nuevoPunto.barrio = addressData.barrio;
            }
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
          // Continue with the original data if geocoding fails
        }
      }
      
      const puntoData = {
        ...nuevoPunto,
        litrosRecogidos: 0,
        createdAt: serverTimestamp(),
      };
      
      // Add punto verde to puntosVerdes collection
      const puntoRef = await addDoc(collection(db, "puntosVerdes"), puntoData);
      
      // Create a user-like record omitting the latitud/longitud properties
      // that are not part of the Usuario type expected by addUsuario
      const usuarioData = {
        nombre: `Punto Verde - ${nuevoPunto.direccion}`,
        email: nuevoPunto.email || "",
        telefono: nuevoPunto.telefono || "",
        direccion: nuevoPunto.direccion,
        ciudad: nuevoPunto.ciudad || "Madrid",
        provincia: nuevoPunto.provincia || "Madrid",
        codigoPostal: nuevoPunto.codigoPostal || "",
        tipo: "punto_verde",
        activo: true,
        role: "client",
        distrito: nuevoPunto.distrito,
        barrio: nuevoPunto.barrio,
        numViviendas: nuevoPunto.numViviendas,
        numContenedores: nuevoPunto.numContenedores,
        puntosVerdes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        fechaRegistro: new Date(),
        userId: `temp-${Date.now()}`,
        uid: `temp-${Date.now()}`
      };
      
      await addUsuario(usuarioData);
      
      toast.success("Punto verde añadido correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error añadiendo punto verde:", err);
      toast.error("Error al añadir el punto verde");
      return false;
    }
  };

  const updatePuntoVerde = async (id: string, data: Partial<PuntoVerde>) => {
    try {
      // If the address was updated but coordinates weren't, try to geocode
      if (data.direccion && (data.latitud === undefined || data.longitud === undefined)) {
        try {
          const addressData = await geocodeAddress(data.direccion);
          if (addressData) {
            data.latitud = addressData.latitud;
            data.longitud = addressData.longitud;
            
            // Update other address fields if they weren't explicitly set
            if (data.ciudad === undefined && addressData.ciudad) {
              data.ciudad = addressData.ciudad;
            }
            if (data.provincia === undefined && addressData.provincia) {
              data.provincia = addressData.provincia;
            }
            if (data.pais === undefined && addressData.pais) {
              data.pais = addressData.pais;
            }
            if (data.codigoPostal === undefined && addressData.codigoPostal) {
              data.codigoPostal = addressData.codigoPostal;
            }
            if (data.distrito === undefined && addressData.distrito) {
              data.distrito = addressData.distrito;
            }
            if (data.barrio === undefined && addressData.barrio) {
              data.barrio = addressData.barrio;
            }
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
          // Continue with the original data if geocoding fails
        }
      }
      
      await updateDoc(doc(db, "puntosVerdes", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Punto verde actualizado correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error actualizando punto verde:", err);
      toast.error("Error al actualizar el punto verde");
      return false;
    }
  };

  const deletePuntoVerde = async (id: string) => {
    try {
      await deleteDoc(doc(db, "puntosVerdes", id));
      toast.success("Punto verde eliminado correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error eliminando punto verde:", err);
      toast.error("Error al eliminar el punto verde");
      return false;
    }
  };

  const getPuntosByDistrito = (distrito: string) => {
    return puntosVerdes.filter(punto => punto.distrito === distrito);
  };
  
  const getPuntosByBarrio = (barrio: string) => {
    return puntosVerdes.filter(punto => punto.barrio === barrio);
  };

  const getDistritosUnicos = () => {
    return Array.from(new Set(puntosVerdes.map(punto => punto.distrito))).sort();
  };

  const getBarriosUnicos = () => {
    return Array.from(new Set(puntosVerdes.map(punto => punto.barrio))).sort();
  };

  useEffect(() => {
    loadPuntosVerdesData();
  }, [administradorId]);

  return { 
    puntosVerdes, 
    loading, 
    error, 
    loadPuntosVerdesData,
    addPuntoVerde,
    updatePuntoVerde,
    deletePuntoVerde,
    getPuntosByDistrito,
    getPuntosByBarrio,
    getDistritosUnicos,
    getBarriosUnicos
  };
}
