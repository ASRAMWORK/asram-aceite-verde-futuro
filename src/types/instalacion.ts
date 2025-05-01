
export interface Instalacion {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  latitud: number;
  longitud: number;
  descripcion?: string;
  horario?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  activo?: boolean;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  numPorteria?: number;
  createdAt?: Date;
  updatedAt?: Date;
  administradorId?: string;
  litrosRecogidos?: number;
}
