
import React, { useState } from 'react';
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
import { Box, PackagePlus, Plus, Minus, Trash2, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const { productos, loading, updateStock, deleteProducto } = useInventario();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const handleStockUpdate = async (productoId: string, cantidad: number) => {
    try {
      await updateStock(productoId, cantidad);
      toast.success("Stock actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el stock");
    }
  };

  const handleDelete = async (productoId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProducto(productoId);
        toast.success("Producto eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el producto");
      }
    }
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
          <CardTitle className="text-xl font-semibold">Productos en Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#EE970D]"
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
            <div className="text-center py-8">Cargando...</div>
          ) : filteredProductos.length > 0 ? (
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
                  {filteredProductos.map((producto) => (
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
                        <Badge 
                          variant={producto.stockActual > producto.stockMinimo ? "default" : "destructive"}
                          className={producto.stockActual > producto.stockMinimo ? "bg-green-500" : ""}
                        >
                          {producto.stockActual > producto.stockMinimo ? "En Stock" : "Stock Bajo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(producto.fechaCreacion)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, producto.stockActual + 1)}
                            className="h-8 w-8 p-0 text-green-600"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Incrementar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, Math.max(0, producto.stockActual - 1))}
                            disabled={producto.stockActual <= 0}
                            className="h-8 w-8 p-0 text-red-600"
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrementar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(producto.id)}
                            className="h-8 w-8 p-0 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D]">Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductoInventarioForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventarioView;
