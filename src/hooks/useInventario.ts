
import { useState, useEffect } from 'react';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  fechaCreacion: string;
}

interface NuevoProducto {
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
}

interface StockStats {
  totalProductos: number;
  totalStockActual: number;
  productosStockBajo: number;
  porcentajeStockBajo: number;
}

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StockStats>({
    totalProductos: 0,
    totalStockActual: 0,
    productosStockBajo: 0,
    porcentajeStockBajo: 0,
  });

  // Load productos from localStorage on mount
  useEffect(() => {
    const loadProductos = () => {
      try {
        setLoading(true);
        const savedProductos = localStorage.getItem('inventario-productos');
        if (savedProductos) {
          setProductos(JSON.parse(savedProductos));
        }
      } catch (error) {
        console.error('Error loading productos from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProductos();
  }, []);

  // Calculate stats whenever productos change
  useEffect(() => {
    const stockBajo = productos.filter(p => p.stockActual <= p.stockMinimo).length;
    
    setStats({
      totalProductos: productos.length,
      totalStockActual: productos.reduce((sum, p) => sum + p.stockActual, 0),
      productosStockBajo: stockBajo,
      porcentajeStockBajo: productos.length > 0 ? (stockBajo / productos.length) * 100 : 0,
    });
    
    // Save to localStorage whenever productos change
    localStorage.setItem('inventario-productos', JSON.stringify(productos));
  }, [productos]);

  const addProducto = async (producto: NuevoProducto) => {
    setLoading(true);
    try {
      const newProducto: Producto = {
        id: Math.random().toString(36).substr(2, 9),
        ...producto,
        fechaCreacion: new Date().toISOString(),
      };
      
      setProductos(prevProductos => [...prevProductos, newProducto]);
      return newProducto;
    } catch (error) {
      console.error("Error añadiendo producto:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProducto = async (productoId: string, data: Partial<Producto>) => {
    setLoading(true);
    try {
      setProductos(prevProductos => 
        prevProductos.map(producto => 
          producto.id === productoId ? { ...producto, ...data } : producto
        )
      );
    } catch (error) {
      console.error("Error actualizando producto:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productoId: string, newStock: number) => {
    setLoading(true);
    try {
      setProductos(prev => 
        prev.map(producto => 
          producto.id === productoId 
            ? { ...producto, stockActual: newStock }
            : producto
        )
      );
    } catch (error) {
      console.error("Error actualizando stock:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProducto = async (productoId: string) => {
    setLoading(true);
    try {
      setProductos(prev => prev.filter(producto => producto.id !== productoId));
    } catch (error) {
      console.error("Error eliminando producto:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStockPorCategoria = () => {
    const categorias = [...new Set(productos.map(p => p.categoria))];
    return categorias.map(categoria => {
      const productosCategoria = productos.filter(p => p.categoria === categoria);
      return {
        categoria,
        totalStock: productosCategoria.reduce((sum, p) => sum + p.stockActual, 0),
        count: productosCategoria.length,
      };
    });
  };

  const getStockData = () => {
    const categorias = [...new Set(productos.map(p => p.categoria))];
    
    return {
      labels: categorias,
      datasets: [{
        label: 'Stock por categoría',
        data: categorias.map(cat => 
          productos
            .filter(p => p.categoria === cat)
            .reduce((sum, p) => sum + p.stockActual, 0)
        ),
        backgroundColor: [
          '#EE970D',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
        ],
        borderWidth: 1,
      }]
    };
  };

  const getStockMinimumComparisonData = () => {
    return {
      labels: productos.map(p => p.nombre),
      datasets: [
        {
          label: 'Stock Actual',
          data: productos.map(p => p.stockActual),
          backgroundColor: '#EE970D',
          borderColor: '#EE970D',
          borderWidth: 1,
        },
        {
          label: 'Stock Mínimo',
          data: productos.map(p => p.stockMinimo),
          backgroundColor: '#ef4444',
          borderColor: '#ef4444',
          borderWidth: 1,
        }
      ]
    };
  };

  return {
    productos,
    loading,
    addProducto,
    updateProducto,
    updateStock,
    deleteProducto,
    stats,
    getStockPorCategoria,
    getStockData,
    getStockMinimumComparisonData,
  };
};
