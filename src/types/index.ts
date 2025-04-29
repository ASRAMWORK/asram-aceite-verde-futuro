
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
  apellido?: string;
  litrosAportados?: number;
}

export type UserRole = "admin" | "client" | "worker" | "volunteer" | "manager" | "comunidad" | "restaurante" | "administrador";

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
  distrito?: string;
  barrio?: string;
  numEstudiantes?: number;
  talleresRealizados?: number;
  certificaciones?: number;
  numParticipantes?: number;
}

export interface Recogida {
  id: string;
  cliente: string;
  direccionRecogida: string;
  horaRecogida: string;
  cantidadAproximada: number;
  tipoAceite: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
  notasAdicionales: string;
  estadoRecogida: string;
  fechaRecogida?: Date;
  fechaSolicitud?: Date;
  fechaCompletada?: Date;
  litrosRecogidos: number;
  direccion: string;
  distrito: string;
  barrio: string;
  horaInicio: string;
  hora: string;
  completada: boolean;
  estado: string;
  clienteId: string;
  rutaId: string;
  esRecogidaZona: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fecha?: Date;
  litrosEstimados?: number;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  barrios: string[];
  fecha?: Date;
  hora: string;
  recogedores: any[];
  clientes: any[];
  puntosRecogida: any[];
  distanciaTotal: number;
  tiempoEstimado: string;
  frecuencia: string;
  completada: boolean;
  litrosTotales: number;
  puntos: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Add these types to fix other errors
export interface CalleApadrinada {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  longitud: number;
  padrino: string;
  fechaInicio: Date;
  fechaFin?: Date;
  activo: boolean;
}

export interface TallerProgramado {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  lugar: string;
  capacidad: number;
  inscritos: number;
  alianzaId: string;
  alianzaNombre: string;
  ponente: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trabajador {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  fechaNacimiento?: Date;
  fechaAlta: Date;
  fechaBaja?: Date;
  puesto: string;
  departamento: string;
  salario: number;
  numeroCuenta: string;
  documentoIdentidad: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Turno {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  estado: string;
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  estado: string;
  createdAt: Date;
  comprobante?: string;
}

export interface Voluntario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  disponibilidad: string[];
  habilidades: string[];
  fechaAlta: Date;
  horasContribuidas: number;
  activo: boolean;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  horaInicio: string;
  horaFin: string;
  estado: string;
  asignadoA: string[];
  completadaPor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  numViviendas: number;
  administradorId: string;
  contacto: string;
  telefono: string;
  email: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingreso {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  cliente?: string;
  clienteId?: string;
  comprobante?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gasto {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  categoria: string;
  proveedor?: string;
  comprobante?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}
