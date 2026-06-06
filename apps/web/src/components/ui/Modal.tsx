import type { ReactNode } from 'react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {title ? <header className="px-5 py-3 border-b font-semibold">{title}</header> : null}
        <div className="p-5">{children}</div>
        <footer className="px-5 py-3 border-t flex justify-end">
          <button className="px-4 py-2 text-sm font-medium" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
