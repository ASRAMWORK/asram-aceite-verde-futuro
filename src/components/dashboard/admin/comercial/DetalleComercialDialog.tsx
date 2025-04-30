
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, User } from "lucide-react";
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import { useComisiones } from "@/hooks/useComisiones";
import ComercialForm from "./ComercialForm";

interface DetalleComercialDialogProps {
  comercialId: string;
  open: boolean;
  onClose: () => void;
}

const DetalleComercialDialog = ({ comercialId, open, onClose }: DetalleComercialDialogProps) => {
  const { getComercialById } = useComerciales();
  const { clientes, getClientesByComercialId } = useClientesCaptados();
  const { comisiones, getComisionesByComercialId } = useComisiones();
  const [editMode, setEditMode] = React.useState(false);

  const comercial = getComercialById(comercialId);
  const clientesComercial = getClientesByComercialId(comercialId);
  const comisionesComercial = getComisionesByComercialId(comercialId);

  if (!comercial) {
    return null;
  }

  if (editMode) {
    return (
      <Dialog open={open} onOpenChange={() => {
        setEditMode(false);
        onClose();
      }}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <ComercialForm 
            comercialId={comercialId}
            onClose={() => setEditMode(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Detalle de Comercial: {comercial.nombre} {comercial.apellidos}
            </DialogTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditMode(true)}
              title="Editar comercial"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Información completa y actividad del comercial
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{comercial.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{comercial.telefono || "No disponible"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Código de referido</p>
              <p className="font-mono font-medium">{comercial.codigo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge
                  variant={comercial.activo ? "default" : "outline"}
                  className={comercial.activo ? "bg-green-600" : ""}
                >
                  {comercial.activo ? "Activo" : "Inactivo"}
                </Badge>
                <Badge
                  variant={comercial.aprobado ? "default" : "outline"}
                  className={comercial.aprobado ? "bg-blue-600" : "bg-amber-600"}
                >
                  {comercial.aprobado ? "Aprobado" : "Pendiente"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de registro</p>
              <p className="font-medium">{comercial.fechaRegistro.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Comisión personalizada</p>
              <p className="font-medium">
                {comercial.datosPersonalizados?.comision 
                  ? `${comercial.datosPersonalizados.comision}%` 
                  : "Estándar"}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="clientes">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="clientes">Clientes captados</TabsTrigger>
            <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
            <TabsTrigger value="pagos">Método de pago</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clientes" className="space-y-4">
            {clientesComercial.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Fecha registro</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Litros recogidos</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientesComercial.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell className="font-medium">{cliente.nombreCliente}</TableCell>
                          <TableCell>{cliente.fechaRegistro.toLocaleDateString()}</TableCell>
                          <TableCell>{cliente.planContratado}</TableCell>
                          <TableCell>{cliente.litrosRecogidos} L</TableCell>
                          <TableCell>
                            <Badge variant={cliente.estado === 'activo' ? 'default' : 'outline'} className={
                              cliente.estado === 'activo' ? 'bg-green-600' : ''
                            }>
                              {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Este comercial no ha captado ningún cliente aún</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comisiones" className="space-y-4">
            {comisionesComercial.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Litros</TableHead>
                        <TableHead>Importe</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comisionesComercial.map((comision) => (
                        <TableRow key={comision.id}>
                          <TableCell className="font-medium">{comision.nombreCliente}</TableCell>
                          <TableCell>{comision.litrosRecogidos} L</TableCell>
                          <TableCell>{comision.importe.toFixed(2)} €</TableCell>
                          <TableCell>
                            <Badge variant={comision.estado === 'abonado' ? 'default' : 'outline'} className={
                              comision.estado === 'abonado' ? 'bg-green-600' : 'bg-amber-600'
                            }>
                              {comision.estado === 'abonado' ? 'Abonado' : 'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell>{comision.fecha.toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <tfoot>
                      <tr>
                        <td colSpan={2} className="px-4 py-2 font-bold">Total</td>
                        <td className="px-4 py-2 font-bold">
                          {comisionesComercial.reduce((acc, c) => acc + c.importe, 0).toFixed(2)} €
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Este comercial no ha generado ninguna comisión aún</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pagos" className="space-y-4">
            {comercial.metodoPago ? (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Método de pago</h3>
                
                {comercial.metodoPago.tipo === 'banco' && comercial.metodoPago.datos.banco && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-medium">Transferencia bancaria</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Titular</p>
                      <p className="font-medium">{comercial.metodoPago.datos.banco.titular}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IBAN</p>
                      <p className="font-medium font-mono">{comercial.metodoPago.datos.banco.iban}</p>
                    </div>
                    {comercial.metodoPago.datos.banco.swift && (
                      <div>
                        <p className="text-sm text-gray-500">SWIFT/BIC</p>
                        <p className="font-medium font-mono">{comercial.metodoPago.datos.banco.swift}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {comercial.metodoPago.tipo === 'paypal' && comercial.metodoPago.datos.paypal && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-medium">PayPal</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{comercial.metodoPago.datos.paypal.email}</p>
                    </div>
                  </div>
                )}
                
                {comercial.metodoPago.tipo === 'bizum' && comercial.metodoPago.datos.bizum && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-medium">Bizum</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{comercial.metodoPago.datos.bizum.telefono}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">El comercial no ha configurado ningún método de pago</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DetalleComercialDialog;
