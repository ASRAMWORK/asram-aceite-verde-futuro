
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
  certificaciones: number;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
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
