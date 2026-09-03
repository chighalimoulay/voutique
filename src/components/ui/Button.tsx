import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-silk ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none select-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-mauve-500 text-white shadow-soft hover:bg-mauve-600 hover:shadow-lift',
  secondary: 'bg-softpink text-ink hover:bg-softpink-dark',
  outline: 'border border-mauve-300 bg-transparent text-ink hover:border-mauve-500 hover:bg-mauve-50',
  ghost: 'bg-transparent text-ink-soft hover:bg-mauve-50 hover:text-ink',
  whatsapp: 'bg-[#1FA855] text-white shadow-soft hover:bg-[#178F47] hover:shadow-lift',
  gold: 'bg-gold text-white shadow-gold hover:bg-gold-dark',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-8 text-base',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  );
});

interface ButtonLinkProps extends CommonProps {
  to: string;
  ariaLabel?: string;
}

/** نفس مظهر الزر لكن كرابط تنقّل داخلي — يحافظ على دلالة HTML الصحيحة. */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ariaLabel,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
    >
      {children}
    </Link>
  );
}
