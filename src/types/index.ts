
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
  | "comercial"
  | "superadmin";

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
  diasDisponibles?: string[];
  horasDisponibles?: string[];
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
  // Extended properties for TrabajadorForm
  foto?: string;
  fechaAlta?: Date;
  tipoContrato?: string;
  tipoJornada?: string;
  roles?: string[];
  vehiculoAsignado?: string;
  rutasAsignadas?: string[];
  salarioBase?: number;
  cuentaBancaria?: string;
  metodoPago?: "efectivo" | "transferencia" | "otro";
  frecuenciaPago?: "mensual" | "semanal" | "quincenal";
  diaCobro?: number;
  beneficios?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Vehiculo {
  id: string;
  matricula: string;
  modelo: string;
  tipo: string;
  estado: string;
  capacidad?: number;
  ultimaRevision?: Date;
  proximaRevision?: Date;
  kilometraje?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  barrio?: string;
  barrios?: string[]; // Some components use 'barrios' (plural) instead of 'barrio'
  puntos: any[]; // Array of points/coordinates
  distancia?: number;
  tiempoEstimado?: number;
  tipoRuta?: string;
  estado?: string;
  fecha?: Date;
  hora?: string;
  recogedores?: string;
  clientes?: any[];
  puntosRecogida?: number;
  distanciaTotal?: number;
  frecuencia?: string;
  completada?: boolean;
  litrosTotales?: number;
  fechaCompletada?: Date;
  createdAt: any;
  updatedAt: any;
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  fecha: Date;
  concepto: string;
  cantidad: number;
  tipo: string;
  estado: string;
  createdAt: any;
  updatedAt: any;
}

export interface Turno {
  id: string;
  trabajadorId: string;
  nombreTrabajador: string;
  trabajadorNombre: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  rutaId?: string;
  vehiculoId?: string;
  fecha: Date;
  estado: string;
  distrito: string;
  createdAt: any;
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
  numParticipantes?: number;
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
  hora?: string;
  horaInicio?: string;
  completada?: boolean;
  nombreLugar?: string;
  direccion?: string;
  estado?: string;
  fechaSolicitud?: Date;
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
  nombreCentro?: string;
  responsable?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
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

export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  numViviendas: number;
  presidente: string;
  telefono: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: string;
  prioridad: string;
  asignadoA?: string;
  createdAt: any;
  updatedAt: any;
}

export interface HorarioVoluntario {
  id: string;
  voluntarioId: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  actividad: string;
  createdAt: any;
  updatedAt: any;
}

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  estado: string;
  prioridad: string;
  asignadoA?: string;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  createdAt: any;
  updatedAt: any;
}

// Add this for typing Project in useProjects hook
export interface Project {
  id: string;
  nombre: string;
  cliente: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFinalizacion?: Date;
  presupuesto: number;
  estado: string;
  responsable: string;
  createdAt: Date;
  updatedAt: Date;
}
