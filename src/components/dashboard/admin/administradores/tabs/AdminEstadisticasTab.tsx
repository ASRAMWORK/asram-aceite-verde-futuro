
import React, { useState, useEffect } from 'react';
import { Usuario, ComunidadVecinos } from '@/types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, Home, Container, Droplets } from 'lucide-react';

export interface AdminEstadisticasTabProps {
  admin: Usuario;
}

const AdminEstadisticasTab: React.FC<AdminEstadisticasTabProps> = ({ admin }) => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComunidades = async () => {
      if (!admin.id) return;
      
      try {
        setLoading(true);
        // Query the comunidadesVecinos collection filtering by administradorId
        const comunidadesRef = collection(db, 'comunidadesVecinos');
        const comunidadQuery = query(comunidadesRef, where('administradorId', '==', admin.id));
        const snapshot = await getDocs(comunidadQuery);
        
        const comunidadesData: ComunidadVecinos[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as ComunidadVecinos,
          createdAt: doc.data().createdAt?.toDate?.(),
          updatedAt: doc.data().updatedAt?.toDate?.()
        }));
        
        setComunidades(comunidadesData);
      } catch (error) {
        console.error("Error fetching comunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComunidades();
  }, [admin.id]);

  // Calculate total stats from admin comunidades
  const totalComunidades = comunidades?.length || 0;
  const totalViviendas = comunidades?.reduce((total, com) => total + (com.numViviendas || 0), 0) || 0;
  const totalContenedores = comunidades?.reduce((total, com) => total + (com.numContenedores || 0), 0) || 0;
  const totalLitros = comunidades?.reduce((total, com) => total + (com.litrosRecogidos || 0), 0) || admin.litrosAportados || 0;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-t-asram rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-700">Comunidades</h3>
                <p className="text-2xl font-bold">{totalComunidades}</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex items-center">
              <Home className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-700">Viviendas</h3>
                <p className="text-2xl font-bold">{totalViviendas}</p>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg flex items-center">
              <Container className="h-8 w-8 text-amber-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-amber-700">Contenedores</h3>
                <p className="text-2xl font-bold">{totalContenedores}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex items-center">
              <Droplets className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-purple-700">Litros recogidos</h3>
                <p className="text-2xl font-bold">{totalLitros}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Actividad reciente</h3>
            {comunidades.length > 0 ? (
              <div className="space-y-3">
                {comunidades.slice(0, 5).map(comunidad => (
                  <div key={comunidad.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{comunidad.nombre}</p>
                        <p className="text-sm text-gray-500">{comunidad.direccion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{comunidad.litrosRecogidos || 0} litros</p>
                        <p className="text-xs text-gray-500">
                          {comunidad.numViviendas || 0} viviendas | {comunidad.numContenedores || 0} contenedores
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos de actividad reciente disponibles
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEstadisticasTab;
