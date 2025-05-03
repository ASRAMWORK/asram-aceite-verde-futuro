
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, UserCog } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import DetalleAdministrador from './DetalleAdministrador';
import { Usuario } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdministradoresVinculacion from './AdministradoresVinculacion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { mobileHeadingSize, mobileTextSize, mobilePadding, mobileTouchTarget } from '@/utils/mobileStyles';

const GestionAdministradores = () => {
  const { usuarios, loading, getUsuariosByRole } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Usamos directamente la función getUsuariosByRole para obtener los administradores
  const administradores = getUsuariosByRole('administrador');

  // Aplicamos el filtro de búsqueda a los administradores
  const filteredAdmins = administradores.filter(
    admin => 
      searchTerm === '' || 
      (admin.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.nombreAdministracion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleVerDetalles = (admin: Usuario) => {
    setSelectedAdmin(admin);
    setIsDialogOpen(true);
  };

  // Calcular contadores para la pestaña de vinculación
  const adminsPendientesCount = administradores.filter(
    admin => admin.estadoVinculacion !== 'completo' && admin.estadoVinculacion !== undefined
  ).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className={mobilePadding()}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={mobileHeadingSize()}>Gestión de Administradores de Fincas</CardTitle>
              <CardDescription className={mobileTextSize()}>
                Gestiona los perfiles de administradores de fincas registrados en el sistema
              </CardDescription>
            </div>
            <UserCog className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent className={mobilePadding()}>
          <Tabs defaultValue="administradores" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="administradores" className={isMobile ? "text-xs py-2" : ""}>
                Administradores
              </TabsTrigger>
              <TabsTrigger value="vinculacion" className={isMobile ? "text-xs py-2" : ""}>
                Vinculación 
                {adminsPendientesCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {adminsPendientesCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="administradores">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar administrador..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  {loading ? (
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={isMobile ? "text-xs px-2" : ""}>Nombre</TableHead>
                          {!isMobile && <TableHead>Email</TableHead>}
                          {!isMobile && <TableHead>Nombre Administración</TableHead>}
                          {!isMobile && <TableHead>Teléfono</TableHead>}
                          {!isMobile && <TableHead>Fecha Registro</TableHead>}
                          <TableHead className={isMobile ? "text-xs px-2" : ""}>Estado</TableHead>
                          <TableHead className={`text-right ${isMobile ? "text-xs px-2" : ""}`}>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdmins.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={isMobile ? 3 : 7} className="text-center py-6">
                              No se encontraron administradores
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAdmins.map((admin) => (
                            <TableRow key={admin.id}>
                              <TableCell className={`font-medium ${isMobile ? "text-xs px-2 py-2" : ""}`}>
                                <div>
                                  {admin.nombre} {admin.apellidos}
                                </div>
                                {isMobile && (
                                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {admin.email}
                                  </div>
                                )}
                              </TableCell>
                              {!isMobile && <TableCell>{admin.email}</TableCell>}
                              {!isMobile && <TableCell>{admin.nombreAdministracion || "—"}</TableCell>}
                              {!isMobile && <TableCell>{admin.telefono || "—"}</TableCell>}
                              {!isMobile && (
                                <TableCell>
                                  {admin.fechaRegistro ? new Date(admin.fechaRegistro).toLocaleDateString() : 
                                  admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "—"}
                                </TableCell>
                              )}
                              <TableCell className={isMobile ? "text-xs px-2 py-2" : ""}>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  admin.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {admin.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </TableCell>
                              <TableCell className={`text-right ${isMobile ? "px-2 py-1" : ""}`}>
                                <Button 
                                  variant="outline" 
                                  size={isMobile ? "icon" : "sm"}
                                  onClick={() => handleVerDetalles(admin)}
                                  className={`${isMobile ? mobileTouchTarget() : 'flex items-center gap-1'}`}
                                >
                                  <Eye className="h-4 w-4" />
                                  {!isMobile && <span className="hidden sm:inline">Ver detalles</span>}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="vinculacion">
              <AdministradoresVinculacion />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${isMobile ? 'w-[95vw] p-3' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isMobile ? "text-lg" : ""}>Detalles del Administrador</DialogTitle>
          </DialogHeader>
          {selectedAdmin && <DetalleAdministrador admin={selectedAdmin} />}
        </DialogContent>
      </Dialog>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default GestionAdministradores;
