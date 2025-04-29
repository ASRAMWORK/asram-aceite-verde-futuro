export interface Usuario {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  tipo: string; // "particular" | "negocio" | "administrador" | "punto_verde"
  activo: boolean;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  fechaRegistro?: Date;
  contacto?: string;
  
  // Punto Verde specific fields
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  puntoVerdeId?: string; // Reference to the punto verde document
  
  // Other optional fields
  nombreAdministracion?: string;
  cif?: string;
  litrosRecogidos?: number;
  litrosAceite?: number;
  fechaAceite?: Date;
}

export type UserRole = "admin" | "client" | "worker" | "volunteer" | "manager";

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
  distrito: string;
  barrio: string;
  numViviendas: number;
  numContenedores: number;
  litrosRecogidos: number;
  administradorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instalacion {
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
  distrito: string;
  barrio: string;
  numViviendas: number;
  numContenedores: number;
  numPorteria: number;
  createdAt: any;
  updatedAt: any;
}

export interface AlianzaVerde {
  id: string;
  nombre: string;
  tipo: string; // "colegio", "instituto", "universidad", etc.
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  contacto: string;
  numAlumnos: number;
  numContenedores: number;
  litrosRecogidos: number;
  activo: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
