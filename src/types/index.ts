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
