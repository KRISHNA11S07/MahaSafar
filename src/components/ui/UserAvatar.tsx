import { useState } from 'react';
import './UserAvatar.css';

/**
 * A circular avatar that falls back to initials when the Google profile
 * picture is missing or fails to load. No placeholder images are bundled —
 * the fallback is drawn from the user's own name.
 */
export default function UserAvatar({
  src,
  name,
  size = 38,
  className = '',
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || 'Explorer')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const showImage = Boolean(src) && !hasError;

  return (
    <span
      className={`user-avatar ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          className="user-avatar__img"
          src={src as string}
          alt=""
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="user-avatar__initials">{initials || 'M'}</span>
      )}
    </span>
  );
}
