
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Building2, 
  Home, 
  Phone, 
  MapPin, 
  Calendar, 
  Mail,
  Container,
  UserCog,
  BarChart3
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ComunidadVecinos, Usuario } from '@/types';
import { formatDate } from '@/utils/dates';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface ComunidadDetalleProps {
  comunidad: ComunidadVecinos;
}

const ComunidadDetalle: React.FC<ComunidadDetalleProps> = ({ comunidad }) => {
  const [admin, setAdmin] = useState<Usuario | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    const loadAdministrador = async () => {
      if (!comunidad.administradorId) return;

      try {
        setAdminLoading(true);
        const adminDoc = await getDoc(doc(db, "usuarios", comunidad.administradorId));
        
        if (adminDoc.exists()) {
          setAdmin({
            id: adminDoc.id,
            ...adminDoc.data() as Omit<Usuario, 'id'>
          });
        }
      } catch (error) {
        console.error("Error cargando administrador:", error);
      } finally {
        setAdminLoading(false);
      }
    };

    loadAdministrador();
  }, [comunidad.administradorId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Viviendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Home className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{comunidad.numViviendas || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contenedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Container className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{comunidad.numContenedores || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Litros Recogidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{comunidad.litrosRecogidos || 0} L</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="admin">Administrador</TabsTrigger>
          <TabsTrigger value="historial">Historial Recogidas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Detalles de la Comunidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nombre:</span>
                <span className="text-sm">{comunidad.nombre}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dirección:</span>
                <span className="text-sm">
                  {comunidad.direccion}, {comunidad.codigoPostal} {comunidad.ciudad}, {comunidad.provincia || ""}
                </span>
              </div>
              
              {comunidad.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Teléfono:</span>
                  <span className="text-sm">{comunidad.telefono}</span>
                </div>
              )}
              
              {comunidad.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{comunidad.email}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fecha de registro:</span>
                <span className="text-sm">
                  {comunidad.createdAt ? formatDate(comunidad.createdAt) : "No disponible"}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Datos Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Distrito:</p>
                  <p className="text-sm">{comunidad.distrito || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Barrio:</p>
                  <p className="text-sm">{comunidad.barrio || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nº Portería:</p>
                  <p className="text-sm">{comunidad.numeroPorteria || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CIF:</p>
                  <p className="text-sm">{comunidad.cif || "No especificado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="pt-4">
          {adminLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ) : admin ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  <span>Administrador</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Nombre:</p>
                  <p>{admin.nombre} {admin.apellidos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p>{admin.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono:</p>
                  <p>{admin.telefono || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nombre de la administración:</p>
                  <p>{admin.nombreAdministracion || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <UserCog className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">No hay administrador asignado a esta comunidad</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="historial" className="pt-4">
          {comunidad.historialRecogidas && comunidad.historialRecogidas.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Litros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comunidad.historialRecogidas.map((recogida, index) => (
                    <TableRow key={recogida.id || index}>
                      <TableCell>
                        {typeof recogida.fecha === 'string' 
                          ? recogida.fecha 
                          : recogida.fecha instanceof Date 
                            ? formatDate(recogida.fecha)
                            : "Fecha desconocida"}
                      </TableCell>
                      <TableCell className="text-right">{recogida.litros} L</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">No hay historial de recogidas para esta comunidad</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunidadDetalle;
