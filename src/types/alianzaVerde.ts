
export interface AlianzaVerde {
  id: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin?: Date;
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
