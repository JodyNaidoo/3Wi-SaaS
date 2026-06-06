/**
 * Stage 5 — Payment loader (Hempire-EC bookkeeper).
 *
 * Two tasks on this page:
 *   1. Download bank batch CSV per authorised release batch
 *      (banking details decrypted server-side; access audit-logged)
 *   2. Per-disbursement: capture bank reference + payment date + POP
 *      → marks status as Paid (or Payment Failed on rejection)
 */

import { useEffect, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import {
  payments, authorisations, formatRand, formatNum,
  type QueueDisbursement, type ReleaseBatchSummary,
} from '../../lib/api/payment-process';
import { useAuthStore } from '../../lib/auth';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'P1',  label: 'Payment loader',   href: '/payments/loader' },
];

export function PaymentLoader() {
  const { user } = useAuthStore();
  const [queue, setQueue] = useState<QueueDisbursement[]>([]);
  const [authBatches, setAuthBatches] = useState<ReleaseBatchSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { kind: 'confirm' | 'fail'; d: QueueDisbursement }>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const [q, b] = await Promise.all([
        payments.queue(),
        authorisations.listBatches('authorised'),
      ]);
      setQueue(q.queue);
      setAuthBatches(b.batches);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function downloadCsv(batchId: string, batchCode: string) {
    setError(null);
    try {
      const blob = await payments.exportCsv(batchId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bank_batch_${batchCode}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <Shell role={user?.role ?? 'bookkeeper'} hotkeys={HOTKEYS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Payment loader — Stage 5</h1>
        <p className="text-sm text-slate-500">
          Download the bank batch file, upload to your banking platform, then capture the proof of payment per grower.
        </p>
      </div>

      {error ? <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

      <Card title="Authorised batches — download CSV" className="mb-4">
        {authBatches.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No authorised batches awaiting download.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left">Batch</th>
                <th className="px-3 py-2 text-right">Growers</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-left">Authorised by</th>
                <th className="px-3 py-2"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {authBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <Td className="font-mono text-xs">{b.batchCode}</Td>
                    <Td className="text-right tabular-nums">{b.growerCount}</Td>
                    <Td className="text-right tabular-nums font-semibold">{formatRand(b.totalAmount)}</Td>
                    <Td className="text-xs">{b.releaseSignoff?.signedFullName ?? '—'}</Td>
                    <Td>
                      <button
                        onClick={() => downloadCsv(b.id, b.batchCode)}
                        className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-700"
                      >Download bank CSV</button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Awaiting payment confirmation / POP capture">
        {loading ? <p className="text-sm text-slate-500 py-6 text-center">Loading…</p> :
         queue.length === 0 ? <p className="text-sm text-slate-500 py-10 text-center">No disbursements awaiting payment capture.</p> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Grower</th>
              <th className="px-3 py-2 text-left">Bank</th>
              <th className="px-3 py-2 text-left">Acct type</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Batch</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <Td className="font-mono text-xs">{d.grower.externalRef}</Td>
                  <Td className="font-medium">{d.grower.fullName}</Td>
                  <Td>{d.farmerSignoff?.bankingBank ?? '—'}</Td>
                  <Td className="capitalize">{d.farmerSignoff?.bankingAccountType ?? '—'}</Td>
                  <Td className="text-right tabular-nums font-semibold">{formatRand(d.amountTotal)}</Td>
                  <Td className="font-mono text-xs">{d.releaseBatch?.batchCode ?? '—'}</Td>
                  <Td>
                    <div className="flex gap-1">
                      <button onClick={() => setModal({ kind: 'confirm', d })}
                        className="text-xs px-2 py-1 rounded bg-[#015807] text-white hover:opacity-90">Confirm paid</button>
                      <button onClick={() => setModal({ kind: 'fail', d })}
                        className="text-xs px-2 py-1 rounded bg-white border border-red-300 text-red-700 hover:bg-red-50">Failed</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </Card>

      {modal ? <PaymentModal modal={modal} onClose={() => setModal(null)} onDone={() => { setModal(null); refresh(); }} /> : null}
    </Shell>
  );
}

function PaymentModal({
  modal, onClose, onDone,
}: { modal: { kind: 'confirm' | 'fail'; d: QueueDisbursement }; onClose: () => void; onDone: () => void }) {
  const [bankRef, setBankRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [popKey, setPopKey] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doSubmit() {
    setError(null); setBusy(true);
    try {
      if (modal.kind === 'confirm') {
        await payments.confirm(modal.d.id, { bankReference: bankRef, paymentDate, popStorageKey: popKey || undefined });
      } else {
        await payments.fail(modal.d.id, { reason });
      }
      onDone();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-2">{modal.kind === 'confirm' ? 'Confirm payment' : 'Mark payment failed'}</h3>
        <p className="text-sm text-slate-700 mb-4">
          <span className="font-medium">{modal.d.grower.fullName}</span> — {formatRand(modal.d.amountTotal)}
        </p>
        {error ? <div className="mb-3 p-2 rounded border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

        {modal.kind === 'confirm' ? (
          <>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">Bank reference</div>
              <input value={bankRef} onChange={(e) => setBankRef(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" placeholder="e.g. ABSA-202605-0001" />
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">Payment date</div>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" />
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">POP storage key (optional)</div>
              <input value={popKey} onChange={(e) => setPopKey(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300" placeholder="pop/sunshines/grower-12.pdf" />
              <p className="text-xs text-slate-500 mt-1">Upload the bank-issued POP PDF to Supabase Storage and paste its key here.</p>
            </div>
          </>
        ) : (
          <div className="mb-3">
            <div className="text-xs font-semibold mb-1">Reason for failure</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded border border-slate-300" placeholder="e.g. Account number rejected by bank" />
            <p className="text-xs text-slate-500 mt-1">The disbursement returns to the farmer for corrected banking details.</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded border border-slate-300 text-sm">Cancel</button>
          <button
            onClick={doSubmit}
            disabled={busy || (modal.kind === 'confirm' ? bankRef.length < 3 : reason.length < 5)}
            className={`flex-1 py-2 rounded text-white text-sm ${modal.kind === 'confirm' ? 'bg-[#015807]' : 'bg-red-700'} disabled:opacity-50`}
          >{busy ? 'Saving…' : (modal.kind === 'confirm' ? 'Confirm & attach POP' : 'Mark as failed')}</button>
        </div>
      </div>
    </div>
  );
}
