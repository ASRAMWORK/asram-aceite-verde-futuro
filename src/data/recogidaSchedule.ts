// Días de recogida por distrito (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
// Los 21 distritos distribuidos en días laborables (Lunes a Viernes)

export interface DistritoSchedule {
  distrito: string;
  diaSemana: number; // 1-5 (Lunes a Viernes)
  hora: string;
}

// Distribución equilibrada: ~4 distritos por día laborable
export const distritoSchedules: DistritoSchedule[] = [
  // LUNES (4 distritos)
  { distrito: "Centro", diaSemana: 1, hora: "09:00" },
  { distrito: "Arganzuela", diaSemana: 1, hora: "10:30" },
  { distrito: "Retiro", diaSemana: 1, hora: "12:00" },
  { distrito: "Salamanca", diaSemana: 1, hora: "14:00" },
  
  // MARTES (4 distritos)
  { distrito: "Chamartín", diaSemana: 2, hora: "09:00" },
  { distrito: "Tetuán", diaSemana: 2, hora: "10:30" },
  { distrito: "Chamberí", diaSemana: 2, hora: "12:00" },
  { distrito: "Fuencarral-El Pardo", diaSemana: 2, hora: "14:00" },
  
  // MIÉRCOLES (5 distritos)
  { distrito: "Moncloa-Aravaca", diaSemana: 3, hora: "09:00" },
  { distrito: "Latina", diaSemana: 3, hora: "10:00" },
  { distrito: "Carabanchel", diaSemana: 3, hora: "11:30" },
  { distrito: "Usera", diaSemana: 3, hora: "13:00" },
  { distrito: "Puente de Vallecas", diaSemana: 3, hora: "15:00" },
  
  // JUEVES (4 distritos)
  { distrito: "Moratalaz", diaSemana: 4, hora: "09:00" },
  { distrito: "Ciudad Lineal", diaSemana: 4, hora: "10:30" },
  { distrito: "Hortaleza", diaSemana: 4, hora: "12:00" },
  { distrito: "Villaverde", diaSemana: 4, hora: "14:00" },
  
  // VIERNES (4 distritos)
  { distrito: "Villa de Vallecas", diaSemana: 5, hora: "09:00" },
  { distrito: "Vicálvaro", diaSemana: 5, hora: "10:30" },
  { distrito: "San Blas-Canillejas", diaSemana: 5, hora: "12:00" },
  { distrito: "Barajas", diaSemana: 5, hora: "14:00" },
];

// Nombres de los días de la semana
export const diasSemana: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
};

// Obtener el día de recogida para un distrito específico
export const getScheduleByDistrito = (distrito: string): DistritoSchedule | undefined => {
  return distritoSchedules.find(s => s.distrito === distrito);
};

// Obtener todos los distritos que se recogen un día específico
export const getDistritosByDay = (diaSemana: number): DistritoSchedule[] => {
  return distritoSchedules.filter(s => s.diaSemana === diaSemana);
};

// Agrupar distritos por día de la semana
export const getDistritosGroupedByDay = (): Record<number, DistritoSchedule[]> => {
  return distritoSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.diaSemana]) {
      acc[schedule.diaSemana] = [];
    }
    acc[schedule.diaSemana].push(schedule);
    return acc;
  }, {} as Record<number, DistritoSchedule[]>);
};

// Festivos de Madrid 2025 (días que no hay recogida)
export const festivos2025: Date[] = [
  new Date(2025, 0, 1),   // Año Nuevo
  new Date(2025, 0, 6),   // Reyes
  new Date(2025, 3, 17),  // Jueves Santo
  new Date(2025, 3, 18),  // Viernes Santo
  new Date(2025, 4, 1),   // Día del Trabajo
  new Date(2025, 4, 2),   // Día de la Comunidad de Madrid
  new Date(2025, 4, 15),  // San Isidro
  new Date(2025, 7, 15),  // Asunción de la Virgen
  new Date(2025, 10, 1),  // Todos los Santos
  new Date(2025, 10, 9),  // Almudena
  new Date(2025, 11, 6),  // Día de la Constitución
  new Date(2025, 11, 8),  // Inmaculada Concepción
  new Date(2025, 11, 25), // Navidad
];

// Verificar si una fecha es festivo
export const isFestivo = (date: Date): boolean => {
  return festivos2025.some(festivo => 
    festivo.getDate() === date.getDate() && 
    festivo.getMonth() === date.getMonth() && 
    festivo.getFullYear() === date.getFullYear()
  );
};
