import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRutas } from "@/hooks/useRutas";

const GestionRetiradas = () => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [distrito, setDistrito] = useState<string | undefined>(undefined);
  const [contenedoresRecogidos, setContenedoresRecogidos] = useState("0");
  const [notas, setNotas] = useState("");
  const { rutas, loading } = useRutas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !distrito || isNaN(parseInt(contenedoresRecogidos))) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }
    
    // Process form data here
    console.log({
      date,
      distrito,
      contenedoresRecogidos: parseInt(contenedoresRecogidos),
      notas
    });
    
    toast.success("Retirada registrada correctamente");
    
    // Reset form
    setShowForm(false);
    setDistrito(undefined);
    setContenedoresRecogidos("0");
    setNotas("");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Retiradas de Contenedores</h2>
          <p className="text-muted-foreground">
            Gestión de retiradas de contenedores por distritos
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nueva Retirada</span>
        </Button>
      </div>
      
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Retirada de Contenedores</CardTitle>
            <CardDescription>Registre los datos de la retirada</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Seleccione una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distrito</label>
                  <Select value={distrito} onValueChange={setDistrito}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="chamberi">Chamberí</SelectItem>
                      <SelectItem value="salamanca">Salamanca</SelectItem>
                      <SelectItem value="retiro">Retiro</SelectItem>
                      <SelectItem value="chamartin">Chamartín</SelectItem>
                      <SelectItem value="tetuan">Tetuán</SelectItem>
                      <SelectItem value="moncloa">Moncloa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenedores recogidos</label>
                <Input 
                  type="number" 
                  min="0"
                  value={contenedoresRecogidos} 
                  onChange={(e) => setContenedoresRecogidos(e.target.value)}
                  placeholder="Número de contenedores"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas</label>
                <Input 
                  value={notas} 
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Observaciones sobre la retirada"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="pendientes">
        <TabsList className="mb-4">
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input className="max-w-sm" placeholder="Buscar por distrito o fecha..." />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por distrito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="centro">Centro</SelectItem>
              <SelectItem value="chamberi">Chamberí</SelectItem>
              <SelectItem value="salamanca">Salamanca</SelectItem>
              <SelectItem value="retiro">Retiro</SelectItem>
              <SelectItem value="chamartin">Chamartín</SelectItem>
              <SelectItem value="tetuan">Tetuán</SelectItem>
              <SelectItem value="moncloa">Moncloa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="pendientes">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableCaption>Lista de retiradas pendientes</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Contenedores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">RET-001</TableCell>
                    <TableCell>{format(new Date(), "dd/MM/yyyy")}</TableCell>
                    <TableCell>Centro</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendiente
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Completar</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">RET-002</TableCell>
                    <TableCell>{format(new Date(), "dd/MM/yyyy")}</TableCell>
                    <TableCell>Salamanca</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendiente
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Completar</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableCaption>Lista de retiradas completadas</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Contenedores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">RET-003</TableCell>
                    <TableCell>{format(new Date(Date.now() - 86400000), "dd/MM/yyyy")}</TableCell>
                    <TableCell>Chamberí</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Completada
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Ver detalles</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="todas">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableCaption>Lista de todas las retiradas</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Contenedores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* All retiradas would be listed here */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionRetiradas;
