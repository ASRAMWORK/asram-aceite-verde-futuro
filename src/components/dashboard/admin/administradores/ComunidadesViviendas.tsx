
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Filter, Search } from 'lucide-react';
import { ComunidadVecinos } from '@/types';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ComunidadDetalle from './ComunidadDetalle';

const ComunidadesViviendas = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComunidad, setSelectedComunidad] = useState<ComunidadVecinos | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadComunidades = async () => {
      try {
        setLoading(true);
        const comunidadesQuery = query(
          collection(db, "comunidades"),
          orderBy("nombre")
        );
        
        const querySnapshot = await getDocs(comunidadesQuery);
        const comunidadesData: ComunidadVecinos[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<ComunidadVecinos, 'id'>;
          const comunidad = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
          } as ComunidadVecinos;
          
          comunidadesData.push(comunidad);
        });
        
        setComunidades(comunidadesData);
      } catch (error) {
        console.error("Error cargando comunidades:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadComunidades();
  }, []);
  
  const filteredComunidades = comunidades.filter(comunidad => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (comunidad.nombre?.toLowerCase() || '').includes(searchLower) ||
      (comunidad.direccion?.toLowerCase() || '').includes(searchLower) ||
      (comunidad.ciudad?.toLowerCase() || '').includes(searchLower) ||
      (comunidad.codigoPostal?.toLowerCase() || '').includes(searchLower) ||
      (comunidad.nombreAdministracion?.toLowerCase() || '').includes(searchLower)
    );
  });
  
  const totalViviendas = comunidades.reduce((acc, comunidad) => acc + (comunidad.numViviendas || 0), 0);
  const totalContenedores = comunidades.reduce((acc, comunidad) => acc + (comunidad.numContenedores || 0), 0);
  
  const handleViewComunidad = (comunidad: ComunidadVecinos) => {
    setSelectedComunidad(comunidad);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Comunidades y Viviendas</CardTitle>
              <CardDescription>
                Gestiona las comunidades, viviendas y contenedores registrados en el sistema
              </CardDescription>
            </div>
            <Building className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Total Comunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{comunidades.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Total Viviendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalViviendas}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Total Contenedores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalContenedores}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="comunidades">
            <TabsList>
              <TabsTrigger value="comunidades">Comunidades</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comunidades" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar comunidad..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
              
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Administrador</TableHead>
                        <TableHead className="text-center">Viviendas</TableHead>
                        <TableHead className="text-center">Contenedores</TableHead>
                        <TableHead className="text-center">Litros</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComunidades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            No se encontraron comunidades
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredComunidades.map((comunidad) => (
                          <TableRow key={comunidad.id}>
                            <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                            <TableCell>
                              {comunidad.direccion}, {comunidad.codigoPostal} {comunidad.ciudad}
                            </TableCell>
                            <TableCell>{comunidad.nombreAdministracion || "—"}</TableCell>
                            <TableCell className="text-center">{comunidad.numViviendas || 0}</TableCell>
                            <TableCell className="text-center">{comunidad.numContenedores || 0}</TableCell>
                            <TableCell className="text-center">{comunidad.litrosRecogidos || 0} L</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewComunidad(comunidad)}
                              >
                                Ver detalle
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="estadisticas" className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Las estadísticas detalladas estarán disponibles próximamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Comunidad</DialogTitle>
          </DialogHeader>
          {selectedComunidad && (
            <ComunidadDetalle comunidad={selectedComunidad} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComunidadesViviendas;
