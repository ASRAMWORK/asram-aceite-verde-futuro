
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
  fecha?: Date;
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
  completada?: boolean;
  asignadoA?: string[] | string;
  fecha?: Date;
  fechaCompletada?: Date;
  horaInicio?: string;
  horaFin?: string;
  voluntarioNombre?: string;
  fechaAsignacion?: Date;
}
