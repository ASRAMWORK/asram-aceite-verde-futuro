
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
  beneficiosMedioambientales?: {
    co2?: number;
    agua?: number;
    arboles?: number;
    energia?: number;
  };
}
