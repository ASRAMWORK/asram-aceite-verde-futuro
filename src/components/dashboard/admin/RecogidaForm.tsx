
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientes } from '@/hooks/useClientes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/ui/card';

interface RecogidaFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const formSchema = z.object({
  nombreContacto: z.string().min(2, "El nombre es requerido"),
  telefonoContacto: z.string().optional(),
  emailContacto: z.string().email("Email inválido").optional().or(z.literal("")),
  direccionRecogida: z.string().min(5, "La dirección es requerida"),
  distrito: z.string().optional(),
  barrio: z.string().optional(),
  fechaRecogida: z.date(),
  horaRecogida: z.string(),
  cantidadAproximada: z.number().min(0),
  tipoAceite: z.string(),
  notasAdicionales: z.string().optional()
});

const RecogidaForm: React.FC<RecogidaFormProps> = ({ onCancel, onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState<string>("personalizada");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [distritoFilter, setDistritoFilter] = useState<string>("");
  const [selectedClientes, setSelectedClientes] = useState<any[]>([]);
  
  const { clientes, getDistritosUnicos } = useClientes();
  const distritos = getDistritosUnicos();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombreContacto: '',
      telefonoContacto: '',
      emailContacto: '',
      direccionRecogida: '',
      distrito: '',
      barrio: '',
      fechaRecogida: new Date(),
      horaRecogida: '10:00',
      cantidadAproximada: 0,
      tipoAceite: 'vegetal',
      notasAdicionales: '',
    },
  });

  // Filter clients based on search and distrito filter
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = !debouncedSearchTerm || 
      cliente.nombre?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      cliente.direccion?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
    const matchesDistrito = !distritoFilter || cliente.distrito === distritoFilter;
    
    return matchesSearch && matchesDistrito;
  });

  const handleSubmit = (data: any) => {
    if (activeTab === "personalizada") {
      onSubmit({
        ...data,
        fecha: data.fechaRecogida,
      });
    } else {
      // Ruta por distrito
      onSubmit({
        fecha: data.fechaRecogida,
        hora: data.horaRecogida,
        distrito: distritoFilter,
        esRecogidaZona: true,
        clientesRuta: selectedClientes,
      });
    }
  };

  const handleAddCliente = (cliente: any) => {
    if (!selectedClientes.some(c => c.id === cliente.id)) {
      setSelectedClientes([...selectedClientes, { 
        ...cliente,
        litrosEstimados: cliente.litrosAceite || 0,
      }]);
    }
  };

  const handleRemoveCliente = (id: string) => {
    setSelectedClientes(selectedClientes.filter(c => c.id !== id));
  };

  return (
    <Tabs defaultValue="personalizada" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="personalizada">Recogida Personalizada</TabsTrigger>
        <TabsTrigger value="distrito">Recogida por Distrito</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personalizada">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nombreContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefonoContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de teléfono" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Correo electrónico" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="direccionRecogida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de recogida</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, número, piso..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distrito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un distrito" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Seleccionar distrito</SelectItem>
                        {distritos.map(distrito => (
                          <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="barrio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barrio</FormLabel>
                    <FormControl>
                      <Input placeholder="Barrio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fechaRecogida"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de recogida</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="horaRecogida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de recogida</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cantidadAproximada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad aproximada (litros)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoAceite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de aceite</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetal">Aceite vegetal</SelectItem>
                        <SelectItem value="oliva">Aceite de oliva</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notasAdicionales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Información adicional sobre la recogida" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="distrito">
        <div className="space-y-4">
          <Form {...form}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <FormLabel>Fecha de recogida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {form.getValues("fechaRecogida") ? (
                          format(form.getValues("fechaRecogida"), "P", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.getValues("fechaRecogida")}
                        onSelect={(date) => form.setValue("fechaRecogida", date as Date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Hora de recogida</FormLabel>
                  <Input 
                    type="time" 
                    value={form.getValues("horaRecogida")}
                    onChange={(e) => form.setValue("horaRecogida", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Distrito</FormLabel>
                  <Select value={distritoFilter} onValueChange={setDistritoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los distritos</SelectItem>
                      {distritos.map(distrito => (
                        <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Buscar clientes</FormLabel>
                  <Input 
                    placeholder="Nombre o dirección del cliente" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Card className="p-4 overflow-auto max-h-96">
                <h3 className="text-lg font-medium mb-2">Clientes disponibles</h3>
                {filteredClientes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell>{cliente.nombre}</TableCell>
                          <TableCell className="hidden md:table-cell">{cliente.direccion}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleAddCliente(cliente)}
                              variant="outline"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No hay clientes disponibles con los filtros seleccionados
                  </p>
                )}
              </Card>
            </div>
          </Form>
          
          <div className="mt-6 border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Clientes seleccionados para la ruta</h3>
            {selectedClientes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Litros estimados</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.direccion}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={cliente.litrosEstimados || 0}
                          onChange={(e) => {
                            const updatedClientes = selectedClientes.map(c => 
                              c.id === cliente.id ? { ...c, litrosEstimados: Number(e.target.value) } : c
                            );
                            setSelectedClientes(updatedClientes);
                          }}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleRemoveCliente(cliente.id)}
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No has seleccionado ningún cliente para esta ruta
              </p>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={() => handleSubmit(form.getValues())}
                disabled={selectedClientes.length === 0}
              >
                Guardar Ruta
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RecogidaForm;
