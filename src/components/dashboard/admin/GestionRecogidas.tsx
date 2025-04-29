
// Fix for line 655 in GestionRecogidas.tsx
<RecogidasList 
  recogidas={searchFilteredRecogidas.filter(r => !r.completada)}
  onCompleteRecogida={handleCompleteRecogida}
  onViewDetails={(id) => setSelectedRecogida(id)}
/>
