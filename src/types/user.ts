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
  administradorId?: string;  // This property is needed and was missing
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
  adminId?: string;  // Adding this property to fix the error
}
