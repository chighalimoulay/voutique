import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-mauve-200 bg-white/60 px-6 py-16 text-center">
      {Icon && (
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mauve-50 text-mauve-500">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      )}

      <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-7 text-ink-soft">{description}</p>
      )}

      {actionLabel && actionTo && (
        <ButtonLink to={actionTo} className="mt-6">
          {actionLabel}
        </ButtonLink>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
