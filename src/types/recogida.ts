
export interface Recogida {
  id: string;
  clienteId: string;
  comunidadId: string;
  adminId?: string;
  administradorId?: string;
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
  esHistorico?: boolean;
  fechaCompletada?: Date;
  hora?: string;
  estado?: string;
  rutaId?: string;
  notasAdicionales?: string;
  tipoAceite?: string;
  fechaSolicitud?: Date;
  tipoCliente?: string;
  rutaData?: {
    clientes?: any[];
    id?: string;
    nombre?: string;
  };
}
