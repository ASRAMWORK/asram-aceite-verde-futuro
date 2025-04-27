
const UNSPLASH_API_KEY = 'H13Dr86MtjZE0vmXZZhd56xazHenHMSel8iMVrutu7E';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

export const searchUnsplashImages = async (query: string) => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch images from Unsplash');
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((item: UnsplashImage) => ({
        id: item.id,
        url: item.urls.regular,
        thumbnail: item.urls.small,
        alt: item.alt_description
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
};
