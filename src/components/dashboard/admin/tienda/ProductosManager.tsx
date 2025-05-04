
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
import { useIsMobile } from "@/hooks/useIsMobile";
import { mobileTouchTarget } from "@/utils/mobileStyles";

// Mock data for example
const productos = [
  {
    id: 1,
    nombre: "Kit de reciclaje doméstico",
    precio: 24.99,
    stock: 35,
    activo: true,
    fechaCreacion: "12/04/2024",
    imageUrl: "/lovable-uploads/d13e8bef-6a34-475e-b1a9-dbd4cfe6b3ba.png"
  },
  {
    id: 2,
    nombre: "Embudo con filtro",
    precio: 8.99,
    stock: 50,
    activo: true,
    fechaCreacion: "15/03/2024",
    imageUrl: null
  },
  {
    id: 3,
    nombre: "Detergente ecológico ASRAM",
    precio: 12.50,
    stock: 20,
    activo: true,
    fechaCreacion: "20/02/2024",
    imageUrl: "/lovable-uploads/fd435684-868a-4b15-842a-b80cea599978.png"
  },
  {
    id: 4,
    nombre: "Contenedor pequeño",
    precio: 18.75,
    stock: 15,
    activo: false,
    fechaCreacion: "05/01/2024",
    imageUrl: "/lovable-uploads/94155982-51c6-404b-9586-ceb767dfa9e8.png"
  },
  {
    id: 5,
    nombre: "Bolsa filtro reutilizable",
    precio: 6.99,
    stock: 45,
    activo: true,
    fechaCreacion: "10/04/2024",
    imageUrl: null
  },
];

interface ProductosManagerProps {
  onEditItem?: (item: any) => void;
}

const ProductosManager = ({ onEditItem }: ProductosManagerProps) => {
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <div className="p-2 md:p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isMobile ? "text-xs px-2" : ""}>ID</TableHead>
              {!isMobile && <TableHead>Imagen</TableHead>}
              <TableHead className={isMobile ? "text-xs px-2" : ""}>Producto</TableHead>
              <TableHead className={`text-right ${isMobile ? "text-xs px-1" : ""}`}>Precio</TableHead>
              <TableHead className={`text-right ${isMobile ? "text-xs px-1" : ""}`}>Stock</TableHead>
              {!isMobile && <TableHead>Estado</TableHead>}
              {!isMobile && <TableHead>Fecha</TableHead>}
              <TableHead className={`text-right ${isMobile ? "text-xs px-1" : ""}`}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className={`font-medium ${isMobile ? "text-xs px-2 py-2" : ""}`}>{producto.id}</TableCell>
                {!isMobile && (
                  <TableCell>
                    {producto.imageUrl ? (
                      <div className="w-12 h-12 relative">
                        <img 
                          src={producto.imageUrl} 
                          alt={producto.nombre}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell className={isMobile ? "text-xs px-2 py-2 max-w-[120px]" : ""}>
                  <div className={isMobile ? "truncate max-w-[120px]" : ""}>
                    {producto.nombre}
                  </div>
                  {isMobile && (
                    <div className="flex items-center mt-1">
                      {producto.activo ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className={`text-right ${isMobile ? "text-xs px-1 py-2" : ""}`}>
                  {producto.precio.toFixed(2)}€
                </TableCell>
                <TableCell className={`text-right ${isMobile ? "text-xs px-1 py-2" : ""}`}>
                  {producto.stock}
                </TableCell>
                {!isMobile && (
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
                )}
                {!isMobile && <TableCell>{producto.fechaCreacion}</TableCell>}
                <TableCell className={`text-right ${isMobile ? "px-1 py-1" : ""}`}>
                  <div className="flex justify-end gap-1 md:gap-2">
                    {!isMobile && (
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={mobileTouchTarget()} 
                      onClick={() => onEditItem && onEditItem(producto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`text-red-500 ${mobileTouchTarget()}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end p-2 md:p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={mobileTouchTarget()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className={`text-sm ${isMobile ? "text-xs" : ""}`}>
            Página {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={productos.length < productsPerPage}
            className={mobileTouchTarget()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </Card>
  );
};

export default ProductosManager;
