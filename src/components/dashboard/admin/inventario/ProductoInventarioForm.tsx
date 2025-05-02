
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
  const [formErrors, setFormErrors] = useState({
    nombre: "",
    categoria: "",
    stockActual: "",
    stockMinimo: "",
    otherCategory: "",
  });

  const { addProducto, updateProducto } = useInventario();

  // Si estamos editando, inicializar otherCategory si la categoría no está en las predefinidas
  useEffect(() => {
    if (isEditing && producto && !CATEGORIAS.includes(producto.categoria)) {
      setOtherCategory(producto.categoria);
      setFormData(prev => ({ ...prev, categoria: "Otros" }));
    }
  }, [isEditing, producto]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      nombre: "",
      categoria: "",
      stockActual: "",
      stockMinimo: "",
      otherCategory: "",
    };

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del producto es obligatorio";
      isValid = false;
    }

    if (!formData.categoria) {
      errors.categoria = "La categoría es obligatoria";
      isValid = false;
    }

    if (formData.categoria === "Otros" && !otherCategory.trim()) {
      errors.otherCategory = "Debes especificar una categoría";
      isValid = false;
    }

    if (formData.stockActual < 0) {
      errors.stockActual = "El stock no puede ser negativo";
      isValid = false;
    }

    if (formData.stockMinimo < 0) {
      errors.stockMinimo = "El stock mínimo no puede ser negativo";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Si "Otros" es seleccionado, usar la entrada personalizada
      const finalData = {
        ...formData,
        categoria: formData.categoria === "Otros" ? otherCategory : formData.categoria,
      };
      
      console.log("Enviando datos del producto:", finalData);
      
      if (isEditing && producto) {
        await updateProducto(producto.id, finalData);
      } else {
        await addProducto(finalData);
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
          className={`border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20 ${formErrors.nombre ? 'border-red-500' : ''}`}
          placeholder="Ej: Detergente ecológico"
        />
        {formErrors.nombre && <p className="text-xs text-red-500 mt-1">{formErrors.nombre}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoria" className="text-sm font-medium">Categoría</Label>
        <Select 
          value={formData.categoria} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
        >
          <SelectTrigger className={`w-full border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20 ${formErrors.categoria ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.categoria && <p className="text-xs text-red-500 mt-1">{formErrors.categoria}</p>}

        {formData.categoria === "Otros" && (
          <div className="mt-2">
            <Input
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              className={`border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20 ${formErrors.otherCategory ? 'border-red-500' : ''}`}
              placeholder="Especifica la categoría"
            />
            {formErrors.otherCategory && <p className="text-xs text-red-500 mt-1">{formErrors.otherCategory}</p>}
          </div>
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
            className={`border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20 ${formErrors.stockActual ? 'border-red-500' : ''}`}
          />
          {formErrors.stockActual && <p className="text-xs text-red-500 mt-1">{formErrors.stockActual}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stockMinimo" className="text-sm font-medium">Stock Mínimo</Label>
          <Input
            id="stockMinimo"
            type="number"
            min="0"
            value={formData.stockMinimo}
            onChange={(e) => setFormData(prev => ({ ...prev, stockMinimo: parseInt(e.target.value) || 0 }))}
            className={`border-gray-300 focus:border-[#EE970D] focus:ring focus:ring-[#EE970D]/20 ${formErrors.stockMinimo ? 'border-red-500' : ''}`}
          />
          {formErrors.stockMinimo && <p className="text-xs text-red-500 mt-1">{formErrors.stockMinimo}</p>}
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
