
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from '@/components/common/ImageUploader';
import { Loader2, Save } from 'lucide-react';

interface ProductoFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio || '',
    imageUrl: initialData?.imageUrl || '',
    stock: initialData?.stock || '1',
    activo: initialData?.activo !== false, // true by default
    destacado: initialData?.destacado || false,
  });
  
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelected = (url: string) => {
    handleChange('imageUrl', url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio.toString()),
        stock: parseInt(formData.stock.toString()),
      };
      
      onSubmit(productoData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del producto *</Label>
            <Input 
              id="nombre" 
              placeholder="Detergente ecológico..." 
              required
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea 
              id="descripcion" 
              placeholder="Describe el producto aquí..." 
              required
              className="min-h-[120px]"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (€) *</Label>
              <Input 
                id="precio" 
                type="number" 
                placeholder="0.00" 
                min="0" 
                step="0.01" 
                required
                value={formData.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible *</Label>
              <Input 
                id="stock" 
                type="number" 
                placeholder="1" 
                min="0" 
                required
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="activo" 
                checked={formData.activo} 
                onCheckedChange={(checked) => handleChange('activo', checked)}
              />
              <Label htmlFor="activo">Producto activo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="destacado" 
                checked={formData.destacado} 
                onCheckedChange={(checked) => handleChange('destacado', checked)}
              />
              <Label htmlFor="destacado">Producto destacado</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Imagen del producto</Label>
          <ImageUploader 
            onImageSelected={handleImageSelected}
            folder="tienda/productos"
            label="Imagen principal"
            showPreview={true}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-[#ee970d] hover:bg-[#ee970d]/90 text-white"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Producto
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductoForm;
