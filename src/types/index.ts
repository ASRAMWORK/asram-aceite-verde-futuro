
export type UserRole = 'admin' | 'comunidad' | 'restaurante' | 'hotel' | 'asociacion' | 'escolar' | 'usuario';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
}

export interface ComunidadProfile extends UserProfile {
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  numViviendas: number;
  numContenedores: number;
  frecuenciaRecogida: string;
}

export interface RestauranteProfile extends UserProfile {
  nombreRestaurante: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  horarioApertura: string;
  litrosEstimados: number;
  frecuenciaRecogida: string;
}

export interface HotelProfile extends UserProfile {
  nombreHotel: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  numHabitaciones: number;
  litrosEstimados: number;
  frecuenciaRecogida: string;
}

export interface AsociacionProfile extends UserProfile {
  nombreAsociacion: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  tipoAsociacion: string;
  numMiembros: number;
  frecuenciaRecogida: string;
}

export interface EscolarProfile extends UserProfile {
  nombreCentro: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  numAlumnos: number;
  tipoEscolar: string;
  participaAlianzaVerde: boolean;
}

export interface UsuarioProfile extends UserProfile {
  nombre: string;
  apellidos: string;
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
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
  createdAt: Date;
  lastCollection?: Date;
}

export interface Recogida {
  id: string;
  clienteId: string;
  nombreCliente: string;
  direccion: string;
  distrito: string;
  barrio: string;
  fechaProgramada: Date;
  fechaRealizada?: Date;
  litrosRecogidos: number;
  estado: 'programada' | 'realizada' | 'cancelada';
  notas?: string;
  userId: string;
}

export interface AlianzaVerde {
  id: string;
  nombreCentro: string;
  tipo: 'escolar' | 'asociacion' | 'empresa' | 'entidad';
  direccion: string;
  distrito: string;
  barrio: string;
  telefono: string;
  email: string;
  numParticipantes: number;
  fechaInicio: Date;
  talleresRealizados: number;
  certificaciones: string[];
  activo: boolean;
}

export interface CalleApadrinada {
  id: string;
  nombreCalle: string;
  distrito: string;
  barrio: string;
  padrinoId: string;
  nombrePadrino: string;
  fechaInicio: Date;
  fechaRenovacion: Date;
  importeMensual: number;
  activo: boolean;
}

export interface DatoEstadistico {
  fecha: Date;
  litrosRecogidos: number;
  co2Evitado: number;
  aguaAhorrada: number;
  energiaAhorrada: number;
}

export interface DistritoBarrio {
  distrito: string;
  barrios: string[];
}

export interface MenuItem {
  name: string;
  path: string;
  icon: string;
}
