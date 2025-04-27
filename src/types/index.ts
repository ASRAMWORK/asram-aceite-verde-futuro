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
  distrito: string;
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
  createdAt: any;
  updatedAt: any;
}

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
  createdAt: any;
  updatedAt: any;
}

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
  createdAt: any;
  updatedAt: any;
}
