
// Hook for calculating recogida statistics
export function useRecogidaStats(recogidas: any[] = []) {
  // Get total liters collected
  const getTotalLitrosRecogidos = () => {
    return recogidas.reduce((total, recogida) => {
      return total + (recogida.litrosRecogidos || 0);
    }, 0);
  };
  
  const getTotalLitrosRecogidosPorRuta = (rutaId: string) => {
    return recogidas
      .filter(recogida => recogida.rutaId === rutaId)
      .reduce((total, recogida) => {
        return total + (recogida.litrosRecogidos || 0);
      }, 0);
  };

  const getLitrosRecolectadosPorDistrito = () => {
    const litrosPorDistrito: Record<string, number> = {};
    
    recogidas.forEach((recogida) => {
      if (recogida.distrito && recogida.litrosRecogidos) {
        if (!litrosPorDistrito[recogida.distrito]) {
          litrosPorDistrito[recogida.distrito] = 0;
        }
        litrosPorDistrito[recogida.distrito] += recogida.litrosRecogidos;
      }
    });
    
    return litrosPorDistrito;
  };

  const calcularPromedioLitrosPorRecogida = () => {
    const recogidasCompletadas = recogidas.filter(r => r.estadoRecogida === "completada" || r.completada);
    if (recogidasCompletadas.length === 0) return 0;
    
    const totalLitros = recogidasCompletadas.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);
    return totalLitros / recogidasCompletadas.length;
  };

  const calcularPromedioLitrosPorPeriodo = () => {
    // Example calculation - can be customized as needed
    const totalLitros = getTotalLitrosRecogidos();
    const diasTotales = 30; // Assuming a 30-day period
    
    return totalLitros / diasTotales;
  };

  return {
    getTotalLitrosRecogidos,
    getTotalLitrosRecogidosPorRuta,
    getLitrosRecolectadosPorDistrito,
    calcularPromedioLitrosPorRecogida,
    calcularPromedioLitrosPorPeriodo
  };
}
