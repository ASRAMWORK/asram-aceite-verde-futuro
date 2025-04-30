
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useComerciales } from "@/hooks/useComerciales";
import { ComercialUser } from "@/types/comercial";
import { useUsuarios } from "@/hooks/useUsuarios";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComercialFormProps {
  comercialId?: string;
  onClose: () => void;
}

const ComercialForm = ({ comercialId, onClose }: ComercialFormProps) => {
  const { addComercial, updateComercial, getComercialById, comerciales } = useComerciales();
  const { usuarios } = useUsuarios();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [activo, setActivo] = useState(true);
  const [aprobado, setAprobado] = useState(false);
  const [comisionPersonalizada, setComisionPersonalizada] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Filtrar solo administradores de fincas activos
  const administradores = usuarios.filter(user => 
    user.role === 'administrador' && user.activo === true
  );

  useEffect(() => {
    if (comercialId) {
      const comercial = getComercialById(comercialId);
      if (comercial) {
        setNombre(comercial.nombre);
        setApellidos(comercial.apellidos || "");
        setEmail(comercial.email);
        setTelefono(comercial.telefono || "");
        setActivo(comercial.activo);
        setAprobado(comercial.aprobado);
        
        if (comercial.datosPersonalizados?.comision) {
          setComisionPersonalizada(comercial.datosPersonalizados.comision.toString());
        }
      }
    }
  }, [comercialId, getComercialById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const comercialData: Partial<ComercialUser> = {
        nombre,
        apellidos,
        email,
        telefono,
        activo,
        aprobado,
      };

      if (comisionPersonalizada) {
        comercialData.datosPersonalizados = {
          comision: parseFloat(comisionPersonalizada)
        };
      }

      if (comercialId) {
        await updateComercial(comercialId, comercialData);
        toast.success("Comercial actualizado correctamente");
      } else {
        await addComercial(comercialData);
        toast.success("Comercial añadido correctamente");
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar comercial:", error);
      toast.error("Error al guardar los datos del comercial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{comercialId ? "Editar Comercial" : "Nuevo Comercial"}</CardTitle>
            <CardDescription>
              {comercialId
                ? "Modifica los datos del comercial existente"
                : "Añade un nuevo comercial al sistema"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="comision">Comisión personalizada (%)</Label>
                  <Input
                    id="comision"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={comisionPersonalizada}
                    onChange={(e) => setComisionPersonalizada(e.target.value)}
                    placeholder="Dejar vacío para usar valor por defecto"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="activo" className="flex items-center space-x-2 cursor-pointer">
                    <span>Comercial activo</span>
                  </Label>
                  <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="aprobado" className="flex items-center space-x-2 cursor-pointer">
                    <span>Comercial aprobado</span>
                  </Label>
                  <Switch id="aprobado" checked={aprobado} onCheckedChange={setAprobado} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3">Administradores de fincas activos</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Estos son los administradores de fincas a los que este comercial puede captar clientes
                </p>
                
                <div className="overflow-y-auto max-h-72">
                  {administradores.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {administradores.map(admin => (
                          <TableRow key={admin.id}>
                            <TableCell>
                              {admin.nombre} {admin.apellidos}
                            </TableCell>
                            <TableCell>{admin.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No hay administradores registrados
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3">Comerciales activos ({comerciales.filter(c => c.activo).length})</h3>
                
                <div className="overflow-y-auto max-h-40">
                  {comerciales.filter(c => c.activo).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Código</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comerciales.filter(c => c.activo).map(comercial => (
                          <TableRow key={comercial.id}>
                            <TableCell>
                              {comercial.nombre} {comercial.apellidos}
                            </TableCell>
                            <TableCell>
                              <span className="font-mono">{comercial.codigo}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No hay comerciales activos
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-asram hover:bg-asram-700" disabled={submitting}>
            {submitting ? "Guardando..." : comercialId ? "Actualizar" : "Crear comercial"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ComercialForm;
