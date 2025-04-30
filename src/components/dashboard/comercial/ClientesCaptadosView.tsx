
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ClientesCaptadosView = () => {
  const { profile } = useUserProfile();
  const { clientes, loading } = useClientesCaptados();
  const [busqueda, setBusqueda] = useState('');

  // Filtrar solo clientes del comercial actual
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.comercialId === profile?.id && 
    (busqueda === '' || 
      cliente.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clientes Captados</CardTitle>
            <CardDescription>
              Listado de clientes que has registrado con tu código
            </CardDescription>
          </div>
          <Badge className="bg-cyan-600">{clientesFiltrados.length} clientes</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nombre de cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>

        {clientesFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha registro</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Litros recogidos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombreCliente}</TableCell>
                    <TableCell>{cliente.fechaRegistro.toLocaleDateString()}</TableCell>
                    <TableCell>{cliente.planContratado}</TableCell>
                    <TableCell>{cliente.litrosRecogidos} L</TableCell>
                    <TableCell>
                      <Badge variant={cliente.estado === 'activo' ? 'default' : 'outline'} className={
                        cliente.estado === 'activo' ? 'bg-green-600' : ''
                      }>
                        {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No has captado ningún cliente aún</p>
            <p className="text-sm mt-2">Comparte tu código de referido para empezar a ganar comisiones</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Las comisiones se generan automáticamente cuando se realiza una recogida de aceite
        </p>
      </CardFooter>
    </Card>
  );
};

export default ClientesCaptadosView;
