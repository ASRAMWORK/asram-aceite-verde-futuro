
import { useState } from 'react';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
}

interface NuevoProducto {
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
}

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  const addProducto = async (producto: NuevoProducto) => {
    const newProducto: Producto = {
      id: Math.random().toString(36).substr(2, 9),
      ...producto
    };
    setProductos(prev => [...prev, newProducto]);
  };

  const updateStock = async (productoId: string, newStock: number) => {
    setProductos(prev => 
      prev.map(producto => 
        producto.id === productoId 
          ? { ...producto, stockActual: newStock }
          : producto
      )
    );
  };

  return {
    productos,
    loading,
    addProducto,
    updateStock
  };
};
