
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

    // Procesar datos de recogidas para construir rankings
    const clientesMap: {[key: string]: ClienteRanking} = {};
    
    recogidas.forEach(recogida => {
      if (!recogida.clienteId || recogida.litrosRecogidos === undefined) return;
      
      // Inicializar cliente si no existe en el mapa
      if (!clientesMap[recogida.clienteId]) {
        clientesMap[recogida.clienteId] = {
          id: recogida.clienteId,
          nombre: recogida.nombreContacto || 'Cliente sin nombre',
          distrito: recogida.distrito || 'No especificado',
          tipo: recogida.tipoResiduo || recogida.tipoCliente || 'No especificado',
          litrosTotales: 0,
          recogidasCount: 0
        };
      }
      
      // Actualizar estadísticas del cliente
      clientesMap[recogida.clienteId].litrosTotales += recogida.litrosRecogidos || 0;
      clientesMap[recogida.clienteId].recogidasCount += 1;
    });
    
    // Convertir a array y ordenar por litros totales (descendente)
    const clientesArray = Object.values(clientesMap).sort((a, b) => 
      b.litrosTotales - a.litrosTotales
    );
    
    // Asignar rankings
    clientesArray.forEach((cliente, index) => {
      cliente.ranking = index + 1;
    });
    
    setClientesRanking(clientesArray);
    
    // Agrupar por distrito
    const distritos: {[key: string]: ClienteRanking[]} = {};
    clientesArray.forEach(cliente => {
      const distrito = cliente.distrito || 'No especificado';
      if (!distritos[distrito]) distritos[distrito] = [];
      distritos[distrito].push(cliente);
    });
    
    // Ordenar cada ranking de distrito
    Object.keys(distritos).forEach(distrito => {
      distritos[distrito].sort((a, b) => b.litrosTotales - a.litrosTotales);
      distritos[distrito].forEach((cliente, index) => {
        cliente.rankingDistrito = index + 1;
      });
    });
    
    setDistritoRankings(distritos);
    
    // Agrupar por tipo de cliente
    const tiposCliente: {[key: string]: ClienteRanking[]} = {};
    clientesArray.forEach(cliente => {
      const tipo = cliente.tipo || 'No especificado';
      if (!tiposCliente[tipo]) tiposCliente[tipo] = [];
      tiposCliente[tipo].push(cliente);
    });
    
    // Ordenar cada ranking de tipo de cliente
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
