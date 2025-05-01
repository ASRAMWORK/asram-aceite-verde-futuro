
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
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Building,
  Home,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useComunidades } from '@/hooks/useComunidades';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { Badge } from '@/components/ui/badge';

interface DetalleAdministradorProps {
  admin: Usuario;
}

export const DetalleAdministrador: React.FC<DetalleAdministradorProps> = ({ admin }) => {
  const { comunidades } = useComunidades();
  const { recogidas } = useRecogidas();
  const { usuarios } = useUsuarios();
  const [totalViviendas, setTotalViviendas] = useState(0);
  const [totalContenedores, setTotalContenedores] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  
  // Filtrar comunidades y clientes asociados a este administrador
  const comunidadesAdmin = comunidades.filter(com => com.administradorId === admin.id);
  const clientesAdmin = usuarios.filter(u => u.administradorId === admin.id && u.role === 'client');
  
  // Filtrar recogidas asociadas a este administrador
  const recogidasAdmin = recogidas.filter(
    rec => (rec.adminId === admin.id) || (rec.administradorId === admin.id)
  );

  // Calcular estadísticas
  useEffect(() => {
    if (clientesAdmin.length > 0) {
      // Calcular total de viviendas
      const viviendas = clientesAdmin.reduce((total, cliente) => 
        total + (cliente.numViviendas || 0), 0);
      
      // Calcular total de contenedores
      const contenedores = clientesAdmin.reduce((total, cliente) => 
        total + (cliente.numContenedores || 0), 0);
      
      setTotalViviendas(viviendas);
      setTotalContenedores(contenedores);
      setTotalClientes(clientesAdmin.length);
    }
  }, [clientesAdmin]);

  // Obtener las iniciales para el avatar
  const getInitials = () => {
    if (!admin.nombre) return 'AD';
    return admin.nombre.charAt(0) + (admin.apellidos ? admin.apellidos.charAt(0) : '');
  };

  // Función segura para formatear fechas
  const formatFecha = (fechaObj: any): string => {
    if (!fechaObj) return "—";
    
    try {
      // Si es un objeto de fecha Firebase con toDate()
      if (fechaObj && typeof fechaObj.toDate === 'function') {
        return fechaObj.toDate().toLocaleDateString();
      }
      
      // Si es un objeto Date nativo
      if (fechaObj instanceof Date) {
        return fechaObj.toLocaleDateString();
      }
      
      // Si es una cadena o timestamp
      return new Date(fechaObj).toLocaleDateString();
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "—";
    }
  };

  return (
    <div className="space-y-6">
      {/* Información básica del administrador */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 border">
          <AvatarFallback className="text-2xl bg-asram text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{admin.nombre} {admin.apellidos}</h2>
          <p className="text-muted-foreground">{admin.nombreAdministracion || "Administrador de Fincas"}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{admin.email}</span>
            </div>
            {admin.telefono && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{admin.telefono}</span>
              </div>
            )}
            {admin.direccion && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{admin.direccion}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Registro: {admin.fechaRegistro ? new Date(admin.fechaRegistro).toLocaleDateString() : 
                admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Desconocido"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Badge variant={admin.activo ? "default" : "destructive"}>
            {admin.activo ? 'Activo' : 'Inactivo'}
          </Badge>
          {admin.aprobado !== undefined && (
            <Badge variant={admin.aprobado ? "outline" : "secondary"}>
              {admin.aprobado ? 'Aprobado' : 'Pendiente'}
            </Badge>
          )}
        </div>
      </div>

      <Separator />
      
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Comunidades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{comunidadesAdmin.length}</p>
            <p className="text-sm text-muted-foreground">Comunidades gestionadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Clientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClientes}</p>
            <p className="text-sm text-muted-foreground">Clientes asociados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Recogidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recogidasAdmin.length}</p>
            <p className="text-sm text-muted-foreground">Recogidas realizadas</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Viviendas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalViviendas}</p>
            <p className="text-sm text-muted-foreground">Total de viviendas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md">Contenedores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalContenedores}</p>
            <p className="text-sm text-muted-foreground">Total de contenedores</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs con información detallada */}
      <Tabs defaultValue="comunidades">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comunidades">Comunidades</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="recogidas">Recogidas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comunidades" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comunidades Gestionadas</CardTitle>
              <CardDescription>
                Lista de comunidades asociadas a este administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Viviendas</TableHead>
                    <TableHead>Contenedores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comunidadesAdmin.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No hay comunidades asociadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    comunidadesAdmin.map((comunidad) => (
                      <TableRow key={comunidad.id}>
                        <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                        <TableCell>{comunidad.direccion}</TableCell>
                        <TableCell>{comunidad.numViviendas}</TableCell>
                        <TableCell>{comunidad.numContenedores}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clientes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Clientes asociados a este administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesAdmin.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No hay clientes asociados
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientesAdmin.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nombre} {cliente.apellidos}</TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefono || "—"}</TableCell>
                        <TableCell>{cliente.direccion || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recogidas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recogidas</CardTitle>
              <CardDescription>
                Historial de recogidas gestionadas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Litros</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recogidasAdmin.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No hay recogidas asociadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    recogidasAdmin.slice(0, 10).map((recogida) => {
                      const clienteRecogida = usuarios.find(u => u.id === recogida.clienteId);
                      const fechaRecogida = recogida.fechaRecogida || recogida.fecha;
                      
                      return (
                        <TableRow key={recogida.id}>
                          <TableCell>{formatFecha(fechaRecogida)}</TableCell>
                          <TableCell>{clienteRecogida?.nombre || "Cliente no encontrado"}</TableCell>
                          <TableCell>{recogida.direccionRecogida || recogida.direccion || "—"}</TableCell>
                          <TableCell>{recogida.litrosRecogidos || recogida.cantidad || "—"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recogida.completada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recogida.completada ? 'Completada' : 'Pendiente'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              {recogidasAdmin.length > 10 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Mostrando 10 de {recogidasAdmin.length} recogidas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
