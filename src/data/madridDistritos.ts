
export interface DistritoBarrio {
  distrito: string;
  barrios: string[];
}

export const distritos: string[] = [
  "Centro",
  "Arganzuela",
  "Retiro",
  "Salamanca",
  "Chamartín",
  "Tetuán",
  "Chamberí",
  "Fuencarral-El Pardo",
  "Moncloa-Aravaca",
  "Latina",
  "Carabanchel",
  "Usera",
  "Puente de Vallecas",
  "Moratalaz",
  "Ciudad Lineal",
  "Hortaleza",
  "Villaverde",
  "Villa de Vallecas",
  "Vicálvaro",
  "San Blas-Canillejas",
  "Barajas"
];

export const distritosConBarrios: DistritoBarrio[] = [
  {
    distrito: "Centro",
    barrios: ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"]
  },
  {
    distrito: "Arganzuela",
    barrios: ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"]
  },
  {
    distrito: "Retiro",
    barrios: ["Pacífico", "Adelfas", "Estrella", "Ibiza", "Jerónimos", "Niño Jesús"]
  },
  {
    distrito: "Salamanca",
    barrios: ["Recoletos", "Goya", "Fuente del Berro", "Guindalera", "Lista", "Castellana"]
  },
  {
    distrito: "Chamartín",
    barrios: ["El Viso", "Prosperidad", "Ciudad Jardín", "Hispanoamérica", "Nueva España", "Castilla"]
  },
  {
    distrito: "Tetuán",
    barrios: ["Bellas Vistas", "Cuatro Caminos", "Castillejos", "Almenara", "Valdeacederas", "Berruguete"]
  },
  {
    distrito: "Chamberí",
    barrios: ["Gaztambide", "Arapiles", "Trafalgar", "Almagro", "Ríos Rosas", "Vallehermoso"]
  },
  {
    distrito: "Fuencarral-El Pardo",
    barrios: ["El Pardo", "Fuentelarreina", "Peñagrande", "Pilar", "La Paz", "Valverde", "Mirasierra", "El Goloso"]
  },
  {
    distrito: "Moncloa-Aravaca",
    barrios: ["Casa de Campo", "Argüelles", "Ciudad Universitaria", "Valdezarza", "Valdemarín", "El Plantío", "Aravaca"]
  },
  {
    distrito: "Latina",
    barrios: ["Los Cármenes", "Puerta del Ángel", "Lucero", "Aluche", "Campamento", "Cuatro Vientos", "Las Águilas"]
  },
  {
    distrito: "Carabanchel",
    barrios: ["Comillas", "Opañel", "San Isidro", "Vista Alegre", "Puerta Bonita", "Buenavista", "Abrantes"]
  },
  {
    distrito: "Usera",
    barrios: ["Orcasitas", "Orcasur", "San Fermín", "Almendrales", "Moscardó", "Zofío", "Pradolongo"]
  },
  {
    distrito: "Puente de Vallecas",
    barrios: ["Entrevías", "San Diego", "Palomeras Bajas", "Palomeras Sureste", "Portazgo", "Numancia"]
  },
  {
    distrito: "Moratalaz",
    barrios: ["Pavones", "Horcajo", "Marroquina", "Media Legua", "Fontarrón", "Vinateros"]
  },
  {
    distrito: "Ciudad Lineal",
    barrios: ["Ventas", "Pueblo Nuevo", "Quintana", "Concepción", "San Pascual", "San Juan Bautista", "Colina", "Atalaya", "Costillares"]
  },
  {
    distrito: "Hortaleza",
    barrios: ["Palomas", "Piovera", "Canillas", "Pinar del Rey", "Apóstol Santiago", "Valdefuentes"]
  },
  {
    distrito: "Villaverde",
    barrios: ["Villaverde Alto", "San Cristóbal", "Butarque", "Los Rosales", "Los Ángeles"]
  },
  {
    distrito: "Villa de Vallecas",
    barrios: ["Casco Histórico de Vallecas", "Santa Eugenia", "Ensanche de Vallecas"]
  },
  {
    distrito: "Vicálvaro",
    barrios: ["Casco Histórico de Vicálvaro", "Valdebernardo", "Valderrivas", "El Cañaveral"]
  },
  {
    distrito: "San Blas-Canillejas",
    barrios: ["Simancas", "Hellín", "Amposta", "Arcos", "Rosas", "Rejas", "Canillejas", "Salvador"]
  },
  {
    distrito: "Barajas",
    barrios: ["Alameda de Osuna", "Aeropuerto", "Casco Histórico de Barajas", "Timón", "Corralejos"]
  }
];

// Función auxiliar para obtener los barrios de un distrito
export const getBarriosByDistrito = (distrito: string): string[] => {
  const distritoObj = distritosConBarrios.find(d => d.distrito === distrito);
  return distritoObj ? distritoObj.barrios : [];
};
