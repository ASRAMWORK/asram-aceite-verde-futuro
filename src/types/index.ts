
export interface AlianzaVerde {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  distrito: string;
  barrio: string;
  contacto: string;
  telefono: string;
  email: string;
  numEstudiantes: number;
  talleresRealizados: number;
  certificaciones: string[] | number; // Updated to be either a string array or a number
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
  nombreCentro?: string;
  numParticipantes?: number;
}
