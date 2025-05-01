
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventario } from "@/hooks/useInventario";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PackagePlus, Loader2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductoInventarioFormProps {
  onSuccess: () => void;
  producto?: {
    id: string;
    nombre: string;
    categoria: string;
    stockActual: number;
    stockMinimo: number;
  };
  isEditing?: boolean;
}

const CATEGORIAS = [
  "Limpieza",
  "Cocina",
  "Baño",
  "Jardinería",
  "Herramientas",
  "Oficina",
  "Otros"
];

export const ProductoInventarioForm = ({ onSuccess, producto, isEditing = false }: ProductoInventarioFormProps) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    categoria: producto?.categoria || "",
    stockActual: producto?.stockActual || 0,
    stockMinimo: producto?.stockMinimo || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");

  const { addProducto, updateProducto } = useInventario();

  // Si estamos editando, inicializar otherCategory si la categoría no está en las predefinidas
  useEffect(() => {
    if (isEditing && producto && !CATEGORIAS.includes(producto.categoria)) {
      setOtherCategory(producto.categoria);
      setFormData(prev => ({ ...prev, categoria: "Otros" }));
    }
  }, [isEditing, producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validar datos del formulario
      if (!formData.nombre.trim()) {
        toast.error("El nombre del producto es obligatorio");
        return;
      }

      if (!formData.categoria) {
        toast.error("La categoría es obligatoria");
        return;
      }

      if (formData.stockActual < 0) {
        toast.error("El stock no puede ser negativo");
        return;
      }
      
      // Si "Otros" es seleccionado, usar la entrada personalizada
      const finalData = {
        ...formData,
        categoria: formData.categoria === "Otros" ? otherCategory : formData.categoria,
      };
      
      console.log("Enviando datos del producto:", finalData);
      
      if (isEditing && producto) {
        await updateProducto(producto.id, finalData);
        toast.success("Producto actualizado correctamente");
      } else {
        await addProducto(finalData);
        toast.success("Producto añadido correctamente");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error al procesar el producto:", error);
      toast.error(isEditing ? "Error al actualizar el producto" : "Error al añadir el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-medium">Nombre del Producto</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20"
          required
          placeholder="Ej: Detergente ecológico"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoria" className="text-sm font-medium">Categoría</Label>
        <Select 
          value={formData.categoria} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
          required
        >
          <SelectTrigger className="w-full border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {formData.categoria === "Otros" && (
          <Input
            value={otherCategory}
            onChange={(e) => setOtherCategory(e.target.value)}
            className="mt-2 border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20"
            required
            placeholder="Especifica la categoría"
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stockActual" className="text-sm font-medium">Stock {isEditing ? 'Actual' : 'Inicial'}</Label>
          <Input
            id="stockActual"
            type="number"
            min="0"
            value={formData.stockActual}
            onChange={(e) => setFormData(prev => ({ ...prev, stockActual: parseInt(e.target.value) || 0 }))}
            className="border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stockMinimo" className="text-sm font-medium">Stock Mínimo</Label>
          <Input
            id="stockMinimo"
            type="number"
            min="0"
            value={formData.stockMinimo}
            onChange={(e) => setFormData(prev => ({ ...prev, stockMinimo: parseInt(e.target.value) || 0 }))}
            className="border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20"
            required
          />
          <p className="text-xs text-gray-500">Nivel para alertas de stock bajo</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-3">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onSuccess}
          className="border-gray-300"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-[#EE970D] hover:bg-[#e08500] text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Actualizando...' : 'Guardando...'}
            </>
          ) : (
            <>
              {isEditing ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <PackagePlus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
