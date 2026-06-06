/**
 * Stage 4 — Authoriser console (Dr Sunshine Blouw).
 *
 * Two-tab layout:
 *   - Queue: verified disbursements not yet batched. Multi-select to create a batch.
 *   - Batches: list of release batches, status filtering, click into detail.
 * Inside a batch detail:
 *   - line items + "Authorise" / "Hold" actions (2FA gated).
 */

import { useEffect, useMemo, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import {
  authorisations, formatRand, formatNum,
  type QueueDisbursement, type ReleaseBatchSummary, type ReleaseBatchDetail,
} from '../../lib/api/payment-process';
import { useAuthStore } from '../../lib/auth';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities',     href: '/cc/director' },
  { key: 'F6', label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',   href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',  href: '/cc/authorisations' },
];

export function Authorisations() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'queue' | 'batches'>('queue');

  return (
    <Shell role={user?.role ?? 'authoriser'} hotkeys={HOTKEYS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Authorisations — Stage 4</h1>
        <p className="text-sm text-slate-500">Release Authoriser console — group verified disbursements into batches and authorise release.</p>
      </div>
      <div className="flex gap-1 mb-4">
        <Tab active={tab === 'queue'}    onClick={() => setTab('queue')}>Verified queue</Tab>
        <Tab active={tab === 'batches'}  onClick={() => setTab('batches')}>Release batches</Tab>
      </div>
      {tab === 'queue' ? <VerifiedQueue /> : <ReleaseBatches />}
    </Shell>
  );
}

function Tab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border ${active ? 'bg-[var(--brand-secondary,#015807)] text-white border-transparent' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
    >{children}</button>
  );
}

function VerifiedQueue() {
  const [queue, setQueue] = useState<QueueDisbursement[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const r = await authorisations.queue();
      setQueue(r.queue); setTotalValue(r.totalValue);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  const selectedValue = useMemo(
    () => queue.filter((d) => selected.has(d.id)).reduce((s, d) => s + Number(d.amountTotal), 0),
    [queue, selected],
  );

  async function createBatch() {
    setCreating(true); setError(null);
    try {
      await authorisations.createBatch(Array.from(selected));
      setSelected(new Set());
      await refresh();
      alert('Release batch created. Switch to "Release batches" to authorise it.');
    } catch (e) { setError((e as Error).message); }
    finally { setCreating(false); }
  }

  return (
    <>
      {error ? <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{queue.length}</span> verified disbursements
          {' · '}
          <span>Total queue value: <span className="font-semibold">{formatRand(totalValue)}</span></span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {selected.size > 0 ? (
            <>
              <span className="text-slate-700">
                Selected: <span className="font-semibold">{selected.size}</span> · {formatRand(selectedValue)}
              </span>
              <button
                onClick={createBatch}
                disabled={creating}
                className="px-3 py-1.5 rounded bg-[var(--brand-secondary,#015807)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >{creating ? 'Creating…' : `Create batch (${selected.size})`}</button>
            </>
          ) : (
            <span className="text-xs text-slate-400">Select rows to create a batch</span>
          )}
        </div>
      </div>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-500 py-6 text-center">Loading…</p>
        ) : queue.length === 0 ? (
          <p className="text-sm text-slate-500 py-10 text-center">No verified disbursements awaiting batching.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size > 0 && selected.size === queue.length}
                      onChange={(e) => setSelected(e.target.checked ? new Set(queue.map((d) => d.id)) : new Set())}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Grower</th>
                  <th className="px-3 py-2 text-left">District</th>
                  <th className="px-3 py-2 text-right">Funded Ha</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-left">Verified by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((d) => {
                  const on = selected.has(d.id);
                  return (
                    <tr key={d.id} className={on ? 'bg-emerald-50' : 'hover:bg-slate-50'}>
                      <Td>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) => {
                            const next = new Set(selected);
                            if (e.target.checked) next.add(d.id); else next.delete(d.id);
                            setSelected(next);
                          }}
                        />
                      </Td>
                      <Td className="font-mono text-xs">{d.grower.externalRef}</Td>
                      <Td className="font-medium">{d.grower.fullName}</Td>
                      <Td>{d.grower.district ?? '—'}</Td>
                      <Td className="text-right tabular-nums">{formatNum(d.fundedHa)}</Td>
                      <Td className="text-right tabular-nums font-semibold">{formatRand(d.amountTotal)}</Td>
                      <Td className="text-xs">{d.verificationSignoff?.signedFullName ?? '—'}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function ReleaseBatches() {
  const [batches, setBatches] = useState<ReleaseBatchSummary[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReleaseBatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { kind: 'authorise' | 'hold' }>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const r = await authorisations.listBatches();
      setBatches(r.batches);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function openBatch(id: string) {
    setOpenId(id);
    try {
      const r = await authorisations.getBatch(id);
      setDetail(r.batch);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <>
      {error ? <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}
      <Card title="All release batches">
        {loading ? <p className="text-sm text-slate-500 py-6 text-center">Loading…</p> :
         batches.length === 0 ? <p className="text-sm text-slate-500 py-10 text-center">No batches yet.</p> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left">Batch</th>
                <th className="px-3 py-2 text-right">Growers</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Authoriser</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <Td className="font-mono text-xs">{b.batchCode}</Td>
                  <Td className="text-right tabular-nums">{b.growerCount}</Td>
                  <Td className="text-right tabular-nums font-semibold">{formatRand(b.totalAmount)}</Td>
                  <Td><BatchStatusPill status={b.status} /></Td>
                  <Td className="text-xs">{new Date(b.createdAt).toLocaleDateString('en-ZA')}</Td>
                  <Td className="text-xs">{b.releaseSignoff?.signedFullName ?? '—'}</Td>
                  <Td>
                    <button onClick={() => openBatch(b.id)} className="text-xs text-[var(--brand-secondary,#015807)] underline">Open</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </Card>

      {openId && detail ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">Release batch {detail.batchCode}</h3>
                <p className="text-sm text-slate-500">
                  {detail.growerCount} growers · {formatRand(detail.totalAmount)} · <BatchStatusPill status={detail.status} />
                </p>
              </div>
              <button onClick={() => { setOpenId(null); setDetail(null); }} className="text-slate-500 hover:text-slate-900">✕</button>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Grower</th>
                  <th className="px-3 py-2 text-left">District</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {detail.disbursements.map((d) => (
                    <tr key={d.id}>
                      <Td className="font-mono text-xs">{d.grower.externalRef}</Td>
                      <Td>{d.grower.fullName}</Td>
                      <Td>{d.grower.district ?? '—'}</Td>
                      <Td className="text-right tabular-nums">{formatRand(d.amountTotal)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {detail.status === 'pending_auth' ? (
              <div className="flex gap-2">
                <button onClick={() => setModal({ kind: 'authorise' })} className="flex-1 py-2 rounded bg-[#015807] text-white text-sm font-semibold">Authorise release</button>
                <button onClick={() => setModal({ kind: 'hold' })} className="flex-1 py-2 rounded bg-white border border-amber-400 text-amber-800 text-sm font-semibold">Put on hold</button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 text-sm text-slate-700">
                {detail.releaseSignoff
                  ? <>Decision by <strong>{detail.releaseSignoff.signedFullName}</strong> on {detail.releaseSignoff.signedAt?.slice(0, 10)} — {detail.releaseSignoff.decision}</>
                  : 'No sign-off recorded.'}
              </div>
            )}

            {modal ? (
              <BatchSignoffModal
                kind={modal.kind} batch={detail}
                onClose={() => setModal(null)}
                onDone={() => { setModal(null); setOpenId(null); setDetail(null); refresh(); }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function BatchStatusPill({ status }: { status: string }) {
  const cls = status === 'authorised' ? 'bg-emerald-100 text-emerald-800' :
              status === 'paid' ? 'bg-blue-100 text-blue-800' :
              status === 'on_hold' ? 'bg-amber-100 text-amber-800' :
              status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-slate-100 text-slate-700';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status.replace('_', ' ')}</span>;
}

function BatchSignoffModal({
  kind, batch, onClose, onDone,
}: { kind: 'authorise' | 'hold'; batch: ReleaseBatchDetail; onClose: () => void; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [signedName, setSignedName] = useState('');
  const [reason, setReason] = useState('');
  const [attestation, setAttestation] = useState(false);
  const [twofa, setTwofa] = useState<{ devNote?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function issueTwofa() {
    setError(null); setBusy(true);
    try { const r = await authorisations.twofa(); setTwofa({ devNote: r.devNote }); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function doSubmit() {
    setError(null); setBusy(true);
    try {
      if (kind === 'authorise') {
        await authorisations.authorise(batch.id, { code, signedFullName: signedName, governanceAttestation: true });
      } else {
        await authorisations.hold(batch.id, { code, signedFullName: signedName, reason });
      }
      onDone();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  const declaration = kind === 'authorise'
    ? `I, [your full name], in my capacity as authorised signatory of Hempire-EC NPC, hereby authorise the release of funds set out in disbursement batch ${batch.batchCode}, totalling ${formatRand(batch.totalAmount)} across ${batch.growerCount} farmers under the Sunshines Project Part 1. I confirm that the budget envelope is available, that the calculations have been verified by the designated Technical Verifier, and that each grower has personally attested to their information and banking details.`
    : `Placing this batch on hold will return all line-item disbursements to "On Hold" status pending PSC review.`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">{kind === 'authorise' ? 'Authorise release' : 'Place batch on hold'}</h3>
        <p className="text-sm text-slate-700 mb-3">Batch {batch.batchCode} · {formatRand(batch.totalAmount)} · {batch.growerCount} growers</p>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs italic mb-4">
          {declaration}
        </div>

        {error ? <div className="mb-3 p-2 rounded border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

        <div className="mb-3">
          <div className="text-xs font-semibold mb-1">1. Two-factor code</div>
          {!twofa ? (
            <button onClick={issueTwofa} disabled={busy} className="w-full py-2 rounded bg-slate-900 text-white text-sm">Send 2FA challenge</button>
          ) : (
            <>
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} maxLength={6} inputMode="numeric" placeholder="6-digit code" className="w-full px-3 py-2 rounded border border-slate-300 text-center tracking-widest" />
              {twofa.devNote ? <p className="text-xs text-amber-700 mt-1">{twofa.devNote}</p> : null}
            </>
          )}
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold mb-1">2. Type your full name (signature)</div>
          <input value={signedName} onChange={(e) => setSignedName(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
        </div>

        {kind === 'authorise' ? (
          <label className="flex items-start gap-2 mb-3 text-xs">
            <input type="checkbox" checked={attestation} onChange={(e) => setAttestation(e.target.checked)} className="mt-1" />
            <span>I confirm budget is available, calculations are verified, and farmers have attested.</span>
          </label>
        ) : (
          <div className="mb-3">
            <div className="text-xs font-semibold mb-1">3. Reason for hold</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded border border-slate-300" />
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded border border-slate-300 text-sm">Cancel</button>
          <button
            onClick={doSubmit}
            disabled={busy || code.length !== 6 || signedName.length < 3 || (kind === 'authorise' && !attestation) || (kind === 'hold' && reason.length < 5)}
            className={`flex-1 py-2 rounded text-white text-sm ${kind === 'authorise' ? 'bg-[#015807]' : 'bg-amber-700'} disabled:opacity-50`}
          >{busy ? 'Submitting…' : (kind === 'authorise' ? 'Authorise & e-sign' : 'Hold & e-sign')}</button>
        </div>
      </div>
    </div>
  );
}
