
export interface ComercialUser {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
  codigo: string;
  activo: boolean;
  aprobado: boolean;
  saldo: number;
  comisionesTotales: number;
  comisionesPendientes: number;
  metodoPago: MetodoPago | null;
  datosPersonalizados?: Record<string, any>;
}

export interface ClienteCaptado {
  id: string;
  comercialId: string;
  clienteId: string;
  nombreCliente: string;
  fechaRegistro: Date;
  planContratado: string;
  estado: 'activo' | 'inactivo';
  litrosRecogidos: number;
}

export interface Comision {
  id: string;
  comercialId: string;
  clienteId: string;
  nombreCliente: string;
  litrosRecogidos: number;
  importe: number;
  estado: 'pendiente' | 'abonado';
  fecha: Date;
}

export interface MetodoPago {
  tipo: 'banco' | 'paypal' | 'bizum';
  datos: {
    banco?: {
      titular: string;
      iban: string;
      swift?: string;
    };
    paypal?: {
      email: string;
    };
    bizum?: {
      telefono: string;
    };
  };
}

export interface ProductoServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  comisionBase: number;
  comisionPorcentual: boolean;
  activo: boolean;
}
