import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  const styles = {
    primary: 'bg-[var(--brand-secondary,#0EA5A4)] text-white hover:opacity-90',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'bg-transparent hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}
