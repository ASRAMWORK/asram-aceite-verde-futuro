
import { ComunidadVecinos } from './comunidad';

export type UserRole = 
  | 'superadmin' 
  | 'admin' 
  | 'administrador' 
  | 'user' 
  | 'comunidad' 
  | 'comercial' 
  | 'restaurante' 
  | 'hotel' 
  | 'asociacion' 
  | 'escolar' 
  | 'punto_verde' 
  | 'client';

export type VinculacionAuthEstado = 
  | 'completo' 
  | 'pendiente' 
  | 'falla_password' 
  | 'sin_vincular';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  administradorId?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  activo: boolean;
  tipo?: string;
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
  
  // Campos específicos por tipo de usuario
  // Comunidad
  numViviendas?: number;
  numContenedores?: number;
  frecuenciaRecogida?: string;
  comercialId?: string; // New field to link communities to comerciales
  
  // Restaurante
  nombreRestaurante?: string;
  horarioApertura?: string;
  litrosEstimados?: number;
  
  // Hotel
  nombreHotel?: string;
  numHabitaciones?: number;
  
  // Asociación
  nombreAsociacion?: string;
  tipoAsociacion?: string;
  numMiembros?: number;
  
  // Escolar
  nombreCentro?: string;
  numAlumnos?: number;
  tipoEscolar?: string;
  participaAlianzaVerde?: boolean;
  
  // Para cualquier campo adicional que pueda tener el perfil
  [key: string]: any;
}

export interface Usuario {
  id: string;
  uid?: string;  // ID de autenticación de Firebase
  email: string;
  role: UserRole;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  administradorId?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  activo: boolean;
  tipo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nombreAdministracion?: string;
  codigo?: string;
  aprobado?: boolean;
  
  // Estado de vinculación con Firebase Auth
  estadoVinculacion?: VinculacionAuthEstado;
  intentosVinculacion?: number;
  ultimoIntentoVinculacion?: Date;
  
  // Add missing properties for comercial
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
  };
  saldo?: number;
  comisionesTotales?: number;
  comisionesPendientes?: number;
  
  // Add missing properties used in other components
  distrito?: string;
  barrio?: string;
  numViviendas?: number;
  numContenedores?: number;
  cif?: string;
  contacto?: string;
  litrosEstimados?: number;
  comercialId?: string; // New field to link communities to comerciales
  
  // Missing properties from errors
  litrosAportados?: number;
  puntosVerdes?: number;
  frecuenciaRecogida?: string;
  nombreRestaurante?: string;
  horarioApertura?: string;
  nombreHotel?: string;
  numHabitaciones?: number;
  nombreAsociacion?: string;
  tipoAsociacion?: string;
  numMiembros?: number;
  nombreCentro?: string;
  numAlumnos?: number;
  tipoEscolar?: string;
  participaAlianzaVerde?: boolean;
  fechaRegistro?: Date;
  userId?: string;
  adminId?: string;
  
  // Add the comunidades property that was missing
  comunidades?: ComunidadVecinos[];
  
  // Adding puntoVerdeId to link a user to a punto verde
  puntoVerdeId?: string;
  
  // Adding litrosRecogidos property needed for users linked to puntos verdes
  litrosRecogidos?: number;
}
