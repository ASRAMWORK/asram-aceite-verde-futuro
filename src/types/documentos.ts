
export interface Informe {
  id: string;
  comunidadId: string;
  titulo: string;
  descripcion: string;
  fechaCreacion: Date;
  archivoUrl: string;
  tipoInforme: string;
  createdAt?: any;
  updatedAt?: any;
}
