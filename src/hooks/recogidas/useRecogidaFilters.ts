
import { useState, useEffect } from 'react';
import { Recogida } from '@/types';

// Hooks para filtrar recogidas
export function useRecogidaFilters(recogidas: Recogida[]) {
  // Obtener todas las recogidas para un cliente específico
  const getRecogidasByClientId = (clienteId: string) => {
    if (!clienteId || !recogidas.length) return [];
    
    return recogidas.filter(recogida => 
      // Filtrar por clienteId directo o dentro de datos de ruta
      recogida.clienteId === clienteId || 
      (recogida.rutaData && 
       recogida.rutaData.clientes && 
       Array.isArray(recogida.rutaData.clientes) && 
       recogida.rutaData.clientes.some((c: any) => c.id === clienteId))
    );
  };
  
  // Obtener todas las recogidas para una ruta específica
  const getRecogidasByRutaId = (rutaId: string) => {
    if (!rutaId || !recogidas.length) return [];
    
    return recogidas.filter(recogida => recogida.rutaId === rutaId);
  };

  return {
    getRecogidasByClientId,
    getRecogidasByRutaId
  };
}
