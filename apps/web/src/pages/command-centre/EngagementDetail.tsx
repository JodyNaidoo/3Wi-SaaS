/**
 * Engagement detail — operations / director view of one engagement.
 *
 * Shows the captured intake data, lifecycle status, and lets a director
 * progress the engagement through the workflow states.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import {
  engagements, statusPillClasses,
  type Engagement, type EngagementStatus,
} from '../../lib/api/engagements';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities',  href: '/cc/director' },
  { key: 'G', label: 'Engagements',    href: '/cc/engagements' },
];

const STATUS_FLOW: EngagementStatus[] = ['requested', 'accepted', 'in_progress', 'delivered', 'closed'];

export function EngagementDetailCC() {
  const { id } = useParams<{ id: string }>();
  const [eng, setEng] = useState<Engagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patching, setPatching] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const r = await engagements.get(id);
      setEng(r.engagement);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [id]);

  async function moveTo(next: EngagementStatus) {
    if (!eng) return;
    setPatching(true);
    try {
      const r = await engagements.patchStatus(eng.id, { status: next });
      setEng(r.engagement);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setPatching(false);
    }
  }

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/cc/engagements" className="hover:underline">Engagements</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">{eng?.serviceName ?? 'Detail'}</span>
      </nav>

      {error ? <div className="rounded-md border border-rose-300 bg-rose-50 text-rose-800 text-sm px-3 py-2 mb-3">{error}</div> : null}
      {loading ? <p className="text-sm text-slate-500 py-6">Loading…</p> : null}

      {eng ? (
        <>
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusPillClasses(eng.status)}`}>
                {eng.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500 font-mono">{eng.serviceUnit} / {eng.serviceSlug}</span>
            </div>
            <h1 className="text-2xl font-bold">{eng.serviceName}</h1>
            <p className="text-sm text-slate-600">
              {eng.clientName}{eng.clientCompany ? ` · ${eng.clientCompany}` : ''} · requested {new Date(eng.requestedAt).toLocaleString()}
            </p>
          </div>

          {/* Lifecycle stepper */}
          <Card title="Lifecycle" className="mb-4">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, i) => {
                const reached = STATUS_FLOW.indexOf(eng.status) >= i;
                const current = eng.status === s;
                return (
                  <div key={s} className="flex items-center gap-2 shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${reached ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} ${current ? 'ring-2 ring-emerald-300' : ''}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs font-semibold uppercase ${reached ? 'text-slate-900' : 'text-slate-400'}`}>{s.replace('_', ' ')}</span>
                    {i < STATUS_FLOW.length - 1 ? <span className="w-6 h-px bg-slate-200" /> : null}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {eng.status === 'requested'   && <ActionButton label="Accept"           onClick={() => moveTo('accepted')}     disabled={patching} />}
              {eng.status === 'accepted'    && <ActionButton label="Mark in progress" onClick={() => moveTo('in_progress')}  disabled={patching} />}
              {eng.status === 'in_progress' && <ActionButton label="Mark delivered"   onClick={() => moveTo('delivered')}    disabled={patching} />}
              {eng.status === 'delivered'   && <ActionButton label="Close engagement" onClick={() => moveTo('closed')}       disabled={patching} />}
              {eng.status !== 'cancelled' && eng.status !== 'closed' &&
                <ActionButton label="Cancel" onClick={() => moveTo('cancelled')} disabled={patching} danger />}
            </div>
          </Card>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Client">
              <dl className="text-sm grid grid-cols-3 gap-y-1.5">
                <dt className="text-xs uppercase text-slate-500">Name</dt><dd className="col-span-2 font-medium">{eng.clientName}</dd>
                {eng.clientCompany ? <><dt className="text-xs uppercase text-slate-500">Company</dt><dd className="col-span-2">{eng.clientCompany}</dd></> : null}
                <dt className="text-xs uppercase text-slate-500">Email</dt><dd className="col-span-2 font-mono text-xs">{eng.clientEmail}</dd>
                {eng.clientPhone ? <><dt className="text-xs uppercase text-slate-500">Phone</dt><dd className="col-span-2 font-mono text-xs">{eng.clientPhone}</dd></> : null}
              </dl>
            </Card>

            <Card title="Scope + intake">
              <dl className="text-sm space-y-2">
                {eng.budgetIndication ? <Row label="Budget">{eng.budgetIndication}</Row> : null}
                {eng.desiredStartDate ? <Row label="Start by">{new Date(eng.desiredStartDate).toLocaleDateString()}</Row> : null}
                {eng.scopeChoices && Object.keys(eng.scopeChoices).length > 0 ? (
                  <Row label="Scope answers">
                    <ul className="ml-4 list-disc">
                      {Object.entries(eng.scopeChoices).map(([k, v]) => (
                        <li key={k}><span className="text-slate-500">{k}:</span> {String(v)}</li>
                      ))}
                    </ul>
                  </Row>
                ) : null}
                {eng.notes ? <Row label="Notes">{eng.notes}</Row> : null}
              </dl>
              {eng.scopeSummary ? (
                <details className="mt-3">
                  <summary className="text-xs text-slate-500 cursor-pointer">Auto-generated scope summary</summary>
                  <pre className="bg-slate-50 border border-slate-200 rounded-md p-3 mt-2 text-xs font-mono whitespace-pre-wrap">{eng.scopeSummary}</pre>
                </details>
              ) : null}
            </Card>

            <Card title="Integration refs">
              <dl className="text-sm space-y-1.5">
                <Row label="Scope doc">{eng.scopeDocUrl ?? <span className="text-slate-400 italic">not set</span>}</Row>
                <Row label="Deposit invoice">{eng.depositInvoiceRef ?? <span className="text-slate-400 italic">not set</span>}</Row>
                <Row label="Asana project">{eng.asanaProjectId ?? <span className="text-slate-400 italic">not set</span>}</Row>
              </dl>
              <p className="text-xs text-slate-500 mt-3 italic">
                Wire these to QuickBooks + Asana when keys are available. Until then the ops team fills them by hand.
              </p>
            </Card>

            <Card title="Timestamps">
              <dl className="text-sm space-y-1.5 font-mono text-xs">
                <Row label="Requested">{new Date(eng.requestedAt).toLocaleString()}</Row>
                {eng.acceptedAt   ? <Row label="Accepted">{new Date(eng.acceptedAt).toLocaleString()}</Row> : null}
                {eng.deliveredAt  ? <Row label="Delivered">{new Date(eng.deliveredAt).toLocaleString()}</Row> : null}
                {eng.closedAt     ? <Row label="Closed">{new Date(eng.closedAt).toLocaleString()}</Row> : null}
              </dl>
            </Card>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

function ActionButton({ label, onClick, disabled, danger }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 ${danger ? 'border border-rose-300 text-rose-700 hover:bg-rose-50' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
    >
      {label}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="col-span-2">{children}</dd>
    </div>
  );
}
