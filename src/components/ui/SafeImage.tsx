import { useState } from 'react';
import './SafeImage.css';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  credit?: string;
}

export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  credit,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else if (!hasError) {
      setHasError(true);
      // Clean fallback image
      setImgSrc('https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80');
    }
  };

  return (
    <div className={`safe-image-wrap ${isLoaded ? 'safe-image-wrap--loaded' : ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={`safe-image ${className} ${isLoaded ? 'safe-image--visible' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        loading={props.loading || 'lazy'}
        {...props}
      />
      {!isLoaded && <div className="safe-image-skeleton" aria-hidden="true" />}
      {credit && (
        <span className="safe-image-credit" title={`Photo credit: ${credit}`}>
          &copy; {credit}
        </span>
      )}
    </div>
  );
}
