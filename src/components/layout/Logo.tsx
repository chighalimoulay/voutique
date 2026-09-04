import { Link } from 'react-router-dom';
import { storeConfig } from '@/config/store';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  withTagline?: boolean;
}

export function Logo({ className, withTagline = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex flex-col items-start leading-none', className)}
      aria-label={`${storeConfig.name} — الصفحة الرئيسية`}
    >
      <img
        src="/logo.png"
        alt={storeConfig.name}
        className="h-11 w-auto shrink-0 transition-transform duration-300 ease-silk group-hover:scale-105 sm:h-12"
      />

      {withTagline && (
        <span className="mt-1 text-xs text-ink-muted">{storeConfig.tagline}</span>
      )}
    </Link>
  );
}
