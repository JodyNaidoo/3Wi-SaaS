import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Input({ label, error, className = '', ...props }: { label?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label ? <span className="block text-sm font-medium mb-1">{label}</span> : null}
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-secondary,#0EA5A4)] ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600 mt-1">{error}</span> : null}
    </label>
  );
}

export function Textarea({ label, ...props }: { label?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label ? <span className="block text-sm font-medium mb-1">{label}</span> : null}
      <textarea
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-secondary,#0EA5A4)]"
        {...props}
      />
    </label>
  );
}
