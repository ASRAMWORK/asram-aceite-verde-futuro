
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface UserProfile {
  id?: string;
  userId: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  role?: 'user' | 'admin_finca' | 'superadmin';
  tipo?: 'particular' | 'comunidad' | 'empresa' | 'admin';
  activo?: boolean;
  nombreAdministracion?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion?: string;
  distrito?: string;
  barrio?: string;
  codigoPostal?: string;
  frecuenciaRecogida?: string;
  notas?: string;
  tipo: string;
  activo: boolean;
  role?: 'user' | 'admin_finca' | 'superadmin';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  numViviendas: number;
  cif: string;
  codigoPostal: string;
  ciudad: string;
  distrito: string;
  barrio: string;
  totalViviendas?: number;
  numeroPorteria?: number;
  nombreAdministracion?: string;
  correoContacto?: string;
  administradorId: string | null;
  litrosRecogidos: number;
  beneficiosMedioambientales: {
    co2: number;
    agua: number;
    energia: number;
  };
  createdAt: any;
  updatedAt: any;
}

export interface Recogida {
  id: string;
  fecha: Date;
  comunidadId?: string;
  puntoVerdeId?: string;
  nombreLugar: string;
  direccion: string;
  distrito: string;
  barrio: string;
  litrosRecogidos: number;
  tecnicoId?: string;
  nombreTecnico?: string;
  observaciones?: string;
  estado: 'pendiente' | 'realizada' | 'cancelada';
  createdAt: any;
  updatedAt?: any;
}

export interface PuntoVerde {
  id: string;
  distrito: string;
  barrio: string;
  direccion: string;
  numViviendas: number;
  numContenedores: number;
  telefono: string;
  litrosRecogidos: number;
  administradorId: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface Voluntario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion?: string;
  distrito?: string;
  barrio?: string;
  disponibilidad?: string[];
  horasTotales?: number;
  fechaAlta: Date;
  estado: 'activo' | 'inactivo' | 'pendiente';
  tipoActividad?: string[];
  observaciones?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Trabajador {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  direccion?: string;
  puesto: string;
  departamento: string;
  fechaContratacion: Date;
  estado: 'activo' | 'inactivo' | 'permiso';
  observaciones?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Instalacion {
  id: string;
  nombre: string;
  direccion: string;
  distrito: string;
  barrio: string;
  numContenedores: number;
  numPorteria: number;
  numViviendas: number;
  createdAt: any;
  updatedAt?: any;
}
