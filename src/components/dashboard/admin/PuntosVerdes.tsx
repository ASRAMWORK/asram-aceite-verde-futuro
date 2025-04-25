import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { toast } from "sonner";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  getDocs, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PuntoVerde, DistritoBarrio } from "@/types";

const distritos: DistritoBarrio[] = [
  { 
    distrito: "Centro", 
    barrios: ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"] 
  },
  { 
    distrito: "Arganzuela", 
    barrios: ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"] 
  },
  // More districts would be added in a full implementation
];

const PuntosVerdes = () => {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  
  const [newPoint, setNewPoint] = useState({
    distrito: "",
    barrio: "",
    direccion: "",
    numViviendas: 0,
    numContenedores: 0,
    telefono: "",
  });
  
  const handleDistritoChange = (value: string) => {
    setSelectedDistrito(value);
    const distrito = distritos.find(d => d.distrito === value);
    setFilteredBarrios(distrito?.barrios || []);
    setNewPoint({
      ...newPoint,
      distrito: value,
      barrio: "",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPoint({
      ...newPoint,
      [name]: name === "numViviendas" || name === "numContenedores" 
        ? parseInt(value) 
        : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewPoint({
      ...newPoint,
      [name]: value,
    });
  };
  
  const loadPuntosVerdes = async () => {
    setLoadingPoints(true);
    try {
      const q = query(
        collection(db, "puntosVerdes"),
        orderBy("distrito"),
        orderBy("barrio")
      );
      
      const querySnapshot = await getDocs(q);
      const points: PuntoVerde[] = [];
      
      querySnapshot.forEach((doc) => {
        points.push({
          id: doc.id,
          ...doc.data()
        } as PuntoVerde);
      });
      
      setPuntosVerdes(points);
    } catch (error) {
      console.error("Error loading puntos verdes:", error);
      toast.error("Error al cargar los puntos verdes");
    } finally {
      setLoadingPoints(false);
    }
  };
  
  const handleAddPoint = async () => {
    try {
      if (!newPoint.distrito || !newPoint.barrio || !newPoint.direccion || !newPoint.telefono) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }
      
      await addDoc(collection(db, "puntosVerdes"), {
        ...newPoint,
        litrosRecogidos: 0,
        createdAt: serverTimestamp(),
      });
      
      toast.success("Punto verde añadido correctamente");
      setIsAddingPoint(false);
      
      setNewPoint({
        distrito: "",
        barrio: "",
        direccion: "",
        numViviendas: 0,
        numContenedores: 0,
        telefono: "",
      });
      
      loadPuntosVerdes();
    } catch (error) {
      console.error("Error adding punto verde:", error);
      toast.error("Error al añadir el punto verde");
    }
  };
  
  React.useEffect(() => {
    loadPuntosVerdes();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Puntos Verdes</h2>
          <p className="text-muted-foreground">
            Gestiona los puntos de recogida de aceite usado
          </p>
        </div>
        <Dialog open={isAddingPoint} onOpenChange={setIsAddingPoint}>
          <DialogTrigger asChild>
            <Button className="bg-asram hover:bg-asram-700">
              Añadir Punto Verde
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Añadir nuevo punto verde</DialogTitle>
              <DialogDescription>
                Completa el formulario para añadir un nuevo punto de recogida de aceite.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select
                    value={newPoint.distrito}
                    onValueChange={(value) => handleDistritoChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((d) => (
                        <SelectItem key={d.distrito} value={d.distrito}>
                          {d.distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barrio">Barrio</Label>
                  <Select
                    value={newPoint.barrio}
                    onValueChange={(value) => handleSelectChange("barrio", value)}
                    disabled={!newPoint.distrito}
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
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={newPoint.direccion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numViviendas">Número de viviendas</Label>
                  <Input
                    id="numViviendas"
                    name="numViviendas"
                    type="number"
                    value={newPoint.numViviendas}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numContenedores">Número de contenedores</Label>
                  <Input
                    id="numContenedores"
                    name="numContenedores"
                    type="number"
                    value={newPoint.numContenedores}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de contacto</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={newPoint.telefono}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingPoint(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-asram hover:bg-asram-700"
                onClick={handleAddPoint}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Resumen de Puntos Verdes</CardTitle>
          <CardDescription>
            Estadísticas generales de los puntos de recogida
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Puntos Activos</span>
            <span className="text-4xl font-bold text-asram">{puntosVerdes.length}</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Total Viviendas</span>
            <span className="text-4xl font-bold text-asram">
              {puntosVerdes.reduce((total, punto) => total + punto.numViviendas, 0)}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
            <span className="text-muted-foreground text-sm">Total Contenedores</span>
            <span className="text-4xl font-bold text-asram">
              {puntosVerdes.reduce((total, punto) => total + punto.numContenedores, 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Listado de Puntos Verdes</CardTitle>
          <CardDescription>
            Puntos de recogida de aceite registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPoints ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Cargando puntos verdes...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distrito</TableHead>
                  <TableHead>Barrio</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Viviendas</TableHead>
                  <TableHead className="text-right">Contenedores</TableHead>
                  <TableHead className="text-right">Litros recogidos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {puntosVerdes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No hay puntos verdes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  puntosVerdes.map((punto) => (
                    <TableRow key={punto.id}>
                      <TableCell>{punto.distrito}</TableCell>
                      <TableCell>{punto.barrio}</TableCell>
                      <TableCell>{punto.direccion}</TableCell>
                      <TableCell className="text-right">{punto.numViviendas}</TableCell>
                      <TableCell className="text-right">{punto.numContenedores}</TableCell>
                      <TableCell className="text-right">{punto.litrosRecogidos}L</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs text-muted-foreground">
              Mostrando {puntosVerdes.length} puntos verdes
            </p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PuntosVerdes;
