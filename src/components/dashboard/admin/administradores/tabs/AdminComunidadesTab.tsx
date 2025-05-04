
import React, { useState, useEffect } from 'react';
import { Usuario, ComunidadVecinos } from '@/types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building2, MapPin } from 'lucide-react';

export interface AdminComunidadesTabProps {
  admin: Usuario;
}

const AdminComunidadesTab: React.FC<AdminComunidadesTabProps> = ({ admin }) => {
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
        console.log("Comunidades fetched:", comunidadesData.length);
      } catch (error) {
        console.error("Error fetching comunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComunidades();
  }, [admin.id]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-t-asram rounded-full animate-spin"></div>
        </div>
      ) : comunidades && comunidades.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Comunidades administradas ({comunidades.length})</h3>
          <div className="space-y-4">
            {comunidades.map((comunidad) => (
              <div key={comunidad.id} className="border p-4 rounded-md hover:bg-gray-50 transition-colors">
                <h4 className="font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  {comunidad.nombre}
                </h4>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {comunidad.direccion}, {comunidad.codigoPostal} {comunidad.ciudad}
                </p>
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  <span>Viviendas: {comunidad.numViviendas || 0}</span>
                  <span>Contenedores: {comunidad.numContenedores || 0}</span>
                  <span>Distrito: {comunidad.distrito || '—'}</span>
                  <span>Barrio: {comunidad.barrio || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Este administrador no tiene comunidades asignadas
        </div>
      )}
    </div>
  );
};

export default AdminComunidadesTab;
