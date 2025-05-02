
export interface ComunidadVecinos {
  id: string;
  nombre: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  administradorId: string;
  cif?: string;
  telefono?: string;
  email?: string;
  logoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  litrosRecogidos?: number;
  numViviendas?: number;
  numContenedores?: number;
  distrito?: string;
  barrio?: string;
  numeroPorteria?: string | number;
  totalViviendas?: number;
  nombreAdministracion?: string;
  correoContacto?: string;
  historialRecogidas?: {
    fecha: string | Date;
    litros: number;
    id?: string;
  }[];
  beneficiosMedioambientales?: {
    co2Evitado?: number;
    arbolesEquivalentes?: number;
    aguaAhorrada?: number;
    energiaAhorrada?: number;
    residuosReciclados?: number;
    co2?: number;
    co2Reducido?: number;
    agua?: number;
    energia?: number;
  };
}

export interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
  comunidadId: string;
  createdAt?: any;
  updatedAt?: any;
}
