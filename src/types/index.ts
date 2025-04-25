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
  createdAt?: any;
  updatedAt?: any;
};

export type ComunidadVecinos = {
  id: string;
  nombre: string;
  direccion: string;
  numViviendas: number;
  administradorId: string | null;
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
