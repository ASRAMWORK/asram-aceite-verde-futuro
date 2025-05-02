
import React from 'react';
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
import { Box, PackagePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductoInventarioForm } from "./ProductoInventarioForm";
import { useInventario } from "@/hooks/useInventario";
import { toast } from "sonner";

const InventarioView = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { productos, loading, updateStock } = useInventario();

  const handleStockUpdate = async (productoId: string, cantidad: number) => {
    try {
      await updateStock(productoId, cantidad);
      toast.success("Stock actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Control de Inventario</h2>
          <p className="text-muted-foreground">
            Gestiona el stock y los productos del inventario
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-asram hover:bg-asram-700"
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-gray-500" />
                          {producto.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell>{producto.stockActual}</TableCell>
                      <TableCell>{producto.stockMinimo}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={producto.stockActual > producto.stockMinimo ? "default" : "destructive"}
                        >
                          {producto.stockActual > producto.stockMinimo ? "En Stock" : "Stock Bajo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, producto.stockActual + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(producto.id, producto.stockActual - 1)}
                            disabled={producto.stockActual <= 0}
                          >
                            -
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductoInventarioForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventarioView;
