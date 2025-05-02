
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecycleIcon, Calendar as CalendarIcon, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { motion, AnimatePresence } from 'framer-motion';
import SolicitudRecogidaForm from '@/components/dashboard/user/solicitud/SolicitudRecogidaForm';
import RecogidaCalendar from '@/components/calendario/RecogidaCalendar';
import { Badge } from '@/components/ui/badge';

const RecogidaAceiteView = () => {
  const { profile } = useUserProfile();
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSolicitudSuccess = () => {
    setShowSolicitudForm(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Recogida de Aceite</h2>
          <p className="text-gray-600">Gestiona tus recogidas de aceite usado de manera sencilla</p>
        </div>
        {!showSolicitudForm && (
          <Button 
            className="bg-[#ee970d] hover:bg-[#ee970d]/90 text-white shadow-sm"
            onClick={() => setShowSolicitudForm(true)}
          >
            <RecycleIcon className="mr-2 h-4 w-4" />
            Solicitar Recogida
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  Tu solicitud de recogida ha sido enviada correctamente. Te contactaremos pronto.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showSolicitudForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-t-4 border-[#ee970d]">
              <CardHeader className="bg-gradient-to-r from-[#ee970d]/10 to-transparent">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-[#ee970d]">
                    <RecycleIcon className="mr-2 h-5 w-5" />
                    Nueva solicitud de recogida
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSolicitudForm(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Completa el formulario para solicitar una recogida de aceite usado
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SolicitudRecogidaForm 
                  onCancel={() => setShowSolicitudForm(false)}
                  onSuccess={handleSolicitudSuccess}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <RecycleIcon className="mr-2 h-5 w-5 text-green-600" />
                      Mi Contribución
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <p className="text-4xl font-bold text-green-600">{profile?.litrosAportados || 0}</p>
                    <p className="ml-1 text-lg font-medium text-green-600">L</p>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Aceite reciclado total</p>
                  
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Impacto positivo</span>
                      <span className="text-sm font-medium text-green-800">Excelente</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                      Próxima Recogida
                    </CardTitle>
                    {profile?.distrito && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Programada
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {profile?.distrito ? (
                    <>
                      <p className="text-2xl font-bold text-blue-600">Distrito {profile.distrito}</p>
                      <p className="text-sm text-blue-600 mt-1">Próximos 7 días</p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        Ver detalle
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-medium text-blue-600">Sin programar</p>
                      <p className="text-sm text-blue-600 mt-1">Consulta el calendario</p>
                      
                      <Button 
                        size="sm" 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowSolicitudForm(true)}
                      >
                        Solicitar ahora
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <RecycleIcon className="mr-2 h-5 w-5 text-purple-600" />
                      Puntos Verdes
                    </CardTitle>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Canjeable
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <p className="text-4xl font-bold text-purple-600">{profile?.puntosVerdes || 0}</p>
                    <p className="ml-1 text-lg font-medium text-purple-600">pts</p>
                  </div>
                  <p className="text-sm text-purple-600 mt-1">Puntos acumulados</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Canjear puntos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Calendario de Recogidas</CardTitle>
                <CardDescription>
                  Consulta las fechas programadas de recogida en tu zona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecogidaCalendar />
              </CardContent>
            </Card>
            
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-amber-800 mb-4">¿Sabías que...?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700">El aceite vertido por el fregadero causa el 25% de las averías en las depuradoras urbanas.</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700">De cada 5 litros de aceite reciclado se puede obtener hasta 4 litros de biodiesel ecológico.</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700">En España se consumen más de 846 millones de litros de aceite al año.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecogidaAceiteView;
