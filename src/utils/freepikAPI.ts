
const FREEPIK_API_KEY = 'FPSX085c8f20923640c89932bdb2f811374d';
const FREEPIK_API_URL = 'https://api.freepik.com/v1';

interface FreepikSearchResponse {
  data: {
    id: string;
    title: string;
    url: string;
    image: {
      source: {
        url: string;
      };
    };
  }[];
}

export const searchFreepikImages = async (query: string) => {
  try {
    const response = await fetch(`${FREEPIK_API_URL}/resources?query=${encodeURIComponent(query)}`, {
      headers: {
        'Accept-Language': 'es-ES',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FREEPIK_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch images from Freepik');
    }

    const data: FreepikSearchResponse = await response.json();
    return data.data.map(item => ({
      id: item.id,
      title: item.title,
      url: item.image.source.url
    }));
  } catch (error) {
    console.error('Error fetching Freepik images:', error);
    return [];
  }
};

