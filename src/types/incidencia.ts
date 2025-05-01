
export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  estado: string;
  prioridad: string;
  asignadoA: string;
  reportadoPor: string;
  tipo: string;
  trabajadorId: string;
  createdAt?: any;
  updatedAt?: any;
}
