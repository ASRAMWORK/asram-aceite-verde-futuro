
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

export interface ComercialUser {
  id: string;
  uid?: string;  // ID de autenticación de Firebase
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  fechaRegistro: Date;
  codigo: string;
  activo: boolean;
  aprobado: boolean;
  saldo?: number;
  comisionesTotales?: number;
  comisionesPendientes?: number;
  metodoPago?: MetodoPago | null;
  datosPersonalizados?: {
    comision?: number;
    zonas?: string[];
    [key: string]: any;
  };
  estadoVinculacion?: 'completo' | 'pendiente' | 'falla_password' | 'sin_vincular';
  intentosVinculacion?: number;
  ultimoIntentoVinculacion?: Date;
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
