
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Improved format date helper to better handle date objects and strings
export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  
  try {
    // Handle string dates by parsing them
    if (typeof date === 'string') {
      // Check if it's a Firebase timestamp string format
      if (date.includes('T') || date.includes('-')) {
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          return format(parsedDate, 'dd/MM/yyyy', { locale: es });
        }
      }
      
      // Try to parse as timestamp number
      const timestamp = parseInt(date, 10);
      if (!isNaN(timestamp)) {
        const dateFromTimestamp = new Date(timestamp);
        if (isValid(dateFromTimestamp)) {
          return format(dateFromTimestamp, 'dd/MM/yyyy', { locale: es });
        }
      }

      // Try as direct date string
      const directDate = new Date(date);
      if (isValid(directDate)) {
        return format(directDate, 'dd/MM/yyyy', { locale: es });
      }
    }
    
    // Handle as Date object
    if (date instanceof Date && isValid(date)) {
      return format(date, 'dd/MM/yyyy', { locale: es });
    }
    
    // If we can't format it, return N/A
    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'N/A';
  }
};

export default formatDate;
