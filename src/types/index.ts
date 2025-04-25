// Existing types
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  type?: string;
  activo?: boolean;
  createdAt?: any;
};

export type PuntoVerde = {
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
};

export type AlianzaVerde = {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  contacto: string;
  telefono: string;
  email: string;
  fechaInicio: any;
  estado: string;
  activo: boolean;
  distrito?: string;
  barrio?: string;
  numEstudiantes?: number;
  talleresRealizados?: number;
  certificaciones?: number | string[];
  createdAt?: any;
  updatedAt?: any;
};

export type CalleApadrinada = {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  padrino: string;
  contacto: string;
  telefono: string;
  email: string;
  fechaInicio: any;
  activo: boolean;
  padrinoId?: string;
  precio?: number;
  fechaRenovacion?: any;
  descripcion?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type Recogida = {
  id: string;
  fechaSolicitud: any;
  fechaProgramada: any | null;
  fechaCompletada: any | null;
  clienteId: string;
  direccion: string;
  telefono: string;
  tipo: string;
  estado: string;
  litrosEstimados: number;
  litrosRecogidos: number;
  notas?: string;
  completada: boolean;
  fecha?: any;
  distrito?: string;
  barrio?: string;
  horaInicio?: string;
  horaFin?: string;
  hora?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type ComunidadVecinos = {
  id: string;
  nombre: string;
  direccion: string;
  numViviendas: number;
  administradorId: string | null;
  cif?: string;
  codigoPostal?: string;
  ciudad?: string;
  distrito?: string;
  barrio?: string;
  litrosRecogidos?: number;
  totalViviendas?: number;
  beneficiosMedioambientales?: {
    co2?: number;
    agua?: number;
    energia?: number;
  };
  createdAt?: any;
  updatedAt?: any;
};

// New types for voluntarios module
export type Voluntario = {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion?: string;
  codigoPostal?: string;
  diasDisponibles: string[];
  horasDisponibles: string;
  habilidades?: string[];
  experiencia?: string;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type HorarioVoluntario = {
  id: string;
  voluntarioId: string;
  voluntarioNombre: string;
  actividad: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
  createdAt?: any;
};

export type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  voluntarioId: string;
  voluntarioNombre: string;
  prioridad: "alta" | "media" | "baja";
  fechaAsignacion: any;
  fechaLimite?: any;
  fechaCompletada?: any;
  completada: boolean;
};

// New types for facturación module
export type Ingreso = {
  id: string;
  concepto: string;
  cantidad: number;
  tipo: string;
  fecha: any;
  cliente?: string;
  origen?: string;
  numFactura?: string;
  notas?: string;
  createdAt?: any;
};

export type Gasto = {
  id: string;
  concepto: string;
  cantidad: number;
  tipo: string;
  fecha: any;
  proveedor?: string;
  numFactura?: string;
  notas?: string;
  createdAt?: any;
};

// New types for workers module
export type TipoContrato = "indefinido" | "temporal" | "practicas" | "formacion" | "obra" | "otro";
export type TipoJornada = "completa" | "parcial";
export type RolTrabajador = "recolector" | "conductor" | "supervisor" | "analista" | "administrador" | "gestor";

export type Trabajador = {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: any;
  email: string;
  telefono: string;
  direccion: string;
  foto?: string;
  fechaAlta: any;
  tipoContrato: TipoContrato;
  tipoJornada: TipoJornada;
  roles: RolTrabajador[];
  vehiculoAsignado?: string;
  rutasAsignadas: string[];
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type Vehiculo = {
  id: string;
  matricula: string;
  modelo: string;
  tipo: string;
  capacidad: number;
  estado: "disponible" | "en_ruta" | "mantenimiento" | "inactivo";
  ultimoMantenimiento?: any;
  conductorAsignado?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type Turno = {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  dia: string; // "lunes", "martes", etc.
  horaInicio: string;
  horaFin: string;
  rutaId?: string;
  vehiculoId?: string;
  createdAt?: any;
};

export type Incidencia = {
  id: string;
  tipo: "tecnica" | "cliente" | "retraso" | "accidente" | "otra";
  descripcion: string;
  trabajadorId: string;
  trabajadorNombre: string;
  fecha: any;
  estado: "abierta" | "en_proceso" | "resuelta";
  prioridad: "baja" | "media" | "alta";
  createdAt?: any;
  resueltaEn?: any;
};

export type Usuario = {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion?: string;
  tipo: string;
  distrito?: string;
  barrio?: string;
  activo: boolean;
  numViviendas?: number;
  numContenedores?: number;
  litrosRecogidos?: number;
  frecuenciaRecogida?: string;
  createdAt?: any;
  updatedAt?: any;
};

// Updated UserRole to include all roles used in the application
export type UserRole = "admin" | "user" | "administrador" | "comunidad" | "restaurante" | "hotel" | "asociacion" | "escolar" | "usuario";

export type CalendarioRecogida = {
  id: string;
  distrito: string;
  fecha: any; // Firebase Timestamp
  horaInicio: string;
  horaFin: string;
  estado: "programado" | "completado" | "cancelado";
  notas?: string;
  createdAt?: any;
  updatedAt?: any;
};

// Adding missing Ruta type
export type Ruta = {
  id: string;
  nombre: string;
  distrito: string;
  fecha?: any;
  hora?: string;
  recogedores?: string;
  clientes?: Array<{
    id: string;
    nombre: string;
    direccion: string;
  }>;
  completada?: boolean;
  litrosTotales?: number;
  createdAt?: any;
  updatedAt?: any;
};

// Adding ChartConfig type for SimuladorImpacto
export type ChartConfig = {
  labels: string[];
  values: number[];
  colors?: string[];
};
