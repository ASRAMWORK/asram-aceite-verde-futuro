
export interface Trabajador {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaIngreso: Date;
  puesto: string;
  salario: number;
  activo: boolean;
  foto?: string;
  fechaNacimiento?: Date;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  tipoContrato?: string;
  tipoJornada?: string;
  fechaAlta?: Date;
  departamento?: string;
  cargo?: string;
  salarioBase?: number;
  roles?: string[];
  fechaContratacion?: Date;
  rutasAsignadas?: string | string[];
  vehiculoAsignado?: string;
  metodoPago?: 'efectivo' | 'transferencia' | 'otro';
  frecuenciaPago?: 'mensual' | 'quincenal' | 'semanal';
  diaCobro?: number;
  numeroCuenta?: string;
  cuentaBancaria?: string;
  documentoIdentidad?: string;
  fechaBaja?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  beneficios?: string[];
}

export interface TrabajadorPago {
  id: string;
  trabajadorId: string;
  fecha: Date;
  concepto: string;
  cantidad: number;
  estado: string;
  tipo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Turno {
  id: string;
  trabajadorId: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  dia: string;
  rutaId?: string;
  vehiculoId?: string;
  nombreTrabajador?: string;
  trabajadorNombre?: string;
  distrito?: string;
  estado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
