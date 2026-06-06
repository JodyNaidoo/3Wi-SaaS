/**
 * Stage 2 — Farmer "My Farm" portal.
 *
 * Mobile-first single-page flow:
 *   1. Reference + OTP request
 *   2. OTP verify  →  farmer token
 *   3. Review own record (read-only fields + calculation breakdown)
 *   4. Accept (with banking + indemnity) OR dispute
 *   5. Success / receipt
 *
 * Pitched at a basic smartphone — large tap targets, single-column,
 * minimal Tailwind, Hempire palette.
 */

import { useEffect, useState } from 'react';
import {
  farmerOtpRequest, farmerOtpVerify, farmerGetDisbursement, farmerSubmitSignoff,
  formatRand, formatNum, type QueueDisbursement,
} from '../../lib/api/payment-process';

type Step = 'ref' | 'otp' | 'review' | 'accept' | 'dispute' | 'done';

const HEMPIRE_GREEN = 'bg-[#015807] hover:bg-[#013904]';
const HEMPIRE_BROWN = 'text-[#3F1101]';
const HEMPIRE_YELLOW = 'bg-[#FDF31C]';

export function MyFarm() {
  const [step, setStep] = useState<Step>('ref');
  const [externalRef, setExternalRef] = useState('');
  const [otpInfo, setOtpInfo] = useState<{ sentTo: string; devNote?: string } | null>(null);
  const [code, setCode] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [growerName, setGrowerName] = useState('');
  const [disbursement, setDisbursement] = useState<QueueDisbursement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // accept form
  const [accAccountHolder, setAccAccountHolder] = useState('');
  const [accBank, setAccBank] = useState('');
  const [accAccountNumber, setAccAccountNumber] = useState('');
  const [accBranchCode, setAccBranchCode] = useState('');
  const [accAccountType, setAccAccountType] = useState<'cheque' | 'savings' | 'current' | 'transmission'>('savings');
  const [accSignedName, setAccSignedName] = useState('');
  const [accIndemnity, setAccIndemnity] = useState(false);

  // dispute form
  const [disSignedName, setDisSignedName] = useState('');
  const [disReason, setDisReason] = useState('');

  async function doOtpRequest() {
    setError(null); setBusy(true);
    try {
      const refNum = Number(externalRef);
      if (!Number.isFinite(refNum) || refNum < 1) throw new Error('Enter your reference number');
      const res = await farmerOtpRequest(refNum);
      setOtpInfo({ sentTo: res.sentTo, devNote: res.devNote });
      setStep('otp');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function doOtpVerify() {
    setError(null); setBusy(true);
    try {
      const refNum = Number(externalRef);
      const res = await farmerOtpVerify(refNum, code);
      setToken(res.token);
      setGrowerName(res.grower.fullName);
      setStep('review');
      // immediately load disbursement detail
      const d = await farmerGetDisbursement(res.token);
      setDisbursement(d.disbursement);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function doAccept() {
    setError(null); setBusy(true);
    try {
      if (!token) throw new Error('Session expired — please log in again');
      if (!accIndemnity) throw new Error('You must tick the indemnity declaration to continue');
      await farmerSubmitSignoff(token, {
        decision: 'accepted',
        signedFullName: accSignedName,
        indemnityAccepted: true,
        banking: {
          accountHolder: accAccountHolder,
          bank: accBank,
          accountNumber: accAccountNumber,
          branchCode: accBranchCode,
          accountType: accAccountType,
        },
      });
      setStep('done');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function doDispute() {
    setError(null); setBusy(true);
    try {
      if (!token) throw new Error('Session expired');
      await farmerSubmitSignoff(token, {
        decision: 'disputed',
        signedFullName: disSignedName,
        disputeReason: disReason,
      });
      setStep('done');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-[#FAF6E8] flex items-start justify-center px-3 py-5">
      <div className="w-full max-w-md">
        <header className="text-center mb-5">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${HEMPIRE_YELLOW} text-[#3F1101]`}>HEMPIRE-EC NPC</div>
          <h1 className={`text-2xl font-bold mt-2 ${HEMPIRE_BROWN}`}>My Farm — Sunshines</h1>
          <p className="text-sm text-slate-600 mt-1">Payment verification portal</p>
        </header>

        {error ? (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        ) : null}

        {step === 'ref' ? (
          <section className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold mb-1">Step 1 of 4 — Enter your reference</h2>
            <p className="text-sm text-slate-600 mb-4">Find your grower reference number on the invitation we sent you.</p>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reference number</label>
            <input
              type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="off"
              value={externalRef} onChange={(e) => setExternalRef(e.target.value)}
              placeholder="e.g. 12"
              className="w-full text-lg px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#015807]"
            />
            <button
              onClick={doOtpRequest} disabled={busy || !externalRef}
              className={`mt-4 w-full text-white text-base font-semibold py-3 rounded-lg ${HEMPIRE_GREEN} disabled:opacity-50`}
            >{busy ? 'Sending…' : 'Send my one-time PIN'}</button>
          </section>
        ) : null}

        {step === 'otp' ? (
          <section className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold mb-1">Step 2 of 4 — Enter your PIN</h2>
            <p className="text-sm text-slate-600 mb-4">
              We sent a 6-digit PIN to {otpInfo?.sentTo}. It expires in 10 minutes.
            </p>
            {otpInfo?.devNote ? (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">{otpInfo.devNote}</p>
            ) : null}
            <input
              type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={6} autoComplete="one-time-code"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              className="w-full text-2xl tracking-widest text-center px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#015807]"
            />
            <button
              onClick={doOtpVerify} disabled={busy || code.length !== 6}
              className={`mt-4 w-full text-white text-base font-semibold py-3 rounded-lg ${HEMPIRE_GREEN} disabled:opacity-50`}
            >{busy ? 'Verifying…' : 'Continue'}</button>
            <button
              onClick={() => { setStep('ref'); setCode(''); }}
              className="mt-2 w-full text-sm text-slate-600 underline"
            >Re-enter my reference</button>
          </section>
        ) : null}

        {step === 'review' && disbursement ? (
          <section className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold mb-1">Step 3 of 4 — Review your details</h2>
            <p className="text-sm text-slate-600 mb-4">Please check the information below carefully.</p>

            <div className="space-y-2 text-sm mb-4">
              <Row label="Name" value={disbursement.grower.fullName} />
              <Row label="Reference" value={`#${disbursement.grower.externalRef}`} />
              <Row label="District" value={disbursement.grower.district ?? '—'} />
              <Row label="Coordinator" value={disbursement.grower.coordinator ?? '—'} />
              <Row label="Seedlings received" value={String(disbursement.grower.seedlingsReceived ?? '—')} />
              <Row label="Mapped hectares" value={formatNum(disbursement.grower.mappedHa)} />
            </div>

            <div className="rounded-lg bg-[#FAF6E8] border border-[#015807]/30 p-3 mb-4">
              <div className="text-xs font-semibold text-[#015807] uppercase tracking-wide mb-1">Your disbursement</div>
              <div className="text-2xl font-bold text-[#3F1101]">{formatRand(disbursement.amountTotal)}</div>
              <div className="text-xs text-slate-600 mt-1">
                {formatNum(disbursement.fundedHa)} Ha × R 10 968,72 / Ha
              </div>
              <div className="text-xs text-slate-700 mt-2 space-y-0.5">
                <div className="flex justify-between"><span>Mechanisation (R 7 350,00/Ha)</span><span className="font-semibold">{formatRand(disbursement.amountMechanisation)}</span></div>
                <div className="flex justify-between"><span>Labour (R 3 618,72/Ha)</span><span className="font-semibold">{formatRand(disbursement.amountLabour)}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setStep('accept')}
                className={`w-full text-white text-base font-semibold py-3 rounded-lg ${HEMPIRE_GREEN}`}
              >I confirm — please pay me</button>
              <button
                onClick={() => setStep('dispute')}
                className="w-full text-[#3F1101] text-base font-semibold py-3 rounded-lg border-2 border-[#3F1101] bg-white"
              >I dispute these figures</button>
            </div>
          </section>
        ) : null}

        {step === 'accept' ? (
          <section className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold mb-1">Step 4 of 4 — Banking & sign-off</h2>
            <p className="text-sm text-slate-600 mb-4">Hempire will pay your disbursement to the account below.</p>
            <Field label="Account holder name">
              <input value={accAccountHolder} onChange={(e) => setAccAccountHolder(e.target.value)} className="form-input" />
            </Field>
            <Field label="Bank">
              <input value={accBank} onChange={(e) => setAccBank(e.target.value)} placeholder="e.g. Standard Bank" className="form-input" />
            </Field>
            <Field label="Account number">
              <input value={accAccountNumber} onChange={(e) => setAccAccountNumber(e.target.value.replace(/\D/g, ''))} inputMode="numeric" className="form-input" />
            </Field>
            <Field label="Branch code">
              <input value={accBranchCode} onChange={(e) => setAccBranchCode(e.target.value.replace(/\D/g, ''))} inputMode="numeric" className="form-input" />
            </Field>
            <Field label="Account type">
              <select value={accAccountType} onChange={(e) => setAccAccountType(e.target.value as typeof accAccountType)} className="form-input">
                <option value="savings">Savings</option>
                <option value="cheque">Cheque</option>
                <option value="current">Current</option>
                <option value="transmission">Transmission</option>
              </select>
            </Field>
            <Field label="Your full name (signature)">
              <input value={accSignedName} onChange={(e) => setAccSignedName(e.target.value)} className="form-input" />
            </Field>

            <label className="flex items-start gap-2 mt-3 mb-4 text-xs text-slate-700">
              <input type="checkbox" checked={accIndemnity} onChange={(e) => setAccIndemnity(e.target.checked)} className="mt-1" />
              <span>
                I confirm that the information above is correct and the banking details I have supplied are mine.
                I indemnify Hempire-EC NPC and its agents from any loss arising from incorrect information I have
                supplied. I understand this electronic submission constitutes my signature in terms of the
                Electronic Communications and Transactions Act, 2002.
              </span>
            </label>

            <button
              onClick={doAccept}
              disabled={busy || !accSignedName || !accAccountHolder || !accBank || !accAccountNumber || !accBranchCode || !accIndemnity}
              className={`w-full text-white text-base font-semibold py-3 rounded-lg ${HEMPIRE_GREEN} disabled:opacity-50`}
            >{busy ? 'Submitting…' : 'Submit my verification'}</button>
            <button onClick={() => setStep('review')} className="mt-2 w-full text-sm text-slate-600 underline">Back</button>
          </section>
        ) : null}

        {step === 'dispute' ? (
          <section className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="font-semibold mb-1">Dispute these figures</h2>
            <p className="text-sm text-slate-600 mb-4">
              Your dispute will be sent to ECRDA for review. Please describe what is incorrect.
            </p>
            <Field label="Your full name (signature)">
              <input value={disSignedName} onChange={(e) => setDisSignedName(e.target.value)} className="form-input" />
            </Field>
            <Field label="What is wrong with these figures?">
              <textarea value={disReason} onChange={(e) => setDisReason(e.target.value)} rows={4} className="form-input" />
            </Field>
            <button
              onClick={doDispute}
              disabled={busy || !disSignedName || disReason.length < 10}
              className="w-full text-white text-base font-semibold py-3 rounded-lg bg-[#3F1101] hover:bg-[#2a0a01] disabled:opacity-50"
            >{busy ? 'Submitting…' : 'Submit dispute'}</button>
            <button onClick={() => setStep('review')} className="mt-2 w-full text-sm text-slate-600 underline">Back</button>
          </section>
        ) : null}

        {step === 'done' ? (
          <section className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 text-3xl mb-3">✓</div>
            <h2 className={`text-xl font-bold ${HEMPIRE_BROWN} mb-1`}>Thank you, {growerName}</h2>
            <p className="text-sm text-slate-600">
              Your submission has been received. We will send you another SMS once your payment is processed.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              Reference: #{externalRef}
            </div>
          </section>
        ) : null}

        <footer className="mt-6 text-center text-xs text-slate-500">
          Hempire-EC NPC · Sunshines Project Part 1 (Seedlings Cohort)
        </footer>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 0.5rem;
          border: 1px solid rgb(203 213 225);
          font-size: 1rem;
        }
        .form-input:focus { outline: none; border-color: #015807; }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-slate-700 mb-1">{label}</div>
      {children}
    </div>
  );
}
