
export type UserRole = 
  | "admin" 
  | "user" 
  | "comunidad" 
  | "restaurante" 
  | "hotel" 
  | "asociacion" 
  | "escolar" 
  | "usuario" 
  | "administrador"
  | "comercial";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  activo: boolean;
  tipo: string;
  role: string;
  litrosAportados?: number;
  litrosRecogidos?: number;
  distrito?: string;
  barrio?: string;
  frecuenciaRecogida?: string;
  numViviendas?: number;
  numContenedores?: number;
  nombreAdministracion?: string;
  createdAt: any;
  updatedAt: any;
}

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
  litrosRecogidos?: number;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  administradorId?: string | null;
  createdAt: any;
  updatedAt: any;
}

export interface Voluntario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  activo: boolean;
  dni: string;
  fechaNacimiento: any;
  createdAt: any;
  updatedAt: any;
}

export interface Trabajador {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  activo: boolean;
  dni: string;
  fechaNacimiento: any;
  cargo: string;
  departamento: string;
  fechaContratacion: any;
  createdAt: any;
  updatedAt: any;
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
  numViviendas?: number;
  numContenedores?: number;
  distrito?: string;
  barrio?: string;
  numPorteria?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Factura {
  id: string;
  cliente: string;
  fecha: any;
  concepto: string;
  cantidad: number;
  iva: number;
  total: number;
  metodoPago: string;
  notas: string;
  tipo: string;
  createdAt: any;
  updatedAt: any;
}

export interface Ingreso {
  id: string;
  cliente: string;
  fecha: any;
  concepto: string;
  cantidad: number;
  iva: number;
  total: number;
  metodoPago: string;
  notas: string;
  estado?: string;
  categoria?: string;
  origen?: string;
  tipo?: string;
  numFactura?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Gasto {
  id: string;
  proveedor: string;
  fecha: any;
  concepto: string;
  cantidad: number;
  iva: number;
  total: number;
  metodoPago: string;
  notas: string;
  estado?: string;
  categoria?: string;
  tipo?: string;
  numFactura?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AlianzaEscolarType {
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
  numEstudiantes?: number;
  talleresRealizados?: number;
  certificaciones?: number | string[];
  fechaInicio?: Date;
  estado?: string;
  litrosRecolectados?: number;
  createdAt: any;
  updatedAt: any;
}

export type AlianzaVerde = AlianzaEscolarType;

export interface CalleApadrinadaType {
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
  padrino?: string;
  precio?: number;
  fechaInicio?: any;
  fechaRenovacion?: any;
  estado?: string;
  numContenedores?: number;
  longitud?: number;
  tipoCliente?: string;
  createdAt: any;
  updatedAt: any;
}

export type CalleApadrinada = CalleApadrinadaType;

export interface Recogida {
  id: string;
  cliente: string;
  direccionRecogida: string;
  fechaRecogida: any;
  horaRecogida: string;
  cantidadAproximada: number;
  tipoAceite: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
  notasAdicionales: string;
  estadoRecogida: string;
  litrosRecogidos?: number;
  fecha?: any;
  distrito?: string;
  barrio?: string;
  horaInicio?: string;
  completada?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface RetiradaContenedor {
  id: string;
  cliente: string;
  direccionRetirada: string;
  fechaRetirada: any;
  horaRetirada: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
  notasAdicionales: string;
  estadoRetirada: string;
  createdAt: any;
  updatedAt: any;
}

export interface Reunion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  duracion: number;
  ubicacion: string;
  participantes: string[];
  tipo?: string;
  tipoUsuario?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  createdAt: any;
  updatedAt: any;
}

export interface TallerProgramado {
  id: string;
  titulo: string;
  centro: string;
  fechaHora: Date;
  duracion: number;
  numAsistentes: number;
  materiales: string[];
  instructor: string;
  estado: "programado" | "completado" | "cancelado";
  observaciones?: string;
  // For compatibility with existing code
  centroId?: string;
  nombreCentro?: string;
  tipoTaller?: string;
  fechaTaller?: Date;
  direccion?: string;
  numAlumnos?: number;
  contacto?: string;
  telefono?: string;
  email?: string;
  createdAt: any;
  updatedAt: any;
}
