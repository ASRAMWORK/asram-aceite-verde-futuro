
export interface Vehiculo {
  id: string;
  matricula: string;
  modelo: string;
  tipo: string;
  capacidad: number;
  estado: string;
  ultimaRevision?: Date;
  proximaRevision?: Date;
  conductorAsignado?: string;
  createdAt?: any;
  updatedAt?: any;
}
