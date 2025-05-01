
import { useState, useEffect } from 'react';
import { Recogida } from '@/types';

interface ClienteRanking {
  id: string;
  nombre: string;
  distrito: string;
  tipo: string;
  litrosTotales: number;
  recogidasCount: number;
  ranking?: number;
  rankingDistrito?: number;
  rankingTipo?: number;
}

export function useClientesRanking(recogidas: Recogida[]) {
  const [clientesRanking, setClientesRanking] = useState<ClienteRanking[]>([]);
  const [distritoRankings, setDistritoRankings] = useState<{[key: string]: ClienteRanking[]}>({});
  const [tipoClienteRankings, setTipoClienteRankings] = useState<{[key: string]: ClienteRanking[]}>({});
  
  useEffect(() => {
    if (!recogidas.length) return;

    // Process recogidas data to build rankings
    const clientesMap: {[key: string]: ClienteRanking} = {};
    
    recogidas.forEach(recogida => {
      if (!recogida.clienteId || !recogida.litrosRecogidos) return;
      
      // Initialize client if it doesn't exist in the map
      if (!clientesMap[recogida.clienteId]) {
        clientesMap[recogida.clienteId] = {
          id: recogida.clienteId,
          nombre: recogida.nombreContacto || 'Cliente sin nombre',
          distrito: recogida.distrito || 'No especificado',
          tipo: recogida.tipoResiduo || 'No especificado',
          litrosTotales: 0,
          recogidasCount: 0
        };
      }
      
      // Update client stats
      clientesMap[recogida.clienteId].litrosTotales += recogida.litrosRecogidos;
      clientesMap[recogida.clienteId].recogidasCount += 1;
    });
    
    // Convert to array and sort by total liters (descending)
    const clientesArray = Object.values(clientesMap).sort((a, b) => 
      b.litrosTotales - a.litrosTotales
    );
    
    // Assign rankings
    clientesArray.forEach((cliente, index) => {
      cliente.ranking = index + 1;
    });
    
    setClientesRanking(clientesArray);
    
    // Group by distrito
    const distritos: {[key: string]: ClienteRanking[]} = {};
    clientesArray.forEach(cliente => {
      const distrito = cliente.distrito;
      if (!distritos[distrito]) distritos[distrito] = [];
      distritos[distrito].push(cliente);
    });
    
    // Sort each distrito ranking
    Object.keys(distritos).forEach(distrito => {
      distritos[distrito].sort((a, b) => b.litrosTotales - a.litrosTotales);
      distritos[distrito].forEach((cliente, index) => {
        cliente.rankingDistrito = index + 1;
      });
    });
    
    setDistritoRankings(distritos);
    
    // Group by tipo cliente
    const tiposCliente: {[key: string]: ClienteRanking[]} = {};
    clientesArray.forEach(cliente => {
      const tipo = cliente.tipo;
      if (!tiposCliente[tipo]) tiposCliente[tipo] = [];
      tiposCliente[tipo].push(cliente);
    });
    
    // Sort each tipo cliente ranking
    Object.keys(tiposCliente).forEach(tipo => {
      tiposCliente[tipo].sort((a, b) => b.litrosTotales - a.litrosTotales);
      tiposCliente[tipo].forEach((cliente, index) => {
        cliente.rankingTipo = index + 1;
      });
    });
    
    setTipoClienteRankings(tiposCliente);
    
  }, [recogidas]);

  return {
    clientesRanking,
    distritoRankings,
    tipoClienteRankings
  };
}

export type { ClienteRanking };
