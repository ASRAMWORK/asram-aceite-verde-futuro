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
  pais?: string;
  frecuenciaRecogida?: string;
}

export type UserRole = "admin" | "client" | "worker" | "volunteer" | "manager" | "comunidad" | "restaurante" | "administrador" | "user" | "hotel" | "asociacion" | "escolar";

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
  certificaciones?: number[];
  numParticipantes?: number;
  estado?: string;
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
  recogedores: string;
  clientes: any[];
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: number | string;
  frecuencia: string;
  completada: boolean;
  litrosTotales: number;
  puntos: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

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
  precio?: number;
  fechaRenovacion?: Date;
  descripcion?: string;
  estado?: string;
  numContenedores?: number;
  tipoCliente?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  // Additional fields needed
  fechaHora?: Date;
  numAsistentes?: number;
  centro?: string;
  nombreCentro?: string;
  direccion?: string;
  contacto?: string;
  instructor?: string;
  telefono?: string;
  email?: string;
  duracion?: number;
  materiales?: string[];
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
  // Additional fields needed based on errors
  dni?: string;
  foto?: string;
  roles?: string[];
  fechaContratacion?: Date;
  tipoContrato?: string;
  tipoJornada?: string;
  rutasAsignadas?: string[] | string;
  pais?: string;
  cargo?: string;
  salarioBase?: number;
  cuentaBancaria?: string;
  metodoPago?: "efectivo" | "transferencia" | "otro";
  frecuenciaPago?: "mensual" | "semanal" | "quincenal";
  diaCobro?: number;
  beneficios?: string[];
  vehiculoAsignado?: string;
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
  dia?: string;
  rutaId?: string;
  vehiculoId?: string;
  nombreTrabajador?: string;
  distrito?: string;
  createdAt?: Date;
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
  tipo?: string;
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
  // Additional properties needed
  diasDisponibles?: string[];
  horasDisponibles?: string | string[];
  experiencia?: string;
  codigoPostal?: string;
  pais?: string;
  ciudad?: string;
  provincia?: string;
  apellido?: string; // For backward compatibility
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
  prioridad?: string;
  voluntarioId?: string;
  voluntarioNombre?: string;
  completada?: boolean;
  fechaAsignacion?: Date;
  fecha?: Date;
  fechaCompletada?: Date;
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
  nombreAdministracion?: string;
  
  // Additional fields needed for user dashboard/profile
  role?: UserRole;
  email?: string;
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
  apellido?: string;
  litrosAportados?: number;
  puntosVerdes?: number;
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
  // Additional properties needed
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  distrito?: string;
  barrio?: string;
  cif?: string;
  numeroPorteria?: number;
  totalViviendas?: number;
  correoContacto?: string;
  nombreAdministracion?: string;
  litrosRecogidos?: number;
  beneficiosMedioambientales?: {
    co2Reducido?: number;
    aguaAhorrada?: number;
    energiaAhorrada?: number;
    co2?: number; // Aliases for backward compatibility
    agua?: number; // Aliases for backward compatibility
    energia?: number; // Aliases for backward compatibility
  };
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
  categoria?: string;
  estado?: string;
  numFactura?: string;
  iva?: number;
  total?: number;
  metodoPago?: string;
  origen?: string;
  tipo?: string;
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
  estado?: string;
  tipo?: string;
  numFactura?: string;
  iva?: number;
  total?: number;
  metodoPago?: string;
}
