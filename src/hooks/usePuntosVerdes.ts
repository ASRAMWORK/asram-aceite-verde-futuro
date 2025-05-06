import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { PuntoVerde } from '@/types';
import { toast } from 'sonner';
import { useUsuarios } from './useUsuarios';
import { useClientes } from './useClientes';

export function usePuntosVerdes(administradorId?: string) {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addUsuario, usuarios } = useUsuarios();
  const { clientes } = useClientes();

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
          return (a.barrio || '').localeCompare(b.barrio || '');
        }
        return (a.distrito || '').localeCompare(b.distrito || '');
      });
      
      setPuntosVerdes(puntosOrdenados);
      
      // Sincronizar con clientes - comprobamos si todos los puntos verdes tienen un cliente asociado
      await sincronizarPuntosVerdesConClientes(puntosOrdenados);
      
    } catch (err) {
      console.error("Error cargando puntos verdes:", err);
      setError("Error al cargar datos de Puntos Verdes");
    } finally {
      setLoading(false);
    }
  };
  
  // Nueva función para sincronizar los puntos verdes con el sistema de clientes
  const sincronizarPuntosVerdesConClientes = async (puntos: PuntoVerde[]) => {
    // Verificar qué puntos verdes no tienen un cliente asociado
    const todosLosClientes = usuarios.length > 0 ? usuarios : clientes;
    const clientesPuntoVerde = todosLosClientes.filter(cliente => cliente.tipo === "punto_verde");
    
    for (const punto of puntos) {
      // Comprobar si ya existe un cliente para este punto verde
      const clienteExistente = clientesPuntoVerde.find(
        cliente => cliente.puntoVerdeId === punto.id
      );
      
      if (!clienteExistente && punto.activo) {
        // No hay cliente asociado a este punto verde, crear uno nuevo
        try {
          await addUsuario({
            nombre: punto.nombre || `Punto Verde - ${punto.direccion}`,
            email: punto.email || "",
            telefono: punto.telefono || "",
            direccion: punto.direccion,
            ciudad: punto.ciudad || "Madrid",
            provincia: punto.provincia || "Madrid",
            codigoPostal: punto.codigoPostal || "",
            tipo: "punto_verde",
            activo: true,
            role: "client",
            distrito: punto.distrito || "",
            barrio: punto.barrio || "",
            numViviendas: punto.numViviendas || 0,
            numContenedores: punto.numContenedores || 0,
            puntoVerdeId: punto.id,  // Referencia al ID del punto verde
            litrosRecogidos: punto.litrosRecogidos || 0,
            puntosVerdes: 0,
            frecuenciaRecogida: "Semanal",
          });
          console.log(`Cliente creado automáticamente para punto verde: ${punto.id}`);
        } catch (err) {
          console.error(`Error creando cliente para punto verde ${punto.id}:`, err);
        }
      }
    }
  };

  const addPuntoVerde = async (nuevoPunto: Omit<PuntoVerde, 'id'>) => {
    try {
      const puntoData = {
        ...nuevoPunto,
        litrosRecogidos: 0,
        createdAt: serverTimestamp(),
      };
      
      // Add punto verde to puntosVerdes collection
      const puntoRef = await addDoc(collection(db, "puntosVerdes"), puntoData);
      
      // Verificar si ya existe un cliente para esta dirección/localización
      const todosLosClientes = usuarios.length > 0 ? usuarios : clientes;
      const clienteExistente = todosLosClientes.find(
        cliente => 
          (cliente.direccion === nuevoPunto.direccion && 
           cliente.distrito === nuevoPunto.distrito &&
           cliente.barrio === nuevoPunto.barrio) ||
          cliente.puntoVerdeId === puntoRef.id
      );
      
      if (!clienteExistente) {
        // Crear un usuario cliente asociado al punto verde
        await addUsuario({
          nombre: nuevoPunto.nombre || `Punto Verde - ${nuevoPunto.direccion}`,
          email: nuevoPunto.email || "",
          telefono: nuevoPunto.telefono || "",
          direccion: nuevoPunto.direccion,
          ciudad: nuevoPunto.ciudad || "Madrid",
          provincia: nuevoPunto.provincia || "Madrid",
          codigoPostal: nuevoPunto.codigoPostal || "",
          tipo: "punto_verde",
          activo: true,
          role: "client",
          distrito: nuevoPunto.distrito || "",
          barrio: nuevoPunto.barrio || "",
          numViviendas: nuevoPunto.numViviendas || 0,
          numContenedores: nuevoPunto.numContenedores || 0,
          puntoVerdeId: puntoRef.id,  // Referencia al ID del punto verde
          litrosRecogidos: 0,
          puntosVerdes: 0,
          frecuenciaRecogida: "Semanal",
          createdAt: new Date(),
          updatedAt: new Date(),
          fechaRegistro: new Date(),
          userId: `pv-${Date.now()}`,  // ID temporal para el usuario
          uid: `pv-${Date.now()}`      // ID temporal para la autenticación
        });
        toast.success("Punto verde añadido correctamente y registrado como cliente");
      } else {
        toast.success("Punto verde añadido correctamente (cliente ya existente)");
      }
      
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
    return Array.from(new Set(puntosVerdes.map(punto => punto.distrito).filter(Boolean))).sort();
  };

  const getBarriosUnicos = () => {
    return Array.from(new Set(puntosVerdes.map(punto => punto.barrio).filter(Boolean))).sort();
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
    getBarriosUnicos,
    sincronizarPuntosVerdesConClientes
  };
}
