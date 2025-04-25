
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Droplet, Info } from 'lucide-react';

const RecogidaAceiteView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Servicio de Recogida de Aceite</h3>
        <p className="text-muted-foreground">
          Gestiona tus solicitudes de recogida de aceite usado y consulta el historial
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-6 w-6 text-asram" />
              <CardTitle>¿Cómo funciona el servicio de recogida?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ASRAM ofrece un servicio de recogida de aceite usado para particulares, 
              comunidades y empresas. Puedes solicitar una recogida y nuestro equipo 
              se encargará de recoger el aceite en la dirección y hora acordada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-asram" />
                    <CardTitle className="text-base">Solicita una fecha</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Elige el día que mejor te convenga para que recojamos tu aceite usado.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-asram" />
                    <CardTitle className="text-base">Confirma la hora</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Te ofrecemos un horario de recogida ajustado a tu disponibilidad.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-asram" />
                    <CardTitle className="text-base">Entrega tu aceite</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nos encargamos de recogerlo y darle una segunda vida de forma responsable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitar recogida</CardTitle>
            <CardDescription>
              Programa una recogida de aceite usado en tu domicilio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-asram hover:bg-asram-700">
              Nueva solicitud
            </Button>
            
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-2">Próximas recogidas en tu zona</h4>
              <div className="space-y-2">
                <div className="text-xs p-2 bg-gray-50 rounded flex justify-between">
                  <span>Chamberí</span>
                  <span className="font-medium">Lunes, 28 Abril</span>
                </div>
                <div className="text-xs p-2 bg-gray-50 rounded flex justify-between">
                  <span>Centro</span>
                  <span className="font-medium">Miércoles, 30 Abril</span>
                </div>
                <div className="text-xs p-2 bg-gray-50 rounded flex justify-between">
                  <span>Salamanca</span>
                  <span className="font-medium">Viernes, 2 Mayo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tu historial de recogidas</CardTitle>
          <CardDescription>
            Registro de las recogidas de aceite solicitadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay recogidas registradas</p>
            <p className="text-sm mt-2">
              Cuando solicites una recogida, aparecerá en esta sección
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecogidaAceiteView;
