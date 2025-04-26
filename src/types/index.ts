
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
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  nombreRestaurante?: string;
  horarioApertura?: string;
  litrosEstimados?: number;
  nombreHotel?: string;
  numHabitaciones?: number;
  nombreAsociacion?: string;
  tipoAsociacion?: string;
  numMiembros?: number;
  nombreCentro?: string;
  numAlumnos?: number;
  tipoEscolar?: string;
  participaAlianzaVerde?: boolean;
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
  litrosAportados?: number;
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
  numeroPorteria?: string;
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
  activo: boolean;
  diasDisponibles: string[];
  horasDisponibles: string;
  experiencia?: string;
  habilidades?: string[];
  codigoPostal?: string;
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
  fechaAlta?: Date;
  fechaNacimiento?: Date;
  estado: 'activo' | 'inactivo' | 'permiso';
  tipoContrato?: string;
  tipoJornada?: string;
  observaciones?: string;
  createdAt: any;
  updatedAt?: any;
  vehiculoAsignado?: string;
  foto?: string;
  activo?: boolean;
  rutasAsignadas?: string[];
  roles?: string[];
  // Added payment-related fields
  salarioBase?: number;
  cuentaBancaria?: string;
  metodoPago?: 'transferencia' | 'efectivo' | 'otro';
  frecuenciaPago?: 'mensual' | 'quincenal' | 'semanal';
  diaCobro?: number;
  beneficios?: string[];
}

export type TipoContrato = 'indefinido' | 'temporal' | 'practicas' | 'formacion' | 'obra' | 'otro';
export type TipoJornada = 'completa' | 'parcial';
export type RolTrabajador = 'recolector' | 'conductor' | 'supervisor' | 'analista' | 'administrador' | 'gestor';

export interface Vehiculo {
  id: string;
  matricula: string;
  modelo: string;
  tipo: string;
  capacidad?: number;
  estado: 'disponible' | 'en_ruta' | 'mantenimiento' | 'averiado';
  ultimaRevision?: Date;
  proximaRevision?: Date;
  conductorAsignado?: string;
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
  clientes?: { id: string; nombre: string; direccion: string; litros?: number }[];
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
  numFactura?: string;
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
  numFactura?: string;
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
  tipo: 'escuela' | 'empresa' | 'institucion' | string;
  direccion: string;
  distrito: string;
  barrio: string;
  contacto: string;
  email: string;
  telefono: string;
  fechaInicio: Date;
  estado: 'activa' | 'inactiva' | 'pendiente';
  numParticipantes?: number;
  numEstudiantes?: number;
  talleresRealizados?: number;
  litrosRecolectados: number;
  createdAt: any;
  updatedAt?: any;
  certificaciones?: {
    nivel1?: boolean;
    nivel2?: boolean;
    nivel3?: boolean;
    ecosistema?: boolean;
  } | number | string[];
  nombreCentro?: string;
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
  nombreCalle?: string;
  nombrePadrino?: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  voluntarioId: string;
  voluntarioNombre: string;
  prioridad: 'alta' | 'media' | 'baja';
  completada: boolean;
  fechaAsignacion: Date;
  fechaLimite?: Date | null;
  fechaCompletada?: Date | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface HorarioVoluntario {
  id: string;
  voluntarioId: string;
  voluntarioNombre: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  actividad: string;
  ubicacion: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Incidencia {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: Date;
  trabajadorId: string;
  estado: 'abierta' | 'en_proceso' | 'cerrada';
  createdAt: any;
  updatedAt?: any;
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
  createdAt: any;
  updatedAt?: any;
  tipo?: string;
  tipoUsuario?: string;
  nombreCentro?: string;
  responsable?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  cantidad: number;
  fecha: Date;
  concepto: string;
  tipo: 'salario' | 'bono' | 'extra' | 'otro';
  estado: 'pendiente' | 'pagado' | 'cancelado';
  metodoPago?: string;
  comprobante?: string;
  notas?: string;
  createdAt: any;
  updatedAt?: any;
}
