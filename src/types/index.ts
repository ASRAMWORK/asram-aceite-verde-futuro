export interface PuntoVerde {
  id: string;
  distrito: string;
  barrio: string;
  direccion: string;
  numViviendas: number;
  numContenedores: number;
  telefono: string;
  litrosRecogidos: number;
  createdAt?: any;
  updatedAt?: any;
}

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
  certificaciones: string[] | number;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
  nombreCentro?: string;
  numParticipantes?: number;
}

export interface CalleApadrinada {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  descripcion: string;
  padrinoId: string;
  precio: number;
  fechaInicio: string;
  fechaRenovacion: string;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
  nombreCalle?: string;
  nombrePadrino?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  email: string;
  numViviendas?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  frecuenciaRecogida?: string;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Recogida {
  id: string;
  clienteId: string;
  tipo: 'individual' | 'zona';
  fecha: string;
  hora: string;
  distrito: string;
  barrio: string;
  completada: boolean;
  litrosRecogidos?: number;
  fechaCompletada?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  fecha: string;
  hora: string;
  recogedores: string;
  clientes?: { id: string; nombre: string; direccion: string }[];
  completada: boolean;
  litrosTotales?: number;
  fechaCompletada?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface DistritoBarrio {
  distrito: string;
  barrios: string[];
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// User roles and profiles
export type UserRole = 'comunidad' | 'restaurante' | 'hotel' | 'asociacion' | 'escolar' | 'usuario' | 'administrador';

// Base profile interface with all common properties
export interface UsuarioProfile {
  id: string;
  email: string;
  role: UserRole;
  nombre?: string;
  apellidos?: string;
  direccion?: string;
  telefono?: string;
  distrito?: string;
  barrio?: string;
  createdAt?: any;
  updatedAt?: any;
  
  // Comunidad properties
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  
  // Restaurante properties
  nombreRestaurante?: string;
  horarioApertura?: string;
  litrosEstimados?: number;
  
  // Hotel properties
  nombreHotel?: string;
  numHabitaciones?: number;
  
  // Asociacion properties
  nombreAsociacion?: string;
  tipoAsociacion?: string;
  numMiembros?: number;
  numParticipantes?: number;
  
  // Escolar properties
  nombreCentro?: string;
  tipoCentro?: string;
  tipoEscolar?: string;
  numAlumnos?: number;
  numEstudiantes?: number;
  participaAlianzaVerde?: boolean;

  // Administrador properties
  nombreAdministracion?: string;
  cifAdministracion?: string;
}

export interface ComunidadProfile extends UsuarioProfile {
  numViviendas: number;
  numContenedores: number;
  frecuenciaRecogida: string;
}

export interface RestauranteProfile extends UsuarioProfile {
  nombreRestaurante: string;
  horarioApertura: string;
  litrosEstimados: number;
  frecuenciaRecogida: string;
}

export interface HotelProfile extends UsuarioProfile {
  nombreHotel: string;
  numHabitaciones: number;
  litrosEstimados: number;
  frecuenciaRecogida: string;
}

export interface AsociacionProfile extends UsuarioProfile {
  nombreAsociacion: string;
  tipoAsociacion: string;
  numParticipantes: number;
  frecuenciaRecogida: string;
}

export interface EscolarProfile extends UsuarioProfile {
  nombreCentro: string;
  tipoCentro: string;
  numEstudiantes: number;
  frecuenciaRecogida: string;
}

export interface AdministradorProfile extends UsuarioProfile {
  nombreAdministracion: string;
  cifAdministracion: string;
}

// Interface for communities managed by "Administradores de fincas"
export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  cif: string;
  codigoPostal: string;
  ciudad: string;
  distrito: string;
  barrio: string;
  totalViviendas: number;
  numeroPorteria: number;
  nombreAdministracion: string;
  correoContacto: string;
  administradorId: string;
  litrosRecogidos: number;
  beneficiosMedioambientales: {
    co2Evitado: number;
    aguaAhorrada: number;
    energiaAhorrada: number;
  };
  createdAt?: any;
  updatedAt?: any;
}
