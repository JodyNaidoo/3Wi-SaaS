import type { ReactNode } from 'react';

export function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {title ? <header className="px-5 py-3 border-b border-slate-100 font-semibold">{title}</header> : null}
      <div className="p-5">{children}</div>
    </section>
  );
}
