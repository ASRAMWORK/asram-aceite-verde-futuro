
export interface PuntoVerde {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  latitud: number;
  longitud: number;
  tipo: string;
  descripcion: string;
  horario: string;
  telefono: string;
  email: string;
  contacto: string;
  activo: boolean;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  administradorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
