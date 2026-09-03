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
      className={cn('group inline-flex flex-col leading-none', className)}
      aria-label={`${storeConfig.name} — الصفحة الرئيسية`}
    >
      <span className="font-display text-xl font-bold tracking-[0.28em] text-ink transition-colors group-hover:text-mauve-600 sm:text-2xl">
        {storeConfig.name}
      </span>

      {withTagline ? (
        <span className="mt-1.5 text-xs text-ink-muted">{storeConfig.tagline}</span>
      ) : (
        <span
          className="mt-1 h-[2px] w-0 rounded-full bg-gold transition-all duration-500 ease-silk group-hover:w-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
