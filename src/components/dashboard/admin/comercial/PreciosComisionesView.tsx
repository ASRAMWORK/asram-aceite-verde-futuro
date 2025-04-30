
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useProductosServicios } from "@/hooks/useProductosServicios";
import { ProductoServicio } from "@/types/comercial";

const PreciosComisionesView = () => {
  const { productos, loading, addProducto, updateProducto, toggleProductoStatus } = useProductosServicios();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado para el formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [comision, setComision] = useState("");
  const [isPorcentual, setIsPorcentual] = useState(true);
  
  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setComision("");
    setIsPorcentual(true);
    setEditingId(null);
  };
  
  const handleEdit = (producto: ProductoServicio) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio.toString());
    setComision(producto.comisionBase.toString());
    setIsPorcentual(producto.comisionPorcentual);
    setEditingId(producto.id);
    setFormOpen(true);
  };
  
  const handleToggleStatus = async (id: string, activo: boolean) => {
    try {
      await toggleProductoStatus(id, !activo);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado del producto/servicio");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      toast.error("El precio debe ser un número positivo");
      return;
    }
    
    const comisionNum = parseFloat(comision);
    if (isNaN(comisionNum) || comisionNum < 0) {
      toast.error("La comisión debe ser un número positivo");
      return;
    }
    
    // Si es porcentual, validar que sea ≤ 100%
    if (isPorcentual && comisionNum > 100) {
      toast.error("La comisión porcentual no puede superar el 100%");
      return;
    }
    
    const productoData: Partial<ProductoServicio> = {
      nombre,
      descripcion,
      precio: precioNum,
      comisionBase: comisionNum,
      comisionPorcentual: isPorcentual,
      activo: true
    };
    
    try {
      if (editingId) {
        await updateProducto(editingId, productoData);
        toast.success("Producto/servicio actualizado correctamente");
      } else {
        await addProducto(productoData);
        toast.success("Producto/servicio añadido correctamente");
      }
      
      resetForm();
      setFormOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el producto/servicio");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Precios y Comisiones</h3>
          <p className="text-gray-500">
            Configura los productos y servicios con sus precios y comisiones para comerciales
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setFormOpen(!formOpen);
        }} className="bg-asram hover:bg-asram-700">
          <Plus className="mr-2 h-4 w-4" />
          {formOpen ? "Cancelar" : "Añadir producto/servicio"}
        </Button>
      </div>
      
      {formOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Nuevo"} producto o servicio</CardTitle>
            <CardDescription>
              Define los detalles del producto/servicio y su comisión para comerciales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del producto/servicio</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Plan Básico Comunidad"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Breve descripción del producto o servicio"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="precio">Precio (€)</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      min="0"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="comision">Comisión</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        id="comision"
                        type="number"
                        step="0.01"
                        min="0"
                        max={isPorcentual ? "100" : undefined}
                        value={comision}
                        onChange={(e) => setComision(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                      <div className="whitespace-nowrap flex items-center gap-2">
                        <Switch
                          id="porcentual"
                          checked={isPorcentual}
                          onCheckedChange={setIsPorcentual}
                        />
                        <Label htmlFor="porcentual">
                          {isPorcentual ? "%" : "€"}
                        </Label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {isPorcentual ? "Porcentaje del precio" : "Cantidad fija por venta"}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-asram hover:bg-asram-700">
                      {editingId ? "Actualizar" : "Añadir"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-6">
          {productos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto/Servicio</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">{producto.descripcion}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{producto.precio.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">
                      {producto.comisionBase}
                      {producto.comisionPorcentual ? "%" : "€"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${producto.activo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(producto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleStatus(producto.id, producto.activo)}
                          className={producto.activo ? 'text-red-500' : 'text-green-500'}
                        >
                          {producto.activo ? (
                            <Trash className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No hay productos o servicios configurados</p>
              <p className="text-gray-500 mt-2">
                Añade un nuevo producto o servicio para empezar
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreciosComisionesView;
