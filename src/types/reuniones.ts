
export interface Reunion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date | any;
  hora?: string;
  duracion?: number;
  ubicacion?: string;
  participantes?: string[];
  tipo?: string;
  tipoUsuario?: string;
  nombreCentro?: string;
  responsable?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  completada?: boolean;
  createdAt?: any;
  updatedAt?: any;
}
