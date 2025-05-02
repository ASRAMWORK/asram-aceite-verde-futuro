
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
  precio?: number;
  fechaInicio?: Date;
  fechaRenovacion?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  numContenedores?: number;
  tipoCliente?: string;
}
