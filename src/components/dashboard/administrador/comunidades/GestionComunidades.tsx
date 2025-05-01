
import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Plus, Loader2, MapPin, Home, Package, Droplet, BarChart, Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface GestionComunidadesProps {
  adminId?: string;
}

const GestionComunidades: React.FC<GestionComunidadesProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  const navigate = useNavigate();
  
  // Pasar el adminId al hook
  const { comunidades, loading, error, deleteComunidad } = 
    useComunidadesVecinos(efectiveAdminId);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  const handleAddComunidad = () => {
    navigate('/administrador/dashboard/gestionar');
  };

  const handleDeleteComunidad = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la comunidad ${nombre}?`)) {
      const success = await deleteComunidad(id);
      if (success) {
        toast({
          title: "Comunidad eliminada",
          description: `La comunidad ${nombre} ha sido eliminada correctamente`
        });
      }
    }
  };

  // Helper function to safely get environmental impact values
  const getImpactoValue = (comunidad, property) => {
    if (property === 'co2') {
      return comunidad.beneficiosMedioambientales?.co2Reducido !== undefined
        ? comunidad.beneficiosMedioambientales.co2Reducido
        : comunidad.beneficiosMedioambientales?.co2 || 0;
    }
    if (property === 'agua') {
      return comunidad.beneficiosMedioambientales?.aguaAhorrada !== undefined
        ? comunidad.beneficiosMedioambientales.aguaAhorrada
        : comunidad.beneficiosMedioambientales?.agua || 0;
    }
    if (property === 'energia') {
      return comunidad.beneficiosMedioambientales?.energiaAhorrada !== undefined
        ? comunidad.beneficiosMedioambientales.energiaAhorrada
        : comunidad.beneficiosMedioambientales?.energia || 0;
    }
    return 0;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Comunidades</h2>
        <Button onClick={handleAddComunidad} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Añadir Comunidad
        </Button>
      </div>
      
      {comunidades.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No tienes comunidades registradas</p>
            <Button onClick={handleAddComunidad} variant="outline">
              Registrar mi primera comunidad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comunidades.map((comunidad) => (
            <Card key={comunidad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{comunidad.nombre}</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Activo
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-3 w-3 mr-1 inline" />
                  {comunidad.direccion}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">CIF: {comunidad.cif}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{comunidad.ciudad}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{comunidad.numViviendas || 0} viviendas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{comunidad.numContenedores || 0} contenedores</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{comunidad.litrosRecogidos || 0}L recogidos</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold mb-2 flex items-center">
                    <BarChart className="h-4 w-4 mr-1 text-green-600" /> 
                    Beneficios medioambientales:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-green-50 rounded text-center">
                      <p className="font-semibold text-green-700">
                        {Math.round(getImpactoValue(comunidad, 'co2'))} kg
                      </p>
                      <p className="text-gray-500">CO2</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <p className="font-semibold text-blue-700">
                        {Math.round(getImpactoValue(comunidad, 'agua'))} L
                      </p>
                      <p className="text-gray-500">Agua</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded text-center">
                      <p className="font-semibold text-amber-700">
                        {Math.round(getImpactoValue(comunidad, 'energia'))} kWh
                      </p>
                      <p className="text-gray-500">Energía</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteComunidad(comunidad.id, comunidad.nombre)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionComunidades;
