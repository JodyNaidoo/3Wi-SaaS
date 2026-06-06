/**
 * Stage 3 — Verifier console (Mr Solly Vuso).
 *
 * Workflow on this page:
 *   1. Queue of disbursements at status = Beneficiary-Accepted
 *   2. Verifier reviews each calculation (defence-in-depth re-shown on screen)
 *   3. Click Verify or Reject → 2FA challenge → typed name → submit
 *   4. List refreshes; verified items disappear from the queue
 */

import { useEffect, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import {
  verifications, formatRand, formatNum, statusPillClasses,
  type QueueDisbursement,
} from '../../lib/api/payment-process';
import { useAuthStore } from '../../lib/auth';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities',     href: '/cc/director' },
  { key: 'F6', label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',   href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',  href: '/cc/authorisations' },
];

type Modal = null | { kind: 'verify' | 'reject'; d: QueueDisbursement };

export function Verifications() {
  const { user } = useAuthStore();
  const [queue, setQueue] = useState<QueueDisbursement[]>([]);
  const [count, setCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const r = await verifications.queue();
      setQueue(r.queue); setCount(r.count); setTotalValue(r.totalValue);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  return (
    <Shell role={user?.role ?? 'verifier'} hotkeys={HOTKEYS}>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Verifications — Stage 3</h1>
          <p className="text-sm text-slate-500">Technical Verifier console — confirm each disbursement calculation against MOA rates.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">Queue: {count}</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Total value: {formatRand(totalValue)}</span>
        </div>
      </div>

      {error ? <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

      <Card title="Awaiting Calculation Verification">
        {loading ? (
          <p className="text-sm text-slate-500 py-6 text-center">Loading…</p>
        ) : queue.length === 0 ? (
          <p className="text-sm text-slate-500 py-10 text-center">
            No disbursements awaiting verification.
            <br />
            <span className="text-xs">Records appear here once farmers have completed Stage 2 self-verification.</span>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Grower</th>
                  <th className="px-3 py-2 text-left">District</th>
                  <th className="px-3 py-2 text-right">Funded Ha</th>
                  <th className="px-3 py-2 text-right">Mech.</th>
                  <th className="px-3 py-2 text-right">Labour</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-left">Farmer accepted</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <Td className="font-mono text-xs">{d.grower.externalRef}</Td>
                    <Td className="font-medium">{d.grower.fullName}</Td>
                    <Td>{d.grower.district ?? '—'}</Td>
                    <Td className="text-right tabular-nums">{formatNum(d.fundedHa)}</Td>
                    <Td className="text-right tabular-nums">{formatRand(d.amountMechanisation)}</Td>
                    <Td className="text-right tabular-nums">{formatRand(d.amountLabour)}</Td>
                    <Td className="text-right tabular-nums font-semibold">{formatRand(d.amountTotal)}</Td>
                    <Td className="text-xs">
                      {d.farmerSignoff?.signedFullName ?? '—'}
                      <div className="text-slate-500">{d.farmerSignoff?.signedAt?.slice(0, 10)}</div>
                    </Td>
                    <Td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setModal({ kind: 'verify', d })}
                          className="text-xs px-2 py-1 rounded bg-[var(--brand-secondary,#015807)] text-white hover:opacity-90"
                        >Verify</button>
                        <button
                          onClick={() => setModal({ kind: 'reject', d })}
                          className="text-xs px-2 py-1 rounded bg-white border border-red-300 text-red-700 hover:bg-red-50"
                        >Reject</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modal ? <SignoffModal modal={modal} onClose={() => setModal(null)} onDone={() => { setModal(null); refresh(); }} /> : null}
    </Shell>
  );
}

function SignoffModal({
  modal, onClose, onDone,
}: { modal: NonNullable<Modal>; onClose: () => void; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [signedName, setSignedName] = useState('');
  const [reason, setReason] = useState('');
  const [twofaIssued, setTwofaIssued] = useState<{ devNote?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function issueTwofa() {
    setError(null); setBusy(true);
    try {
      const r = await verifications.twofa();
      setTwofaIssued({ devNote: r.devNote });
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function doSubmit() {
    setError(null); setBusy(true);
    try {
      if (modal.kind === 'verify') {
        await verifications.verify(modal.d.id, { code, signedFullName: signedName });
      } else {
        await verifications.reject(modal.d.id, { code, signedFullName: signedName, reason });
      }
      onDone();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  const heading = modal.kind === 'verify' ? 'Verify calculation' : 'Reject calculation';
  const declaration = modal.kind === 'verify'
    ? `I, [your full name], in my capacity as designated Technical Verifier for Hempire-EC NPC, confirm that the disbursement amount for grower #${modal.d.grower.externalRef} (${formatRand(modal.d.amountTotal)}) has been calculated correctly against the rates specified in the Sunshines MOA. My verification is limited to calculation accuracy and does not extend to underlying farmer identity, mapping data, or banking information.`
    : `Rejection captures a written reason. The disbursement will return to Stage 2 for re-confirmation by the farmer.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">{heading}</h3>
        <p className="text-sm text-slate-700 mb-3">
          <span className="font-medium">{modal.d.grower.fullName}</span> — {formatRand(modal.d.amountTotal)}
        </p>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs italic mb-4">
          {declaration}
        </div>

        {error ? <div className="mb-3 p-2 rounded border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

        <div className="mb-3">
          <div className="text-xs font-semibold mb-1">1. Two-factor code</div>
          {!twofaIssued ? (
            <button onClick={issueTwofa} disabled={busy} className="w-full py-2 rounded bg-slate-900 text-white text-sm">Send 2FA challenge</button>
          ) : (
            <>
              <input
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6} inputMode="numeric"
                placeholder="6-digit code"
                className="w-full px-3 py-2 rounded border border-slate-300 text-center tracking-widest"
              />
              {twofaIssued.devNote ? <p className="text-xs text-amber-700 mt-1">{twofaIssued.devNote}</p> : null}
            </>
          )}
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold mb-1">2. Type your full name (signature)</div>
          <input value={signedName} onChange={(e) => setSignedName(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
        </div>

        {modal.kind === 'reject' ? (
          <div className="mb-3">
            <div className="text-xs font-semibold mb-1">3. Reason for rejection</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded border border-slate-300" />
          </div>
        ) : null}

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded border border-slate-300 text-sm">Cancel</button>
          <button
            onClick={doSubmit}
            disabled={busy || code.length !== 6 || signedName.length < 3 || (modal.kind === 'reject' && reason.length < 5)}
            className={`flex-1 py-2 rounded text-white text-sm ${modal.kind === 'verify' ? 'bg-[#015807]' : 'bg-red-700'} disabled:opacity-50`}
          >{busy ? 'Submitting…' : (modal.kind === 'verify' ? 'Verify & e-sign' : 'Reject & e-sign')}</button>
        </div>
      </div>
    </div>
  );
}
