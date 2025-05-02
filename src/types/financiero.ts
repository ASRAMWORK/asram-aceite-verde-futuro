
export interface Ingreso {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  cliente?: string;
  clienteId?: string;
  estado?: string;
  numeroFactura?: string;
  numFactura?: string;
  observaciones?: string;
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoria?: string;
  origen?: string;
  iva?: number;
  total?: number;
  metodoPago?: string;
  tipo?: string;
}

export interface Gasto {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  proveedor?: string;
  proveedorId?: string;
  estado?: string;
  numeroFactura?: string;
  numFactura?: string;
  observaciones?: string;
  categoriaGasto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoria?: string;
  tipo?: string;
  iva?: number;
  total?: number;
  metodoPago?: number;
  notas?: string;
}
