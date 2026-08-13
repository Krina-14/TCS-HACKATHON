import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

interface AvatarProps {
  className?: string;
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

export const Avatar: React.FC<AvatarProps> = ({
  className = '',
  src,
  name,
  size = 'md',
  status,
}) => {
  // Size classes
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusDotSizes = {
    xs: 'w-2 h-2 border-[1px]',
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2',
  };

  const statusColors = {
    online: 'bg-success',
    away: 'bg-warning',
    busy: 'bg-danger',
    offline: 'bg-text-muted',
  };

  // Extract initials
  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return (first + last).toUpperCase();
  };

  // Generate deterministic colors
  const getHashColor = (fullName: string) => {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 45%)`;
  };

  const initials = getInitials(name);
  const hashColor = getHashColor(name);

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-full object-cover border border-border flex items-center justify-center ${sizeStyles[size]}`}
          onError={(e) => {
            // Remove src if image fails to load
            (e.target as HTMLImageElement).src = '';
          }}
        />
      ) : (
        <div
          style={{ backgroundColor: hashColor }}
          className={`rounded-full flex items-center justify-center text-white font-bold font-mono border border-white/10 ${sizeStyles[size]}`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-bg-card ${statusColors[status]} ${statusDotSizes[size]}`}
          style={{ transform: 'translate(10%, 10%)' }}
        />
      )}
    </div>
  );
};
