import React, { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GestionRetiradas = () => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [distrito, setDistrito] = useState<string | undefined>(undefined);
  const [contenedoresRecogidos, setContenedoresRecogidos] = useState("0");
  const [notas, setNotas] = useState("");
  const [activeTab, setActiveTab] = useState("pendientes");
  const [filtroDistrito, setFiltroDistrito] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [retiradaACompletar, setRetiradaACompletar] = useState<string | null>(null);
  const [showCompletarDialog, setShowCompletarDialog] = useState(false);
  
  const { rutas, loading, addRuta, completeRuta } = useRutas();

  // Filtrar rutas según estado (completada), distrito y búsqueda
  const filtrarRutas = (completada: boolean) => {
    return rutas.filter(ruta => {
      // Filtrar por estado de completitud
      const matchCompletada = completada === ruta.completada;
      
      // Filtrar por distrito
      const matchDistrito = filtroDistrito === 'todos' ? true : ruta.distrito === filtroDistrito;
      
      // Filtrar por búsqueda (distrito o fecha)
      const fechaFormateada = ruta.fecha ? format(ruta.fecha, "dd/MM/yyyy") : '';
      const matchBusqueda = busqueda 
        ? ruta.distrito.toLowerCase().includes(busqueda.toLowerCase()) || 
          fechaFormateada.includes(busqueda)
        : true;
      
      return matchCompletada && matchDistrito && matchBusqueda;
    });
  };

  const rutasPendientes = filtrarRutas(false);
  const rutasCompletadas = filtrarRutas(true);
  const todasLasRutas = rutas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !distrito || isNaN(parseInt(contenedoresRecogidos))) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }
    
    // Crear nueva ruta
    const nuevaRuta = {
      nombre: `Retirada ${distrito} ${format(date, "dd/MM/yyyy")}`,
      fecha: date,
      distrito: distrito,
      barrios: [],
      hora: "",
      recogedores: "",
      clientes: [],
      puntosRecogida: parseInt(contenedoresRecogidos),
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: "puntual",
      completada: false,
      litrosTotales: 0,
      puntos: [], // Add the missing puntos property
      updatedAt: new Date(), // Add the missing updatedAt property
      createdAt: new Date() // Added the missing createdAt property
    };
    
    addRuta(nuevaRuta);
    
    // Reset form
    setShowForm(false);
    setDistrito(undefined);
    setContenedoresRecogidos("0");
    setNotas("");
  };

  const handleCompletarClick = (id: string) => {
    setRetiradaACompletar(id);
    setShowCompletarDialog(true);
  };

  const confirmCompletar = async () => {
    if (retiradaACompletar) {
      await completeRuta(retiradaACompletar, 0);
      setShowCompletarDialog(false);
      setRetiradaACompletar(null);
    }
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
      
      <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            className="max-w-sm" 
            placeholder="Buscar por distrito o fecha..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Cargando...</TableCell>
                    </TableRow>
                  ) : rutasPendientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No hay retiradas pendientes</TableCell>
                    </TableRow>
                  ) : (
                    rutasPendientes.map((ruta) => (
                      <TableRow key={ruta.id}>
                        <TableCell className="font-medium">{ruta.id.substring(0, 6)}</TableCell>
                        <TableCell>{ruta.fecha ? format(ruta.fecha, "dd/MM/yyyy") : 'N/A'}</TableCell>
                        <TableCell>{ruta.distrito}</TableCell>
                        <TableCell>{ruta.puntosRecogida}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Pendiente
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCompletarClick(ruta.id)}
                          >
                            Completar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Cargando...</TableCell>
                    </TableRow>
                  ) : rutasCompletadas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No hay retiradas completadas</TableCell>
                    </TableRow>
                  ) : (
                    rutasCompletadas.map((ruta) => (
                      <TableRow key={ruta.id}>
                        <TableCell className="font-medium">{ruta.id.substring(0, 6)}</TableCell>
                        <TableCell>{ruta.fecha ? format(ruta.fecha, "dd/MM/yyyy") : 'N/A'}</TableCell>
                        <TableCell>{ruta.distrito}</TableCell>
                        <TableCell>{ruta.puntosRecogida}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Completada
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Ver detalles</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Cargando...</TableCell>
                    </TableRow>
                  ) : todasLasRutas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No hay retiradas registradas</TableCell>
                    </TableRow>
                  ) : (
                    todasLasRutas.map((ruta) => (
                      <TableRow key={ruta.id}>
                        <TableCell className="font-medium">{ruta.id.substring(0, 6)}</TableCell>
                        <TableCell>{ruta.fecha ? format(ruta.fecha, "dd/MM/yyyy") : 'N/A'}</TableCell>
                        <TableCell>{ruta.distrito}</TableCell>
                        <TableCell>{ruta.puntosRecogida}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ruta.completada
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ruta.completada ? 'Completada' : 'Pendiente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {!ruta.completada ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCompletarClick(ruta.id)}
                            >
                              Completar
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">Ver detalles</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para completar retirada */}
      <AlertDialog open={showCompletarDialog} onOpenChange={setShowCompletarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Completar retirada</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea marcar esta retirada como completada? 
              Esta acción moverá el registro a la lista de retiradas completadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompletar}>Completar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionRetiradas;
