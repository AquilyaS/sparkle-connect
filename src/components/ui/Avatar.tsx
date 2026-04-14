import { getInitials } from '../../utils/formatters';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export default function Avatar({ src, firstName, lastName, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`rounded-full object-cover bg-teal-100 flex-shrink-0 ${sizeClasses[size]} ${className}`}
        onError={e => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const next = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
          if (next) next.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
