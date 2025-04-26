import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecogidas } from "@/hooks/useRecogidas";
import { useUsuarios } from "@/hooks/useUsuarios";
import type { Recogida } from "@/types";
import { 
  Calendar, 
  Check, 
  Clock, 
  FilePlus2, 
  Filter, 
  Loader2, 
  MapPin, 
  PenLine, 
  Trash2, 
  Users 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const distritos = [
  "Centro", "Arganzuela", "Retiro", "Salamanca", "Chamartín", 
  "Tetuán", "Chamberí", "Fuencarral-El Pardo", "Moncloa-Aravaca", 
  "Latina", "Carabanchel", "Usera", "Puente de Vallecas", 
  "Moratalaz", "Ciudad Lineal", "Hortaleza", "Villaverde",
  "Villa de Vallecas", "Vicálvaro", "San Blas-Canillejas", "Barajas"
];

const barrios: Record<string, string[]> = {
  "Centro": ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
  "Arganzuela": ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
  // Add more barrios for each distrito as needed
};

type RecogidaFormData = {
  clienteId: string;
  fecha: string;
  hora: string;
  distrito: string;
  barrio: string;
  tipoBusqueda: "cliente" | "zona";
};

const GestionRecogidas = () => {
  const { recogidas, loading, addRecogida, updateRecogida, deleteRecogida, completeRecogida } = useRecogidas();
  const { usuarios } = useUsuarios();
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [isEditingRecogida, setIsEditingRecogida] = useState(false);
  const [isCompletingRecogida, setIsCompletingRecogida] = useState(false);
  const [selectedRecogida, setSelectedRecogida] = useState<Recogida | null>(null);
  const [currentTab, setCurrentTab] = useState("pendientes");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [litrosRecogidos, setLitrosRecogidos] = useState<number>(0);
  
  const [formData, setFormData] = useState<RecogidaFormData>({
    clienteId: "",
    fecha: "",
    hora: "",
    distrito: "",
    barrio: "",
    tipoBusqueda: "cliente"
  });
  
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [filteredClientes, setFilteredClientes] = useState(usuarios);
  
  const filteredRecogidas = currentTab === "pendientes"
    ? recogidas.filter(r => r.estado === "pendiente")
    : recogidas.filter(r => r.estado === "realizada");
  
  const displayedRecogidas = filterDistrito
    ? filteredRecogidas.filter(r => r.distrito === filterDistrito)
    : filteredRecogidas;
  
  const handleDistritoChange = (value: string) => {
    setFormData({
      ...formData,
      distrito: value,
      barrio: ""
    });
    setFilteredBarrios(barrios[value] || []);
    
    if (formData.tipoBusqueda === "zona") {
      const clientesFiltrados = usuarios.filter(u => u.distrito === value);
      setFilteredClientes(clientesFiltrados);
    }
  };
  
  const handleFilterDistritoChange = (value: string) => {
    setFilterDistrito(value);
  };
  
  const handleBarrioChange = (value: string) => {
    setFormData({
      ...formData,
      barrio: value
    });
    
    if (formData.tipoBusqueda === "zona") {
      const clientesFiltrados = usuarios.filter(u => 
        u.distrito === formData.distrito && u.barrio === value
      );
      setFilteredClientes(clientesFiltrados);
    }
  };
  
  const handleTipoBusquedaChange = (value: "cliente" | "zona") => {
    setFormData({
      ...formData,
      tipoBusqueda: value
    });
    
    if (value === "zona") {
      setFormData({
        ...formData,
        clienteId: "",
        tipoBusqueda: value
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === "clienteId") {
      const cliente = usuarios.find(u => u.id === value);
      if (cliente) {
        setFormData({
          ...formData,
          clienteId: value,
          distrito: cliente.distrito || "",
          barrio: cliente.barrio || ""
        });
        
        if (cliente.distrito) {
          setFilteredBarrios(barrios[cliente.distrito] || []);
        }
      }
    }
  };
  
  const handleLitrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLitrosRecogidos(parseInt(e.target.value) || 0);
  };
  
  const handleOpenEditDialog = (recogida: Recogida) => {
    setSelectedRecogida(recogida);
    setFormData({
      clienteId: recogida.clienteId || "",
      fecha: recogida.fecha ? format(new Date(recogida.fecha), "yyyy-MM-dd") : "",
      hora: recogida.hora || recogida.horaInicio || "",
      distrito: recogida.distrito || "",
      barrio: recogida.barrio || "",
      tipoBusqueda: "cliente"
    });
    
    if (recogida.distrito) {
      setFilteredBarrios(barrios[recogida.distrito] || []);
    }
    
    setIsEditingRecogida(true);
  };
  
  const handleOpenCompleteDialog = (recogida: Recogida) => {
    setSelectedRecogida(recogida);
    setLitrosRecogidos(0);
    setIsCompletingRecogida(true);
  };
  
  const resetForm = () => {
    setFormData({
      clienteId: "",
      fecha: "",
      hora: "",
      distrito: "",
      barrio: "",
      tipoBusqueda: "cliente"
    });
    setFilteredBarrios([]);
    setFilteredClientes(usuarios);
    setSelectedRecogida(null);
  };
  
  const handleSubmit = async () => {
    if (formData.tipoBusqueda === "cliente" && !formData.clienteId) {
      alert("Por favor selecciona un cliente");
      return;
    }
    
    if (!formData.fecha || !formData.hora || !formData.distrito) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    try {
      const fechaObj = new Date(formData.fecha);
      
      // Since we're using the updated Recogida interface, we format our data to match it
      const recogidaData: Omit<Recogida, "id"> = {
        clienteId: formData.clienteId,
        fecha: fechaObj,
        fechaSolicitud: fechaObj,
        fechaProgramada: fechaObj,
        fechaCompletada: null,
        nombreLugar: formData.distrito,
        direccion: formData.distrito,
        distrito: formData.distrito,
        barrio: formData.barrio,
        hora: formData.hora,
        horaInicio: formData.hora,
        tipo: formData.tipoBusqueda,
        estado: "pendiente",
        litrosRecogidos: 0,
        litrosEstimados: 0,
        createdAt: new Date(),
        telefono: "",
      };
      
      await addRecogida(recogidaData);
      
      setIsAddingRecogida(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear recogida:", error);
      alert("Error al crear la recogida");
    }
  };
  
  const handleEdit = async () => {
    if (!selectedRecogida) return;
    if (!formData.fecha || !formData.hora || !formData.distrito) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    try {
      const fechaObj = new Date(formData.fecha);
      
      const updatedData: Partial<Recogida> = {
        ...selectedRecogida,
        fecha: fechaObj,
        fechaProgramada: fechaObj,
        clienteId: formData.clienteId,
        distrito: formData.distrito,
        barrio: formData.barrio,
        hora: formData.hora,
        horaInicio: formData.hora,
      };
      
      await updateRecogida(selectedRecogida.id, updatedData);
      
      setIsEditingRecogida(false);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar recogida:", error);
      alert("Error al actualizar la recogida");
    }
  };
  
  const handleComplete = async () => {
    if (!selectedRecogida) return;
    
    try {
      await completeRecogida(selectedRecogida.id, litrosRecogidos);
      setIsCompletingRecogida(false);
      resetForm();
    } catch (error) {
      console.error("Error al completar recogida:", error);
      alert("Error al completar la recogida");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta recogida?")) {
      try {
        await deleteRecogida(id);
      } catch (error) {
        console.error("Error al eliminar recogida:", error);
        alert("Error al eliminar la recogida");
      }
    }
  };
  
  const getClienteName = (clienteId: string) => {
    const cliente = usuarios.find(u => u.id === clienteId);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Recogidas</h2>
          <p className="text-muted-foreground">
            Programa y gestiona las recogidas de aceite usado
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Programar Recogida
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Programar nueva recogida</DialogTitle>
                <DialogDescription>
                  Programa una recogida individual o por zona para nuestros clientes
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de búsqueda</Label>
                  <div className="flex space-x-4">
                    <Button 
                      type="button"
                      variant={formData.tipoBusqueda === "cliente" ? "default" : "outline"}
                      className={formData.tipoBusqueda === "cliente" ? "bg-asram hover:bg-asram-700" : ""}
                      onClick={() => handleTipoBusquedaChange("cliente")}
                    >
                      Por cliente
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.tipoBusqueda === "zona" ? "default" : "outline"}
                      className={formData.tipoBusqueda === "zona" ? "bg-asram hover:bg-asram-700" : ""}
                      onClick={() => handleTipoBusquedaChange("zona")}
                    >
                      Por zona
                    </Button>
                  </div>
                </div>
                
                {formData.tipoBusqueda === "cliente" ? (
                  <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente</Label>
                    <Select
                      value={formData.clienteId}
                      onValueChange={(value) => handleSelectChange("clienteId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nombre} - {usuario.direccion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="distrito">Distrito</Label>
                      <Select
                        value={formData.distrito}
                        onValueChange={handleDistritoChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {distritos.map((distrito) => (
                            <SelectItem key={distrito} value={distrito}>
                              {distrito}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barrio">Barrio</Label>
                      <Select
                        value={formData.barrio}
                        onValueChange={handleBarrioChange}
                        disabled={!formData.distrito}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona barrio" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredBarrios.map((barrio) => (
                            <SelectItem key={barrio} value={barrio}>
                              {barrio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {formData.tipoBusqueda === "zona" && filteredClientes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Clientes en la zona seleccionada ({filteredClientes.length})</Label>
                    <div className="h-32 overflow-y-auto border rounded-md p-2">
                      <ul className="space-y-1">
                        {filteredClientes.map((cliente) => (
                          <li key={cliente.id} className="text-sm">
                            {cliente.nombre} - {cliente.direccion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de recogida</Label>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora aproximada</Label>
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      value={formData.hora}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingRecogida(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-asram hover:bg-asram-700"
                  onClick={handleSubmit}
                >
                  Programar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Recogidas</CardTitle>
          <CardDescription>
            Gestiona las recogidas programadas y completa las recogidas realizadas
          </CardDescription>
          
          <div className="flex justify-between items-center mt-4">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="completadas">Completadas</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterDistrito} onValueChange={handleFilterDistritoChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente/Zona</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Distrito/Barrio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    {currentTab === "completadas" && <TableHead>Litros Recogidos</TableHead>}
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRecogidas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={currentTab === "completadas" ? 7 : 6} className="text-center">
                        No hay recogidas {currentTab === "pendientes" ? "pendientes" : "completadas"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedRecogidas.map((recogida) => (
                      <TableRow key={recogida.id}>
                        <TableCell>
                          {recogida.tipo === "individual" 
                            ? getClienteName(recogida.clienteId || "")
                            : `Recogida por zona`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {recogida.tipo === "individual" ? "Individual" : "Zona"}
                          </Badge>
                        </TableCell>
                        <TableCell>{recogida.distrito} / {recogida.barrio}</TableCell>
                        <TableCell>
                          {recogida.fecha 
                            ? new Date(recogida.fecha).toLocaleDateString() 
                            : "No programada"}
                        </TableCell>
                        <TableCell>{recogida.hora}</TableCell>
                        {currentTab === "completadas" && (
                          <TableCell>{recogida.litrosRecogidos || 0}L</TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1">
                            {currentTab === "pendientes" ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleOpenEditDialog(recogida)}
                                >
                                  <PenLine className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleOpenCompleteDialog(recogida)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleDelete(recogida.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {displayedRecogidas.length} recogidas {currentTab === "pendientes" ? "pendientes" : "completadas"}
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isCompletingRecogida} onOpenChange={setIsCompletingRecogida}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Completar recogida</DialogTitle>
            <DialogDescription>
              Registra los litros de aceite recogidos para esta recogida
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Cliente/Zona:</p>
                <p>{selectedRecogida?.tipo === "individual" 
                  ? getClienteName(selectedRecogida?.clienteId || "")
                  : `Recogida por zona`}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Distrito/Barrio:</p>
                <p>{selectedRecogida?.distrito} / {selectedRecogida?.barrio}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Fecha:</p>
                <p>{selectedRecogida?.fecha 
                  ? new Date(selectedRecogida.fecha).toLocaleDateString() 
                  : "No programada"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Hora:</p>
                <p>{selectedRecogida?.hora || selectedRecogida?.horaInicio}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="litrosRecogidos">Litros recogidos</Label>
              <Input
                id="litrosRecogidos"
                name="litrosRecogidos"
                type="number"
                value={litrosRecogidos}
                onChange={handleLitrosChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCompletingRecogida(false);
                setLitrosRecogidos(0);
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-asram hover:bg-asram-700"
              onClick={handleComplete}
            >
              Completar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingRecogida} onOpenChange={setIsEditingRecogida}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar recogida</DialogTitle>
            <DialogDescription>
              Modifica los datos de la recogida programada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de búsqueda</Label>
              <div className="flex space-x-4">
                <Button 
                  type="button"
                  variant={formData.tipoBusqueda === "cliente" ? "default" : "outline"}
                  className={formData.tipoBusqueda === "cliente" ? "bg-asram hover:bg-asram-700" : ""}
                  onClick={() => handleTipoBusquedaChange("cliente")}
                >
                  Por cliente
                </Button>
                <Button 
                  type="button"
                  variant={formData.tipoBusqueda === "zona" ? "default" : "outline"}
                  className={formData.tipoBusqueda === "zona" ? "bg-asram hover:bg-asram-700" : ""}
                  onClick={() => handleTipoBusquedaChange("zona")}
                >
                  Por zona
                </Button>
              </div>
            </div>
            
            {formData.tipoBusqueda === "cliente" ? (
              <div className="space-y-2">
                <Label htmlFor="clienteId-edit">Cliente</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => handleSelectChange("clienteId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre} - {usuario.direccion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distrito-edit">Distrito</Label>
                  <Select
                    value={formData.distrito}
                    onValueChange={handleDistritoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((distrito) => (
                        <SelectItem key={distrito} value={distrito}>
                          {distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barrio-edit">Barrio</Label>
                  <Select
                    value={formData.barrio}
                    onValueChange={handleBarrioChange}
                    disabled={!formData.distrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona barrio" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBarrios.map((barrio) => (
                        <SelectItem key={barrio} value={barrio}>
                          {barrio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {formData.tipoBusqueda === "zona" && filteredClientes.length > 0 && (
              <div className="space-y-2">
                <Label>Clientes en la zona seleccionada ({filteredClientes.length})</Label>
                <div className="h-32 overflow-y-auto border rounded-md p-2">
                  <ul className="space-y-1">
                    {filteredClientes.map((cliente) => (
                      <li key={cliente.id} className="text-sm">
                        {cliente.nombre} - {cliente.direccion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-edit">Fecha de recogida</Label>
                <Input
                  id="fecha-edit"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora-edit">Hora aproximada</Label>
                <Input
                  id="hora-edit"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingRecogida(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-asram hover:bg-asram-700"
              onClick={handleEdit}
            >
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionRecogidas;
