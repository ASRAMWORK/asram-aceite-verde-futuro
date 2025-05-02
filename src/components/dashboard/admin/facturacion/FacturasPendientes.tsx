import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptIcon, Check, FileText, Euro } from "lucide-react";
import { Ingreso, Gasto } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useFacturacion } from "@/hooks/useFacturacion";

interface FacturasPendientesProps {
  ingresos: Ingreso[];
  gastos: Gasto[];
}

const formSchema = z.object({
  concepto: z.string().min(1, { message: "El concepto es obligatorio" }),
  cantidad: z.coerce.number().min(0.01, { message: "La cantidad debe ser mayor que cero" }),
  fecha: z.string().min(1, { message: "La fecha es obligatoria" }),
  cliente: z.string().optional(),
  proveedor: z.string().optional(),
  numFactura: z.string().optional(),
  categoria: z.string().min(1, { message: "La categoría es obligatoria" }),
  notas: z.string().optional(),
  tipo: z.string().optional(),
  origen: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const FacturasPendientes: React.FC<FacturasPendientesProps> = ({ ingresos, gastos }) => {
  const [activeTab, setActiveTab] = useState("ingresos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'ingreso' | 'gasto'>('ingreso');
  const { addIngreso, addGasto, updateFacturaEstado } = useFacturacion();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concepto: "",
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      cliente: "",
      proveedor: "",
      numFactura: "",
      categoria: "",
      notas: "",
    },
  });

  const ingresosPendientes = ingresos.filter(i => i.estado === 'pendiente');
  const gastosPendientes = gastos.filter(g => g.estado === 'pendiente');
  
  const totalPendientesCobro = ingresosPendientes.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPendientesPago = gastosPendientes.reduce((sum, g) => sum + g.cantidad, 0);
  
  const handleOpenDialog = (type: 'ingreso' | 'gasto') => {
    setDialogType(type);
    form.reset({
      concepto: "",
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      cliente: "",
      proveedor: "",
      numFactura: "",
      categoria: "",
      notas: "",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: FormValues) => {
    try {
      if (dialogType === 'ingreso') {
        await addIngreso({
          ...values,
          fecha: new Date(values.fecha),
          estado: 'pendiente'
        });
      } else {
        await addGasto({
          ...values,
          fecha: new Date(values.fecha),
          estado: 'pendiente'
        });
      }
      setIsDialogOpen(false);
      toast.success(`${dialogType === 'ingreso' ? 'Ingreso' : 'Gasto'} pendiente registrado correctamente`);
    } catch (error) {
      console.error("Error al crear factura pendiente:", error);
      toast.error("Error al registrar factura pendiente");
    }
  };
  
  const handleUpdateEstado = async (id: string, tipo: 'ingreso' | 'gasto', nuevoEstado: string) => {
    try {
      await updateFacturaEstado(id, tipo, nuevoEstado);
      toast.success(`Factura marcada como ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar estado de la factura");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Facturas Pendientes</h2>
          <p className="text-muted-foreground">Gestión de facturas pendientes de cobro o pago</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleOpenDialog('ingreso')}
            className="bg-green-600 hover:bg-green-700"
          >
            <ReceiptIcon className="h-4 w-4 mr-2" /> Nuevo Ingreso Pendiente
          </Button>
          <Button 
            onClick={() => handleOpenDialog('gasto')}
            className="bg-red-600 hover:bg-red-700"
          >
            <ReceiptIcon className="h-4 w-4 mr-2" /> Nuevo Gasto Pendiente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Pendiente de Cobro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {totalPendientesCobro.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {ingresosPendientes.length} facturas pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Pendiente de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalPendientesPago.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {gastosPendientes.length} facturas pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas Pendientes</CardTitle>
          <CardDescription>
            Revise y gestione las facturas pendientes de cobro o pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="ingresos" className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-green-600" />
                Pendientes de Cobro ({ingresosPendientes.length})
              </TabsTrigger>
              <TabsTrigger value="gastos" className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-red-600" />
                Pendientes de Pago ({gastosPendientes.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ingresos">
              {ingresosPendientes.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 text-left">Nº Factura</th>
                          <th className="p-2 text-left">Concepto</th>
                          <th className="p-2 text-left">Cliente</th>
                          <th className="p-2 text-left">Fecha</th>
                          <th className="p-2 text-left">Categoría</th>
                          <th className="p-2 text-right">Importe</th>
                          <th className="p-2 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingresosPendientes.map((ingreso) => (
                          <tr key={ingreso.id} className="border-t hover:bg-muted/50">
                            <td className="p-2 font-medium">
                              {ingreso.numeroFactura || 'Sin número'}
                            </td>
                            <td className="p-2">{ingreso.concepto}</td>
                            <td className="p-2">{ingreso.cliente || '-'}</td>
                            <td className="p-2">
                              {ingreso.fecha instanceof Date
                                ? ingreso.fecha.toLocaleDateString()
                                : new Date(ingreso.fecha).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {ingreso.categoria}
                              </Badge>
                            </td>
                            <td className="p-2 text-right font-medium">
                              {ingreso.cantidad.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="p-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateEstado(ingreso.id, 'ingreso', 'cobrada')}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4 mr-1" /> Marcar Cobrada
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-md">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No hay facturas pendientes de cobro</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Las facturas pendientes de cobro aparecerán aquí
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="gastos">
              {gastosPendientes.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 text-left">Nº Factura</th>
                          <th className="p-2 text-left">Concepto</th>
                          <th className="p-2 text-left">Proveedor</th>
                          <th className="p-2 text-left">Fecha</th>
                          <th className="p-2 text-left">Categoría</th>
                          <th className="p-2 text-right">Importe</th>
                          <th className="p-2 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gastosPendientes.map((gasto) => (
                          <tr key={gasto.id} className="border-t hover:bg-muted/50">
                            <td className="p-2 font-medium">
                              {gasto.numeroFactura || 'Sin número'}
                            </td>
                            <td className="p-2">{gasto.concepto}</td>
                            <td className="p-2">{gasto.proveedor || '-'}</td>
                            <td className="p-2">
                              {gasto.fecha instanceof Date
                                ? gasto.fecha.toLocaleDateString()
                                : new Date(gasto.fecha).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                {gasto.categoria}
                              </Badge>
                            </td>
                            <td className="p-2 text-right font-medium">
                              {gasto.cantidad.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="p-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateEstado(gasto.id, 'gasto', 'pagada')}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Check className="h-4 w-4 mr-1" /> Marcar Pagada
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-md">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No hay facturas pendientes de pago</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Las facturas pendientes de pago aparecerán aquí
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Put the Dialog outside of any nested components to avoid context issues */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'ingreso' 
                ? 'Nuevo Ingreso Pendiente' 
                : 'Nuevo Gasto Pendiente'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos para registrar un{dialogType === 'ingreso' ? ' ingreso' : ' gasto'} pendiente
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="concepto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concepto*</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe el concepto de la factura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cantidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Importe*</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {dialogType === 'ingreso' ? (
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="proveedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del proveedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numFactura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Factura</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: F-2023/123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dialogType === 'ingreso' ? (
                            <>
                              <SelectItem value="venta">Venta</SelectItem>
                              <SelectItem value="servicio">Servicio</SelectItem>
                              <SelectItem value="subvención">Subvención</SelectItem>
                              <SelectItem value="proyecto">Proyecto</SelectItem>
                              <SelectItem value="donación">Donación</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="compra">Compra</SelectItem>
                              <SelectItem value="servicio">Servicio</SelectItem>
                              <SelectItem value="alquiler">Alquiler</SelectItem>
                              <SelectItem value="impuestos">Impuestos</SelectItem>
                              <SelectItem value="nómina">Nómina</SelectItem>
                              <SelectItem value="transporte">Transporte</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales sobre la factura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacturasPendientes;
