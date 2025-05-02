
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecycleIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { motion } from 'framer-motion';
import SolicitudRecogidaForm from '@/components/dashboard/user/solicitud/SolicitudRecogidaForm';
import RecogidaCalendar from '@/components/calendario/RecogidaCalendar';

const RecogidaAceiteView = () => {
  const { profile } = useUserProfile();
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#ee970d]">Recogida de Aceite</h2>
          <p className="text-gray-600">Gestiona tus recogidas de aceite usado</p>
        </div>
        <Button 
          className="bg-[#ee970d] hover:bg-[#ee970d]/90 text-white"
          onClick={() => setShowSolicitudForm(true)}
        >
          <RecycleIcon className="mr-2 h-4 w-4" />
          Solicitar Recogida
        </Button>
      </div>

      {showSolicitudForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <CardHeader className="bg-[#ee970d]/5">
              <CardTitle className="flex items-center text-[#ee970d]">
                <RecycleIcon className="mr-2 h-5 w-5" />
                Nueva solicitud de recogida
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <SolicitudRecogidaForm 
                onCancel={() => setShowSolicitudForm(false)}
                onSuccess={() => setShowSolicitudForm(false)}
                initialData={{
                  direccion: profile?.direccion || '',
                  distrito: profile?.distrito || '',
                  barrio: profile?.barrio || '',
                  telefono: profile?.telefono || '',
                  email: profile?.email || '',
                  nombre: profile?.nombre || '',
                  clienteId: profile?.id || ''
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <RecycleIcon className="mr-2 h-5 w-5 text-[#ee970d]" />
                  Mi Contribución
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#ee970d]">{profile?.litrosAportados || 0}L</p>
                <p className="text-sm text-gray-500">Aceite reciclado total</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-[#ee970d]" />
                  Próxima Recogida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {profile?.distrito 
                    ? `Distrito ${profile.distrito}` 
                    : "Sin programar"}
                </p>
                <p className="text-sm text-gray-500">Consulta el calendario</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <RecycleIcon className="mr-2 h-5 w-5 text-[#ee970d]" />
                  Puntos Verdes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#ee970d]">{profile?.puntosVerdes || 0}</p>
                <p className="text-sm text-gray-500">Acumulados</p>
              </CardContent>
            </Card>
          </div>

          <section>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Calendario de Recogidas</h3>
            <RecogidaCalendar />
          </section>
        </>
      )}
    </div>
  );
};

export default RecogidaAceiteView;
