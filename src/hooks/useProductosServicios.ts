
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
import { ProductoServicio } from '@/types/comercial';

export function useProductosServicios() {
  const [productos, setProductos] = useState<ProductoServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductosData = async () => {
    try {
      setLoading(true);
      
      const productosQuery = query(
        collection(db, "productosServicios"),
        orderBy("nombre")
      );
      
      const productosSnap = await getDocs(productosQuery);
      
      const productosData: ProductoServicio[] = [];
      productosSnap.forEach((doc) => {
        const data = doc.data();
        productosData.push({
          id: doc.id,
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio || 0,
          comisionBase: data.comisionBase || 0,
          comisionPorcentual: data.comisionPorcentual ?? true,
          activo: data.activo ?? true
        });
      });
      
      setProductos(productosData);
      setError(null);
    } catch (err) {
      console.error("Error cargando productos/servicios:", err);
      setError("Error al cargar datos de productos/servicios");
    } finally {
      setLoading(false);
    }
  };

  const addProducto = async (productoData: Partial<ProductoServicio>) => {
    try {
      const docRef = await addDoc(collection(db, "productosServicios"), {
        ...productoData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success("Producto/servicio añadido correctamente");
      await loadProductosData();
      return docRef.id;
    } catch (err) {
      console.error("Error añadiendo producto/servicio:", err);
      toast.error("Error al añadir producto/servicio");
      throw err;
    }
  };

  const updateProducto = async (id: string, data: Partial<ProductoServicio>) => {
    try {
      await updateDoc(doc(db, "productosServicios", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Producto/servicio actualizado correctamente");
      await loadProductosData();
    } catch (err) {
      console.error("Error actualizando producto/servicio:", err);
      toast.error("Error al actualizar producto/servicio");
      throw err;
    }
  };

  const toggleProductoStatus = async (id: string, activo: boolean) => {
    try {
      await updateDoc(doc(db, "productosServicios", id), {
        activo,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Producto/servicio ${activo ? 'activado' : 'desactivado'} correctamente`);
      await loadProductosData();
    } catch (err) {
      console.error("Error actualizando estado del producto/servicio:", err);
      toast.error("Error al actualizar estado del producto/servicio");
      throw err;
    }
  };

  useEffect(() => {
    loadProductosData();
  }, []);

  return {
    productos,
    loading,
    error,
    loadProductosData,
    addProducto,
    updateProducto,
    toggleProductoStatus
  };
}
