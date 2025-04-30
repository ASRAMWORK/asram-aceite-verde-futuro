
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
  metodoPago?: {
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
  } | null;
  datosPersonalizados?: {
    comision?: number;
    zonas?: string[];
    [key: string]: any;
  };
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
