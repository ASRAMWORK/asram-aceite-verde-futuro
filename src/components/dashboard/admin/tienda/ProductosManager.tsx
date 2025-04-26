
import { useState } from "react";
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
  Eye, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Mock data for example
const productos = [
  {
    id: 1,
    nombre: "Kit de reciclaje doméstico",
    precio: 24.99,
    stock: 35,
    activo: true,
    fechaCreacion: "12/04/2024",
  },
  {
    id: 2,
    nombre: "Embudo con filtro",
    precio: 8.99,
    stock: 50,
    activo: true,
    fechaCreacion: "15/03/2024",
  },
  {
    id: 3,
    nombre: "Detergente ecológico ASRAM",
    precio: 12.50,
    stock: 20,
    activo: true,
    fechaCreacion: "20/02/2024",
  },
  {
    id: 4,
    nombre: "Contenedor pequeño",
    precio: 18.75,
    stock: 15,
    activo: false,
    fechaCreacion: "05/01/2024",
  },
  {
    id: 5,
    nombre: "Bolsa filtro reutilizable",
    precio: 6.99,
    stock: 45,
    activo: true,
    fechaCreacion: "10/04/2024",
  },
];

const ProductosManager = () => {
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  
  return (
    <Card>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre del producto</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell className="text-right">{producto.precio.toFixed(2)}€</TableCell>
                <TableCell className="text-right">{producto.stock}</TableCell>
                <TableCell>
                  {producto.activo ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span>Inactivo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{producto.fechaCreacion}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="text-sm">
            Página {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={productos.length < productsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductosManager;
