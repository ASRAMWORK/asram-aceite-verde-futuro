
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
  cif?: string;
  distrito?: string;
  barrio?: string;
  numeroPorteria?: string;
  totalViviendas?: number;
  nombreAdministracion?: string;
  correoContacto?: string;
  litrosRecogidos?: number;
  pais?: string;
  beneficiosMedioambientales?: {
    co2?: number;
    agua?: number;
    arboles?: number;
    energia?: number;
  };
}

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  estado: string;
  prioridad: string;
  asignadoA: string;
  tipo: string;
  createdAt: Date;
  updatedAt: Date;
  trabajadorId?: string;
}

export interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  barrio?: string;
  barrios: string[];
  puntos: any[];
  distancia: number;
  tiempoEstimado: number;
  tipoRuta: string;
  estado: string;
  fecha: Date;
  hora: string;
  recogedores: string;
  clientes: any[];
  puntosRecogida: number;
  distanciaTotal: number;
  frecuencia: string;
  completada: boolean;
  litrosTotales: number;
  fechaCompletada?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  litrosRecogidos: number;
  distrito: string;
  barrio: string;
  numViviendas: number;
  numContenedores: number;
  administradorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recogida {
  id: string;
  cliente: string;
  direccionRecogida: string;
  fechaRecogida: Date;
  horaRecogida: string;
  cantidadAproximada: number;
  tipoAceite: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
  notasAdicionales: string;
  estadoRecogida: string;
  litrosRecogidos: number;
  fecha: Date;
  distrito: string;
  barrio: string;
  hora: string;
  horaInicio: string;
  completada: boolean;
  nombreLugar: string;
  direccion: string;
  estado: string;
  fechaSolicitud: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  activo: boolean;
  fechaRegistro: Date;
  ultimoAcceso: Date;
  tipo: string;
  createdAt: Date;
  updatedAt: Date;
  role?: UserRole;
  distrito?: string;
  barrio?: string;
  pais?: string;
  nombreAdministracion?: string;
  litrosAportados?: number;
  frecuenciaRecogida?: string;
  litrosRecogidos?: number;
  numViviendas?: number;
  numContenedores?: number;
}

export interface Instalacion {
  id: string;
  nombre: string;
  direccion: string;
  distrito: string;
  barrio: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  contacto: string;
  tipo: string;
  estado: string;
  fechaInstalacion: Date;
  litrosCapacidad: number;
  litrosRecogidos: number;
  ultimaRecogida?: Date;
  proximaRecogida?: Date;
  createdAt: Date;
  updatedAt: Date;
  numViviendas?: number;
  numContenedores?: number;
  numPorteria?: number;
  pais?: string;
  latitud?: number;
  longitud?: number;
  descripcion?: string;
  horario?: string;
  activo?: boolean;
}

export interface AlianzaVerde {
  id: string;
  nombre: string;
  direccion: string;
  distrito: string;
  barrio: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  contacto: string;
  tipo: string;
  numAlumnos: number;
  participantes: number;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  numEstudiantes?: number;
  talleresRealizados?: number;
  certificaciones?: string[] | any;
}

export interface CalleApadrinada {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  longitud: number;
  responsable: string;
  contactoResponsable: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: string;
  observaciones: string;
  createdAt: Date;
  updatedAt: Date;
  padrino?: string;
  precio?: number;
  fechaRenovacion?: Date;
  descripcion?: string;
}

export interface Ingreso {
  id: string;
  concepto: string;
  cantidad: number;
  fecha: Date;
  categoria: string;
  cliente: string;
  metodoCobro: string;
  estado: string;
  notas?: string;
  origen?: string;
  createdAt: Date;
  updatedAt: Date;
  numFactura?: string;
  iva?: number;
  total?: number;
  metodoPago?: string;
}

export interface Gasto {
  id: string;
  proveedor: string;
  fecha: Date;
  concepto: string;
  cantidad: number;
  iva: number;
  total: number;
  metodoPago: string;
  notas?: string;
  estado: string;
  categoria: string;
  tipo: string;
  createdAt: Date;
  updatedAt: Date;
  numFactura?: string;
}

export interface TallerProgramado {
  id: string;
  titulo: string;
  centro: string;
  fechaHora: Date;
  duracion?: number;
  numAsistentes: number;
  materiales?: string[];
  instructor?: string;
  estado: string;
  direccion?: string;
  nombreCentro?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Trabajador {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  puesto: string;
  departamento: string;
  fechaContratacion: Date;
  salario: number;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  vehiculoAsignado?: string;
  horasSemanales?: number;
  turno?: string;
  disponibilidad?: string[];
  especialidad?: string;
  dni?: string;
  fechaNacimiento?: Date | null;
  cargo?: string;
  tipoContrato?: string;
  tipoJornada?: string;
  roles?: string[];
  rutasAsignadas?: string[];
  cuentaBancaria?: string;
  metodoPago?: string;
  frecuenciaPago?: string;
  diaCobro?: number;
  beneficios?: string[];
  foto?: string;
  fechaAlta?: Date;
  activo?: boolean;
  pais?: string;
}

export interface TrabajadorFormProps {
  onSubmit: (data: Partial<Trabajador>) => void;
  initialData?: Partial<Trabajador>;
  onCancel?: () => void;
}

export interface ClienteFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}

export interface Turno {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  dias: string[];
  trabajadorId?: string;
  createdAt: Date;
  updatedAt: Date;
  trabajadorNombre?: string;
  rutaId?: string;
  vehiculoId?: string;
  fecha?: Date;
  estado?: string;
  distrito?: string;
  dia?: string;
  nombreTrabajador?: string;
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  fecha: Date;
  cantidad: number;
  concepto: string;
  metodoPago: string;
  estado: string;
  periodo: string;
  createdAt: Date;
  updatedAt: Date;
  tipo?: string;
}

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  matricula: string;
  tipo: string;
  capacidad: number;
  kilometraje: number;
  ultimaRevision: Date;
  proximaRevision: Date;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  conductorAsignado?: string;
}

export interface Voluntario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  disponibilidad: string[];
  habilidades: string[];
  experiencia: string;
  createdAt: Date;
  updatedAt: Date;
  fechaAlta?: Date;
  estado?: string;
  diasDisponibles?: string[];
  horasDisponibles?: string;
  activo?: boolean;
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
  voluntarioId?: string;
  voluntarioNombre?: string;
  categoria: string;
  ubicacion?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HorarioVoluntario {
  id: string;
  voluntarioId: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  actividad: string;
  ubicacion: string;
  createdAt: Date;
  updatedAt: Date;
  voluntarioNombre?: string;
}

export interface Reunion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  duracion: number;
  ubicacion: string;
  tipo: string;
  asistentes: string[];
  organizador: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  tipoUsuario?: string;
  nombreCentro?: string;
  responsable?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
  distrito?: string;
  barrio?: string;
  litrosAportados?: number;
  puntosVerdes?: number;
  // Role-specific fields
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

export type UserRole = 
  | 'user'
  | 'admin'
  | 'cliente'
  | 'trabajador'
  | 'voluntario'
  | 'comunidad'
  | 'restaurante'
  | 'hotel'
  | 'asociacion'
  | 'escolar'
  | 'administrador'
  | 'comercial'
  | 'superadmin';

// Fix for admin/rutas/RutasDistritos.tsx
export interface RutaRecogida extends Ruta {
  recogidas?: Recogida[];
}

// Update ClienteForm to include onCancel prop in interface
export interface ClienteForm extends Usuario {
  onCancel?: () => void;
}
