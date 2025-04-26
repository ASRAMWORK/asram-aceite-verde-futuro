
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export type UserRole = 'user' | 'admin_finca' | 'superadmin' | 'comunidad' | 'restaurante' | 'hotel' | 'asociacion' | 'escolar' | 'usuario' | 'administrador';

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
  role?: UserRole;
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
  role?: UserRole;
  createdAt: Date;
  updatedAt?: Date;
  numViviendas?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  litrosEstimados?: number;
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
  estado: 'pendiente' | 'realizada' | 'cancelada' | 'programado';
  createdAt: any;
  updatedAt?: any;
  clienteId?: string;
  hora?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  completada?: boolean;
  fechaSolicitud?: Date;
  fechaProgramada?: Date;
  fechaCompletada?: Date | null;
  tipo?: 'zona' | 'individual' | 'calendario';
  telefono?: string;
  litrosEstimados?: number;
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
  vehiculoAsignado?: string;
  foto?: string;
  activo?: boolean;
  rutasAsignadas?: number;
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

export interface CalendarioRecogida {
  id: string;
  fecha: Date;
  distrito: string;
  horaInicio: string;
  horaFin: string;
  estado: 'programado' | 'completado' | 'cancelado';
  notas?: string;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  barrios: string[];
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: number;
  frecuencia: string;
  tecnicoAsignado?: string;
  vehiculoAsignado?: string;
  createdAt: any;
  updatedAt?: any;
  fecha?: Date;
  hora?: string;
  recogedores?: string;
  completada?: boolean;
  clientes?: { id: string; nombre: string; direccion: string }[];
  litrosTotales?: number;
}

export interface Turno {
  id: string;
  trabajadorId: string;
  nombreTrabajador: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  distrito: string;
  vehiculo?: string;
  estado: 'programado' | 'completado' | 'cancelado';
  createdAt: any;
  updatedAt?: any;
  dia?: string;
  rutaId?: string;
  vehiculoId?: string;
  trabajadorNombre?: string;
}

export interface Ingreso {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  cliente?: string;
  categoria: string;
  notas?: string;
  createdAt: any;
  updatedAt?: any;
  tipo?: string;
  origen?: string;
}

export interface Gasto {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  proveedor?: string;
  categoria: string;
  notas?: string;
  createdAt: any;
  updatedAt?: any;
  tipo?: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
  options?: any;
}

export interface AlianzaVerde {
  id: string;
  nombre: string;
  tipo: 'escuela' | 'empresa' | 'institucion';
  direccion: string;
  distrito: string;
  barrio: string;
  contacto: string;
  email: string;
  telefono: string;
  fechaInicio: Date;
  estado: 'activa' | 'inactiva' | 'pendiente';
  numParticipantes?: number;
  litrosRecolectados: number;
  createdAt: any;
  updatedAt?: any;
  numEstudiantes?: number;
  talleresRealizados?: number;
  certificaciones?: {
    nivel1?: boolean;
    nivel2?: boolean;
    nivel3?: boolean;
    ecosistema?: boolean;
  };
}

export interface CalleApadrinada {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  longitud: number;
  padrino: string;
  tipoCliente: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: 'activo' | 'inactivo' | 'pendiente';
  numContenedores: number;
  createdAt: any;
  updatedAt?: any;
  descripcion?: string;
  precio?: number;
  fechaRenovacion?: Date;
}
