export interface UserProfile {
  id: string;
  userId: string;
  uid?: string; // Add for compatibility
  email: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  role?: UserRole;
  activo?: boolean;
  tipo?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Add fields used in UserProfileView
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  litrosAportados?: number;
  puntosVerdes?: number;
  
  // Restaurants fields
  nombreRestaurante?: string;
  horarioApertura?: string;
  litrosEstimados?: number;
  
  // Hotel fields
  nombreHotel?: string;
  numHabitaciones?: number;
  
  // Association fields
  nombreAsociacion?: string;
  tipoAsociacion?: string;
  numMiembros?: number;
  
  // School fields
  nombreCentro?: string;
  tipoEscolar?: string;
  numAlumnos?: number;
  participaAlianzaVerde?: boolean;
  
  // Administrator fields
  nombreAdministracion?: string;
  cif?: string;
}

// Añadir alias para UserRole para RegisterForm.tsx
export type UserRole = 'user' | 'admin' | 'superadmin' | 'administrador' | 'admin_finca' | 'client' | 'comercial' | 
  'comunidad' | 'restaurante' | 'hotel' | 'asociacion' | 'escolar' | 'usuario';

// Alias for Usuario (used in many components)
export type Usuario = UserProfile & {
  id: string;
  nombre: string;
  apellidos?: string; // Ensuring consistency (no "apellido" singular)
  tipo?: string;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  activo?: boolean;
  fechaRegistro?: Date;
  contacto?: string;
  uid: string; // Making sure uid is required as its used in components
  litrosEstimados?: number;
  userId: string; // Adding required userId property
  cif?: string; // Adding property for CIF (fiscal ID)
  nombreAdministracion?: string; // Adding administrative name property
};

export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  administradorId: string;
  cif?: string;
  telefono?: string;
  email?: string;
  logoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  litrosRecogidos?: number;
  // Add the missing properties
  numViviendas?: number;
  numContenedores?: number;
  distrito?: string;
  barrio?: string;
  numeroPorteria?: string | number;
  totalViviendas?: number;
  nombreAdministracion?: string;
  correoContacto?: string;
  beneficiosMedioambientales?: {
    co2Evitado?: number;
    arbolesEquivalentes?: number;
    aguaAhorrada?: number;
    energiaAhorrada?: number;
    residuosReciclados?: number;
    // Add the properties that are being used in components
    co2?: number;
    co2Reducido?: number;
    agua?: number;
    energia?: number;
  };
}

export interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
  comunidadId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Recogida {
  id: string;
  clienteId: string;
  comunidadId: string;
  fechaRecogida: Date;
  tipoResiduo: string;
  cantidad: number;
  observaciones?: string;
  createdAt?: any;
  updatedAt?: any;
  // Additional properties being used in components
  fecha?: Date;
  completada?: boolean;
  estadoRecogida?: string;
  distrito?: string;
  barrio?: string;
  direccion?: string;
  direccionRecogida?: string;
  litrosRecogidos?: number;
  horaRecogida?: string;
  horaInicio?: string;
  cliente?: string;
  nombreContacto?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  cantidadAproximada?: number;
  esRecogidaZona?: boolean;
  fechaCompletada?: Date;
  hora?: string;
  estado?: string;
  rutaId?: string;
  notasAdicionales?: string;
  tipoAceite?: string;
  fechaSolicitud?: Date; // Add missing property
}

export interface Informe {
  id: string;
  comunidadId: string;
  titulo: string;
  descripcion: string;
  fechaCreacion: Date;
  archivoUrl: string;
  tipoInforme: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Reunion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date | any;
  hora?: string;
  duracion?: number;
  ubicacion?: string;
  participantes?: string[];
  tipo?: string;
  tipoUsuario?: string;
  nombreCentro?: string;
  responsable?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  completada?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Add missing interfaces

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
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  administradorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlianzaVerde {
  id: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin?: Date;
  // Added missing properties
  participantes?: number;
  numParticipantes?: number;
  contacto?: string;
  telefono?: string;
  email?: string;
  estado?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  distrito?: string;
  barrio?: string;
  numAlumnos?: number;
  numEstudiantes?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  activo?: boolean;
  talleresRealizados?: number;
  certificaciones?: string[] | number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TallerProgramado {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: Date;
  hora: string;
  duracion: number;
  lugar: string;
  organizador: string;
  tipo: string;
  responsable: string;
  contactoTelefono: string;
  contactoEmail: string;
  aforo: number;
  participantes: number;
  gratuito: boolean;
  precio: number;
  completado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalleApadrinada {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  longitud: number;
  padrino?: string;
  fechaApadrinamiento?: Date;
  estado?: string;
  descripcion?: string;
  // Additional properties used in components
  precio?: number;
  fechaInicio?: Date;
  fechaRenovacion?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  numContenedores?: number;
  tipoCliente?: string;
}

export interface Ingreso {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  cliente?: string;
  clienteId?: string;
  estado?: string;
  numeroFactura?: string;
  numFactura?: string;
  observaciones?: string;
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Adding missing properties
  categoria?: string;
  origen?: string;
  iva?: number;
  total?: number;
  metodoPago?: string;
  tipo?: string;
}

export interface Gasto {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  proveedor?: string;
  proveedorId?: string;
  estado?: string;
  numeroFactura?: string;
  numFactura?: string;
  observaciones?: string;
  categoriaGasto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Adding missing properties
  categoria?: string;
  tipo?: string;
  iva?: number;
  total?: number;
  metodoPago?: number;
  notas?: string;
}

// Now let's add the missing interface for Instalacion
export interface Instalacion {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  latitud: number;
  longitud: number;
  descripcion?: string;
  horario?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  activo?: boolean;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  numPorteria?: number;
  createdAt?: Date;
  updatedAt?: Date;
  administradorId?: string;
  litrosRecogidos?: number;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito?: string;
  barrios?: string[];
  fecha: Date;
  hora: string;
  recogedores: string;
  clientes: any[];
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: string;
  frecuencia: string;
  completada: boolean;
  litrosTotales: number;
  puntos: any[];
  createdAt: Date;
  updatedAt: Date;
  tipo: string;
}

export interface Trabajador {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaIngreso: Date;
  puesto: string;
  salario: number;
  activo: boolean;
  // Adding missing properties used in components
  foto?: string;
  fechaNacimiento?: Date;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  tipoContrato?: string;
  tipoJornada?: string;
  fechaAlta?: Date;
  departamento?: string;
  cargo?: string;
  salarioBase?: number;
  roles?: string[];
  fechaContratacion?: Date;
  rutasAsignadas?: string | string[];
  vehiculoAsignado?: string;
  metodoPago?: 'efectivo' | 'transferencia' | 'otro';
  frecuenciaPago?: 'mensual' | 'quincenal' | 'semanal';
  diaCobro?: number;
  numeroCuenta?: string;
  cuentaBancaria?: string;
  documentoIdentidad?: string;
  fechaBaja?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  beneficios?: string[];
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  fecha: Date;
  concepto: string;
  cantidad: number;
  estado: string;
  // Adding missing properties
  tipo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Turno {
  id: string;
  trabajadorId: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  // Adding missing properties used in components
  dia: string;
  rutaId?: string;
  vehiculoId?: string;
  nombreTrabajador?: string;
  trabajadorNombre?: string;
  distrito?: string;
  estado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Voluntario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  disponibilidad: string[];
  habilidades: string[];
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Adding missing properties
  direccion?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  fechaNacimiento?: Date;
  diasDisponibles?: string[];
  horasDisponibles?: string | string[];
  experiencia?: string;
  estado?: string;
  fechaAlta?: Date;
  horasContribuidas?: number;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  voluntarioId?: string;
  estado: string;
  prioridad: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Adding missing properties
  completada?: boolean;
  asignadoA?: string[] | string;
  fecha?: Date;
  fechaCompletada?: Date;
  horaInicio?: string;
  horaFin?: string;
  voluntarioNombre?: string;
  fechaAsignacion?: Date;
}

export interface HorarioVoluntario {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  voluntarioId?: string;
  voluntarioNombre?: string;
  disponible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fecha?: Date; // Add the missing fecha property
}

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  estado: string;
  prioridad: string;
  asignadoA: string;
  reportadoPor: string;
  tipo: string;
  trabajadorId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Vehiculo {
  id: string;
  matricula: string;
  modelo: string;
  tipo: string;
  capacidad: number;
  estado: string;
  ultimaRevision?: Date;
  proximaRevision?: Date;
  conductorAsignado?: string;
  createdAt?: any;
  updatedAt?: any;
}
