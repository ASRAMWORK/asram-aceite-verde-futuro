
/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param date Fecha a formatear
 * @returns Fecha formateada como string
 */
export const formatDate = (date: Date | string | number | undefined): string => {
  if (!date) return "—";
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida";
    }
    
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Error en fecha";
  }
};

/**
 * Formatea una fecha en formato DD/MM/YYYY HH:MM
 * @param date Fecha a formatear
 * @returns Fecha formateada como string con hora
 */
export const formatDateTime = (date: Date | string | number | undefined): string => {
  if (!date) return "—";
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida";
    }
    
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Error en fecha";
  }
};

/**
 * Parsea una fecha en diversos formatos
 * @param dateString String de fecha a parsear
 * @returns Objeto Date o undefined si no se puede parsear
 */
export const parseDate = (dateString: string | Date | undefined): Date | undefined => {
  if (!dateString) return undefined;
  
  // Si ya es un objeto Date, lo devolvemos
  if (dateString instanceof Date) return dateString;
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    return undefined;
  } catch (error) {
    console.error("Error parseando fecha:", error);
    return undefined;
  }
};
