
import { useState, useEffect } from 'react';
import { Recogida } from '@/types';

// Hooks para filtrar recogidas
export function useRecogidaFilters(recogidas: Recogida[]) {
  // Ensure recogidas is always an array
  const safeRecogidas = Array.isArray(recogidas) ? recogidas : [];

  // Obtener todas las recogidas para un cliente específico
  const getRecogidasByClientId = (clienteId: string) => {
    if (!clienteId || !safeRecogidas.length) return [];
    
    return safeRecogidas.filter(recogida => {
      // Comprueba si el clienteId coincide directamente
      const directMatch = recogida.clienteId === clienteId;
      
      // Comprueba si está en los datos de ruta (puede que no exista rutaData)
      const inRoute = recogida.rutaData && 
                     recogida.rutaData.clientes && 
                     Array.isArray(recogida.rutaData.clientes) && 
                     recogida.rutaData.clientes.some((c: any) => c.id === clienteId);
      
      return directMatch || inRoute;
    });
  };
  
  // Obtener todas las recogidas para una ruta específica
  const getRecogidasByRutaId = (rutaId: string) => {
    if (!rutaId || !safeRecogidas.length) return [];
    
    return safeRecogidas.filter(recogida => recogida.rutaId === rutaId);
  };

  return {
    getRecogidasByClientId,
    getRecogidasByRutaId
  };
}
