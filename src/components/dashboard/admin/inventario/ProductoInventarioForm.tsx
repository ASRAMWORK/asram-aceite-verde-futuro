
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventario } from "@/hooks/useInventario";
import { useState } from "react";
import { toast } from "sonner";

interface ProductoInventarioFormProps {
  onSuccess: () => void;
}

export const ProductoInventarioForm = ({ onSuccess }: ProductoInventarioFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    stockActual: 0,
    stockMinimo: 0,
  });

  const { addProducto } = useInventario();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProducto(formData);
      toast.success("Producto añadido correctamente");
      onSuccess();
    } catch (error) {
      toast.error("Error al añadir el producto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Producto</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Input
          id="categoria"
          value={formData.categoria}
          onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stockActual">Stock Inicial</Label>
        <Input
          id="stockActual"
          type="number"
          min="0"
          value={formData.stockActual}
          onChange={(e) => setFormData(prev => ({ ...prev, stockActual: parseInt(e.target.value) }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stockMinimo">Stock Mínimo</Label>
        <Input
          id="stockMinimo"
          type="number"
          min="0"
          value={formData.stockMinimo}
          onChange={(e) => setFormData(prev => ({ ...prev, stockMinimo: parseInt(e.target.value) }))}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Producto
        </Button>
      </div>
    </form>
  );
};
