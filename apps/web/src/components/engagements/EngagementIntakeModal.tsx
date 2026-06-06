/**
 * EngagementIntakeModal — captures the inputs needed to start a new engagement.
 *
 * Used by every "Engage this service" CTA across the SaaS.
 * Self-contained: open with isOpen + close with onClose. On success it shows
 * the confirmation panel before closing (caller doesn't need to handle it).
 */

import { useState } from 'react';
import { engagements, type StartEngagementInput } from '../../lib/api/engagements';

export interface ServicePreset {
  serviceUnit: string;     // "knockout-marketing"
  serviceSlug: string;     // "brand-development"
  serviceName: string;     // "Brand Development"
  accent: string;          // hex colour to brand the modal
  scopeFields?: { key: string; label: string; options?: string[]; placeholder?: string }[];
  budgetOptions?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preset: ServicePreset;
}

const DEFAULT_BUDGET_OPTIONS = [
  'Under R 25 000',
  'R 25 000 – R 100 000',
  'R 100 000 – R 250 000',
  'R 250 000 – R 1 000 000',
  'Over R 1 000 000',
  'Not sure yet',
];

export function EngagementIntakeModal({ isOpen, onClose, preset }: Props) {
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [budgetIndication, setBudgetIndication] = useState('');
  const [desiredStartDate, setDesiredStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [scopeAnswers, setScopeAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ refId: string; nextStep: string } | null>(null);

  if (!isOpen) return null;

  const budgetOptions = preset.budgetOptions ?? DEFAULT_BUDGET_OPTIONS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: StartEngagementInput = {
        serviceUnit: preset.serviceUnit,
        serviceSlug: preset.serviceSlug,
        serviceName: preset.serviceName,
        clientName,
        clientCompany: clientCompany || undefined,
        clientEmail,
        clientPhone: clientPhone || undefined,
        budgetIndication: budgetIndication || undefined,
        desiredStartDate: desiredStartDate || undefined,
        notes: notes || undefined,
        scopeChoices: Object.keys(scopeAnswers).length ? scopeAnswers : undefined,
      };
      const r = await engagements.start(payload);
      setConfirmation({ refId: r.engagement.id, nextStep: r.nextStep });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setClientName(''); setClientCompany(''); setClientEmail(''); setClientPhone('');
    setBudgetIndication(''); setDesiredStartDate(''); setNotes(''); setScopeAnswers({});
    setError(null); setConfirmation(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `6px solid ${preset.accent}` }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: preset.accent }}>
              Engage a service
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{preset.serviceName}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
            aria-label="Close"
          >×</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          {confirmation ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Engagement request received</h3>
              <p className="text-sm text-slate-600 mb-4">{confirmation.nextStep}</p>
              <div className="inline-block text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">
                Ref: {confirmation.refId}
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 rounded-lg text-white font-semibold text-sm"
                  style={{ background: preset.accent }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Your name" required value={clientName} onChange={setClientName} />
                <Field label="Company / project" value={clientCompany} onChange={setClientCompany} placeholder="optional" />
                <Field label="Email" required type="email" value={clientEmail} onChange={setClientEmail} />
                <Field label="Phone" value={clientPhone} onChange={setClientPhone} placeholder="optional" />
              </div>

              {/* Scope-specific fields */}
              {preset.scopeFields?.length ? (
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-2">About the work</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {preset.scopeFields.map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
                        {f.options ? (
                          <select
                            value={scopeAnswers[f.key] ?? ''}
                            onChange={(e) => setScopeAnswers({ ...scopeAnswers, [f.key]: e.target.value })}
                            className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                          >
                            <option value="">— Select —</option>
                            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={scopeAnswers[f.key] ?? ''}
                            placeholder={f.placeholder}
                            onChange={(e) => setScopeAnswers({ ...scopeAnswers, [f.key]: e.target.value })}
                            className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Budget + timing */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget indication</label>
                  <select
                    value={budgetIndication}
                    onChange={(e) => setBudgetIndication(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="">— Select —</option>
                    {budgetOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Desired start date</label>
                  <input
                    type="date"
                    value={desiredStartDate}
                    onChange={(e) => setDesiredStartDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Anything else to add</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                  placeholder="Context, links, references…"
                />
              </div>

              {error ? (
                <div className="rounded-md border border-rose-300 bg-rose-50 text-rose-800 text-sm px-3 py-2">
                  {error}
                </div>
              ) : null}

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !clientName || !clientEmail}
                  className="px-5 py-2 rounded-lg text-white font-semibold text-sm disabled:opacity-50"
                  style={{ background: preset.accent }}
                >
                  {submitting ? 'Sending…' : 'Submit request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = 'text', placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label} {required ? <span className="text-rose-600">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
      />
    </div>
  );
}
