
export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  role?: 'user' | 'admin' | 'superadmin' | 'administrador' | 'admin_finca';
  nombreAdministracion?: string;
  cif?: string;
  direccionAdministracion?: string;
  telefonoAdministracion?: string;
  emailAdministracion?: string;
  logoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Añadir alias para UserRole para RegisterForm.tsx
export type UserRole = 'user' | 'admin' | 'superadmin' | 'administrador' | 'admin_finca' | 'comunidad' | 'restaurante' | 'hotel' | 'asociacion' | 'escolar' | 'usuario';

// Alias for Usuario (used in many components)
export type Usuario = UserProfile & {
  id: string;
  nombre: string;
  tipo?: string;
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  activo?: boolean;
  fechaRegistro?: Date;
  contacto?: string;
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
  litrosRecogidos?: number; // Add missing property
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
  participantes?: number;
  contacto?: string;
  telefono?: string;
  email?: string;
  estado?: string;
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
  ubicacion: string;
  aforo?: number;
  participantes?: number;
  organizador?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  estado?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
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
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  observaciones?: string;
  categoriaGasto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
