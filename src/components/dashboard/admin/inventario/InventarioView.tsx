
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Box, 
  PackagePlus, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Edit, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductoInventarioForm } from "./ProductoInventarioForm";
import { useInventario } from "@/hooks/useInventario";
import { toast } from "sonner";
import { InventarioStats } from "./InventarioStats";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const InventarioView = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { productos, loading, updateStock, deleteProducto, refreshProductos } = useInventario();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<{id: string, nombre: string} | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleStockUpdate = async (productoId: string, currentStock: number, cantidad: number) => {
    try {
      const newStock = Math.max(0, currentStock + cantidad);
      await updateStock(productoId, newStock);
      toast.success("Stock actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el stock");
    }
  };

  const handleDeleteConfirm = async () => {
    if (productoToDelete) {
      try {
        await deleteProducto(productoToDelete.id);
        toast.success(`Producto "${productoToDelete.nombre}" eliminado correctamente`);
        setConfirmDeleteOpen(false);
        setProductoToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar el producto");
      }
    }
  };

  const handleDeleteClick = (producto: {id: string, nombre: string}) => {
    setProductoToDelete(producto);
    setConfirmDeleteOpen(true);
  };

  const handleEdit = (producto: any) => {
    setProductoSeleccionado(producto);
    setEditDialogOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProductos();
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Lista de productos actualizada");
    }, 500);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch (error) {
      return "Fecha desconocida";
    }
  };

  const categorias = [...new Set(productos.map(p => p.categoria))];
  
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === "" || producto.categoria === categoriaFilter;
    const matchesStock = stockFilter === "all" || 
                         (stockFilter === "low" && producto.stockActual <= producto.stockMinimo) ||
                         (stockFilter === "ok" && producto.stockActual > producto.stockMinimo);
    
    return matchesSearch && matchesCategoria && matchesStock;
  });

  // Ordenar productos por fecha de creación (más recientes primero)
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#EE970D]">Control de Inventario</h2>
          <p className="text-muted-foreground">
            Gestiona el stock y los productos del inventario
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-[#EE970D] hover:bg-[#e08500] text-white"
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <InventarioStats />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Box className="mr-2 h-5 w-5 text-[#EE970D]" />
              Productos en Inventario
            </CardTitle>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#EE970D] focus:ring-[#EE970D]/20"
              />
            </div>
            
            <div className="w-full md:w-1/4">
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="border-gray-300 focus:border-[#EE970D]">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/4">
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="border-gray-300 focus:border-[#EE970D]">
                  <SelectValue placeholder="Estado del stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los productos</SelectItem>
                  <SelectItem value="low">Stock bajo</SelectItem>
                  <SelectItem value="ok">Stock adecuado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EE970D]"></div>
                <p className="text-sm text-muted-foreground">Cargando productos...</p>
              </div>
            </div>
          ) : sortedProductos.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Stock Actual</TableHead>
                    <TableHead className="text-right">Stock Mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProductos.map((producto) => (
                    <TableRow key={producto.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-[#EE970D]" />
                          {producto.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell className="text-right font-medium">{producto.stockActual}</TableCell>
                      <TableCell className="text-right">{producto.stockMinimo}</TableCell>
                      <TableCell>
                        {producto.stockActual <= producto.stockMinimo ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock Bajo
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500 flex items-center gap-1">
                            En Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(producto.fechaCreacion)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, producto.stockActual, 1)}
                            className="h-8 w-8 p-0 text-green-600"
                            title="Incrementar stock"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, producto.stockActual, -1)}
                            disabled={producto.stockActual <= 0}
                            className="h-8 w-8 p-0 text-red-600"
                            title="Decrementar stock"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(producto)}
                            className="h-8 w-8 p-0 text-blue-600"
                            title="Editar producto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(producto)}
                            className="h-8 w-8 p-0 text-red-600"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || categoriaFilter || stockFilter !== "all" ?
                "No se encontraron productos con los filtros aplicados." :
                "No hay productos registrados. Agrega tu primer producto haciendo clic en 'Nuevo Producto'."
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para añadir nuevo producto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center">
              <PackagePlus className="mr-2 h-5 w-5" />
              Nuevo Producto
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para añadir un nuevo producto al inventario.
            </DialogDescription>
          </DialogHeader>
          <ProductoInventarioForm 
            onSuccess={() => {
              setDialogOpen(false);
              toast.success("Producto añadido correctamente");
              handleRefresh();
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar producto */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Editar Producto
            </DialogTitle>
            <DialogDescription>
              Modifique los detalles del producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          {productoSeleccionado && (
            <ProductoInventarioForm 
              onSuccess={() => {
                setEditDialogOpen(false);
                setProductoSeleccionado(null);
                toast.success("Producto actualizado correctamente");
                handleRefresh();
              }}
              producto={productoSeleccionado}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto "{productoToDelete?.nombre}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductoToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventarioView;
