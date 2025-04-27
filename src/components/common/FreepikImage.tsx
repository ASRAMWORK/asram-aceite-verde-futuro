
import { useEffect, useState } from 'react';
import { searchFreepikImages } from '@/utils/freepikAPI';

interface FreepikImageProps {
  query: string;
  className?: string;
  alt?: string;
}

const FreepikImage = ({ query, className = '', alt = '' }: FreepikImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchImage = async () => {
      const images = await searchFreepikImages(query);
      if (images.length > 0) {
        setImageUrl(images[0].url);
      }
    };

    fetchImage();
  }, [query]);

  if (!imageUrl) {
    return <div className="animate-pulse bg-gray-200 w-full h-full min-h-[200px]" />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt || query}
      className={className}
    />
  );
};

export default FreepikImage;

