
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper function to parse dates consistently
export const parseDate = (date: Date | string | undefined) => {
  if (!date) return new Date();
  
  try {
    if (typeof date === 'string') {
      // Try to parse with parseISO first (handles ISO format strings)
      const parsedDate = parseISO(date);
      
      // If not valid, try with new Date()
      if (!isValid(parsedDate)) {
        return new Date(date);
      }
      return parsedDate;
    } else if (date instanceof Date) {
      return date;
    }
  } catch (e) {
    console.error("Error parsing date:", e);
  }
  return new Date();
};

export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Sin fecha";
  
  try {
    // Use our helper function to get a Date object
    const dateObj = parseDate(date);
    
    // Check if the date is valid before formatting
    if (!isValid(dateObj)) {
      return "Fecha inválida";
    }
    
    return format(dateObj, "dd/MM/yyyy", { locale: es });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Error en formato de fecha";
  }
};

export default formatDate;
