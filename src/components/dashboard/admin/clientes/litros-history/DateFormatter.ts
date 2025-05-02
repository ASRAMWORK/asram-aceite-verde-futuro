
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const formatDate = (date: any) => {
  if (!date) return "N/A";
    
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return "Fecha inválida";
  }
};

export default formatDate;
