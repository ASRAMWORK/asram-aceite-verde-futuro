
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, CreditCard, Link, User, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DetalleComercialDialogProps {
  comercialId: string;
  open: boolean;
  onClose: () => void;
}

const DetalleComercialDialog = ({ comercialId }: DetalleComercialDialogProps) => {
  const { getComercialById } = useComerciales();
  const { getClientesByComercialId, getTotalLitrosByComercialId } = useClientesCaptados();
  const comercial = getComercialById(comercialId);
  const clientes = getClientesByComercialId(comercialId);

  if (!comercial) {
    return <div>No se encontró el comercial</div>;
  }

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const formatDateTime = (date: Date | undefined | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Detalle del Comercial
        </DialogTitle>
        <DialogDescription>
          Información detallada del comercial seleccionado
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">
            Información
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex-1">
            Clientes Captados
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex-1">
            Pagos y Comisiones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p className="text-lg font-semibold">
                    {comercial.nombre} {comercial.apellidos || ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{comercial.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                  <p className="text-lg">{comercial.telefono || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Código de referencia</h3>
                  <Badge variant="outline" className="font-mono text-lg">
                    {comercial.codigo}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Fecha de registro
                  </h3>
                  <p className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(comercial.fechaRegistro)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={comercial.activo ? "default" : "outline"}>
                      {comercial.activo ? "Activo" : "Inactivo"}
                    </Badge>
                    <Badge
                      variant={comercial.aprobado ? "default" : "outline"}
                      className={
                        comercial.aprobado ? "bg-green-600" : "bg-amber-100 text-amber-800"
                      }
                    >
                      {comercial.aprobado ? "Aprobado" : "Pendiente de aprobación"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Link className="h-4 w-4 mr-1" />
                  Vinculación con Firebase Auth
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">UID de autenticación</h4>
                    <p className="font-mono">
                      {comercial.uid ? (
                        comercial.uid
                      ) : (
                        <span className="text-red-500">Sin vincular</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Estado de vinculación</h4>
                    <Badge 
                      variant="outline" 
                      className={
                        comercial.estadoVinculacion === 'completo' 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {comercial.estadoVinculacion === 'completo' && "Completado"}
                      {comercial.estadoVinculacion === 'pendiente' && "Pendiente de vincular"}
                      {comercial.estadoVinculacion === 'falla_password' && "Password incorrecto"}
                      {comercial.estadoVinculacion === 'sin_vincular' && "Sin vincular"}
                      {!comercial.estadoVinculacion && "Estado no definido"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Intentos de vinculación</h4>
                    <p>{comercial.intentosVinculacion || 0}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Último intento</h4>
                    <p>{formatDateTime(comercial.ultimoIntentoVinculacion)}</p>
                  </div>
                </div>

                {(comercial.estadoVinculacion !== 'completo' || !comercial.uid) && (
                  <div className="mt-4 bg-amber-50 p-4 rounded-md border border-amber-200">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-semibold text-amber-800">
                        Usuario no vinculado completamente
                      </h4>
                    </div>
                    <p className="text-amber-700 text-sm">
                      Este comercial no está correctamente vinculado con Firebase Authentication.
                      Esto puede limitar algunas funcionalidades como el inicio de sesión.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saldo y método de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Saldo Pendiente</h3>
                  <p className="text-lg font-semibold text-green-600">
                    {comercial.saldo ? `${comercial.saldo.toFixed(2)} €` : "0.00 €"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Comisiones Totales</h3>
                  <p className="text-lg font-semibold">
                    {comercial.comisionesTotales
                      ? `${comercial.comisionesTotales.toFixed(2)} €`
                      : "0.00 €"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Comisiones Pendientes
                  </h3>
                  <p className="text-lg font-semibold text-orange-600">
                    {comercial.comisionesPendientes
                      ? `${comercial.comisionesPendientes.toFixed(2)} €`
                      : "0.00 €"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Método de Pago</h3>
                {comercial.metodoPago ? (
                  <div className="bg-gray-50 p-3 rounded">
                    <Badge className="mb-2">
                      {comercial.metodoPago.tipo === "banco"
                        ? "Transferencia Bancaria"
                        : comercial.metodoPago.tipo === "paypal"
                        ? "PayPal"
                        : "Bizum"}
                    </Badge>

                    {comercial.metodoPago.tipo === "banco" && (
                      <div className="space-y-1">
                        <p className="text-sm">
                          <strong>Titular:</strong>{" "}
                          {comercial.metodoPago.datos.banco?.titular}
                        </p>
                        <p className="text-sm font-mono">
                          <strong>IBAN:</strong>{" "}
                          {comercial.metodoPago.datos.banco?.iban}
                        </p>
                        {comercial.metodoPago.datos.banco?.swift && (
                          <p className="text-sm font-mono">
                            <strong>SWIFT:</strong>{" "}
                            {comercial.metodoPago.datos.banco.swift}
                          </p>
                        )}
                      </div>
                    )}

                    {comercial.metodoPago.tipo === "paypal" && (
                      <p className="text-sm">
                        <strong>Email PayPal:</strong>{" "}
                        {comercial.metodoPago.datos.paypal?.email}
                      </p>
                    )}

                    {comercial.metodoPago.tipo === "bizum" && (
                      <p className="text-sm">
                        <strong>Teléfono Bizum:</strong>{" "}
                        {comercial.metodoPago.datos.bizum?.telefono}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No se ha configurado método de pago
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Clientes Captados
              </CardTitle>
              <CardDescription>
                Total: {clientes.length} clientes | {getTotalLitrosByComercialId(comercialId)}{" "}
                litros acumulados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Litros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">
                          {cliente.nombreCliente}
                        </TableCell>
                        <TableCell>
                          {formatDate(cliente.fechaRegistro)}
                        </TableCell>
                        <TableCell>{cliente.planContratado}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              cliente.estado === "activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {cliente.estado === "activo" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {cliente.litrosRecogidos} L
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Este comercial no tiene clientes captados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pagos y Comisiones
              </CardTitle>
              <CardDescription>
                Historial de comisiones y pagos del comercial
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-center py-10">
                <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Historial de comisiones no disponible en esta versión
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Se implementará en futuras actualizaciones
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default DetalleComercialDialog;
