
import React, { useState, useEffect } from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Plus, Loader2, MapPin, Home, 
  Package, Droplet, BarChart, Trash2, Eye
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ComunidadVecinos } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MisComunidadesProps {
  adminId?: string;
}

const MisComunidades: React.FC<MisComunidadesProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const [viewingAdminId, setViewingAdminId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check for any adminId in sessionStorage (set when accessed from superadmin)
  useEffect(() => {
    const storedAdminId = sessionStorage.getItem('viewingAdminId');
    if (storedAdminId) {
      console.log("Using admin ID from sessionStorage:", storedAdminId);
      setViewingAdminId(storedAdminId);
    }
  }, []);
  
  // Use either the admin ID from props, sessionStorage, or current profile
  const effectiveAdminId = adminId || viewingAdminId || profile?.id;
  
  const { comunidades, loading, error, deleteComunidad, loadComunidades } = useComunidadesVecinos(effectiveAdminId);
  const [selectedComunidad, setSelectedComunidad] = useState<ComunidadVecinos | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Additional refresh for when coming from superadmin view
  useEffect(() => {
    if (effectiveAdminId) {
      console.log("Loading communities for adminId:", effectiveAdminId);
      loadComunidades();
    }
  }, [effectiveAdminId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  const handleAddComunidad = () => {
    navigate('/administrador/dashboard#gestionar');
  };
  
  const handleViewDetails = (comunidad: ComunidadVecinos) => {
    setSelectedComunidad(comunidad);
    setDialogOpen(true);
  };

  const handleDeleteComunidad = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la comunidad ${nombre}?`)) {
      const success = await deleteComunidad(id);
      if (success) {
        toast.success(`La comunidad ${nombre} ha sido eliminada correctamente`);
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
  
  // Clear the stored admin ID when leaving (only if viewing from superadmin)
  const handleReturnToSuperAdmin = () => {
    sessionStorage.removeItem('viewingAdminId');
    sessionStorage.removeItem('fromSuperAdmin');
    navigate('/admin/dashboard');
  };
  
  // Determine if we're in superadmin viewing mode
  const isViewingSuperAdmin = sessionStorage.getItem('fromSuperAdmin') === 'true';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Comunidades</h2>
        <div className="flex gap-2">
          {isViewingSuperAdmin && (
            <Button variant="outline" onClick={handleReturnToSuperAdmin}>
              Volver al panel de superadmin
            </Button>
          )}
          <Button onClick={handleAddComunidad} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Añadir Comunidad
          </Button>
        </div>
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
                <CardDescription>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-3 w-3 mr-1 inline" />
                    {comunidad.direccion}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">CIF: {comunidad.cif || 'N/A'}</span>
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
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center justify-center"
                    onClick={() => handleViewDetails(comunidad)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalles
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteComunidad(comunidad.id, comunidad.nombre)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de detalles de la comunidad */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedComunidad && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedComunidad.nombre}</DialogTitle>
                <DialogDescription className="flex items-center text-sm">
                  <MapPin className="h-3 w-3 mr-1 inline" />
                  {selectedComunidad.direccion}, {selectedComunidad.ciudad}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Información General</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-500">CIF:</div>
                    <div>{selectedComunidad.cif || 'No especificado'}</div>
                    <div className="font-medium text-gray-500">Provincia:</div>
                    <div>{selectedComunidad.provincia || 'No especificado'}</div>
                    <div className="font-medium text-gray-500">Teléfono:</div>
                    <div>{selectedComunidad.telefono || 'No especificado'}</div>
                    <div className="font-medium text-gray-500">Email:</div>
                    <div>{selectedComunidad.email || 'No especificado'}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Datos de Recogida</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-500">Viviendas:</div>
                    <div>{selectedComunidad.numViviendas || 0}</div>
                    <div className="font-medium text-gray-500">Contenedores:</div>
                    <div>{selectedComunidad.numContenedores || 0}</div>
                    <div className="font-medium text-gray-500">Litros recogidos:</div>
                    <div>{selectedComunidad.litrosRecogidos || 0} L</div>
                    <div className="font-medium text-gray-500">Fecha de alta:</div>
                    <div>{selectedComunidad.createdAt ? new Date(selectedComunidad.createdAt).toLocaleDateString() : 'No especificado'}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 py-4">
                <h4 className="font-medium">Impacto Medioambiental</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-green-50 rounded text-center">
                    <p className="font-semibold text-green-700 text-lg">
                      {Math.round(getImpactoValue(selectedComunidad, 'co2'))} kg
                    </p>
                    <p className="text-gray-500">CO2 Reducido</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="font-semibold text-blue-700 text-lg">
                      {Math.round(getImpactoValue(selectedComunidad, 'agua'))} L
                    </p>
                    <p className="text-gray-500">Agua Ahorrada</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded text-center">
                    <p className="font-semibold text-amber-700 text-lg">
                      {Math.round(getImpactoValue(selectedComunidad, 'energia'))} kWh
                    </p>
                    <p className="text-gray-500">Energía Ahorrada</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MisComunidades;
