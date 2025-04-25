import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComunidadesVecinos } from "@/hooks/useComunidadesVecinos";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ComunidadVecinos } from "@/types";
import { toast } from "sonner";

const GestionarComunidad: React.FC = () => {
  const { profile } = useUserProfile();
  const { addComunidad, updateComunidad, comunidades } = useComunidadesVecinos(profile?.id);
  const [formData, setFormData] = useState<Partial<ComunidadVecinos>>({
    nombre: "",
    direccion: "",
    numViviendas: 0,
    cif: "",
    codigoPostal: "",
    ciudad: "Madrid",
    distrito: "",
    barrio: "",
    totalViviendas: 0,
    numeroPorteria: 0,
    nombreAdministracion: profile?.nombreAdministracion || "",
    correoContacto: profile?.email || "",
    litrosRecogidos: 0,
    administradorId: profile?.id || "",
    beneficiosMedioambientales: {
      co2Evitado: 0,
      aguaAhorrada: 0,
      energiaAhorrada: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [comunidadId, setComunidadId] = useState<string | null>(null);

  // Get distritos and barrios
  const distritos = [
    "Centro",
    "Arganzuela",
    "Retiro",
    "Salamanca",
    "Chamartín",
    "Tetuán",
    "Chamberí",
    "Fuencarral-El Pardo",
    "Moncloa-Aravaca",
    "Latina",
    "Carabanchel",
    "Usera",
    "Puente de Vallecas",
    "Moratalaz",
    "Ciudad Lineal",
    "Hortaleza",
    "Villaverde",
    "Villa de Vallecas",
    "Vicálvaro",
    "San Blas-Canillejas",
    "Barajas",
  ];

  const barrios: { [key: string]: string[] } = {
    "Centro": ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
    "Arganzuela": ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
  };

  // Check URL parameters for edit mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    if (id) {
      const comunidad = comunidades.find(c => c.id === id);
      if (comunidad) {
        setFormData({...comunidad});
        setEditMode(true);
        setComunidadId(id);
      }
    }
  }, [comunidades]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.direccion || !formData.cif) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }
    
    setLoading(true);
    
    try {
      if (editMode && comunidadId) {
        await updateComunidad(comunidadId, formData);
        toast.success("Comunidad actualizada correctamente");
      } else {
        await addComunidad(formData as Omit<ComunidadVecinos, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success("Comunidad añadida correctamente");
        
        // Reset form after successful submission
        setFormData({
          ...formData,
          nombre: "",
          direccion: "",
          cif: "",
          codigoPostal: "",
          distrito: "",
          barrio: "",
          totalViviendas: 0,
          numeroPorteria: 0,
          litrosRecogidos: 0,
        });
      }
    } catch (error) {
      toast.error("Error al guardar la comunidad");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const cancelEdit = () => {
    setEditMode(false);
    setComunidadId(null);
    setFormData({
      nombre: "",
      direccion: "",
      cif: "",
      codigoPostal: "",
      ciudad: "Madrid",
      distrito: "",
      barrio: "",
      totalViviendas: 0,
      numeroPorteria: 0,
      nombreAdministracion: profile?.nombreAdministracion || "",
      correoContacto: profile?.email || "",
      litrosRecogidos: 0,
      administradorId: profile?.id || "",
      beneficiosMedioambientales: {
        co2Evitado: 0,
        aguaAhorrada: 0,
        energiaAhorrada: 0,
      },
    });
    
    // Remove id from URL
    window.history.replaceState(null, "", "/administrador/dashboard?tab=gestionar");
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="text-xl font-bold text-purple-800">
          {editMode ? "Editar Comunidad" : "Añadir Nueva Comunidad de Vecinos"}
        </CardTitle>
        <CardDescription>
          {editMode 
            ? "Actualiza los datos de la comunidad seleccionada" 
            : "Introduce los datos de la nueva comunidad de vecinos"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nombre">Nombre de la Comunidad *</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Comunidad de Propietarios..."
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cif">CIF *</Label>
              <Input
                id="cif"
                name="cif"
                placeholder="H12345678"
                value={formData.cif}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Calle, número..."
                value={formData.direccion}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="codigoPostal">Código Postal *</Label>
              <Input
                id="codigoPostal"
                name="codigoPostal"
                placeholder="28001"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="distrito">Distrito *</Label>
              <Select
                value={formData.distrito}
                onValueChange={(value) => handleSelectChange("distrito", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="barrio">Barrio *</Label>
              <Select
                value={formData.barrio}
                onValueChange={(value) => handleSelectChange("barrio", value)}
                disabled={!formData.distrito}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un barrio" />
                </SelectTrigger>
                <SelectContent>
                  {formData.distrito && barrios[formData.distrito]?.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="totalViviendas">Total de Viviendas *</Label>
              <Input
                id="totalViviendas"
                name="totalViviendas"
                type="number"
                value={formData.totalViviendas}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="numeroPorteria">Número de Portería/s *</Label>
              <Input
                id="numeroPorteria"
                name="numeroPorteria"
                type="number"
                value={formData.numeroPorteria}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="nombreAdministracion">Nombre de la Administración *</Label>
              <Input
                id="nombreAdministracion"
                name="nombreAdministracion"
                value={formData.nombreAdministracion}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="correoContacto">Correo de Contacto *</Label>
              <Input
                id="correoContacto"
                name="correoContacto"
                type="email"
                value={formData.correoContacto}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {editMode && (
              <div>
                <Label htmlFor="litrosRecogidos">Litros Recogidos</Label>
                <Input
                  id="litrosRecogidos"
                  name="litrosRecogidos"
                  type="number"
                  value={formData.litrosRecogidos}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            {editMode && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700" 
              disabled={loading}
            >
              {loading 
                ? (editMode ? "Actualizando..." : "Guardando...") 
                : (editMode ? "Actualizar Comunidad" : "Añadir Comunidad")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GestionarComunidad;
