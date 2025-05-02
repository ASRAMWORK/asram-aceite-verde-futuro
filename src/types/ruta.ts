
export interface Ruta {
  id: string;
  nombre: string;
  distrito?: string;
  barrios?: string[];
  fecha: Date;
  hora: string;
  recogedores: string;
  clientes: any[];
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: string;
  frecuencia: string;
  completada: boolean;
  litrosTotales: number;
  puntos: any[];
  createdAt: Date;
  updatedAt: Date;
  tipo: string;
}
