
// Hook for filtering recogidas
export function useRecogidaFilters(recogidas: any[] = []) {
  const getRecogidasByClientId = (clienteId: string) => {
    return recogidas.filter(recogida => recogida.clienteId === clienteId);
  };

  const getRecogidasByRutaId = (rutaId: string) => {
    return recogidas.filter(recogida => recogida.rutaId === rutaId);
  };

  // Additional filter methods can be added here

  return {
    getRecogidasByClientId,
    getRecogidasByRutaId
  };
}
