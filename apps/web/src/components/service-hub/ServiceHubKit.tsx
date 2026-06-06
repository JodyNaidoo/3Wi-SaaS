/**
 * ServiceHubKit — shared components for productised service hubs.
 *
 * Replaces ~600 lines of duplication that would otherwise live in
 * each tenant page (IntelligentCapital, AffinityAccounting,
 * MaintenanceCo, HrAndPayroll, ThreeWiPtyLtd).
 *
 * Exports:
 *   - <ServiceHubShell>  — Shell + breadcrumb wrapper
 *   - <ServiceTile>      — clickable tile on a hub page
 *   - <ServiceDetail>    — detail page shell with phases, RACI, tooling, engage CTA
 *   - <Breadcrumb>       — generic crumbs from an array
 */

import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../ui/Shell';
import { Card } from '../ui/Card';
import { EngagementIntakeModal, type ServicePreset } from '../engagements/EngagementIntakeModal';

export const COMMON_HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

export interface Crumb { label: string; href?: string }

/** Generic breadcrumb. Last item is always the current page (no href). */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i}>
            {isLast || !c.href
              ? <span className="text-slate-900 font-semibold">{c.label}</span>
              : <Link to={c.href} className="hover:underline">{c.label}</Link>}
            {!isLast ? <span className="mx-1.5 text-slate-400">›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

/** Wraps Shell + breadcrumb + page header for a hub page. */
export function ServiceHubShell({
  crumbs, eyebrow, eyebrowColour, title, intro, children, hotkeys = COMMON_HOTKEYS,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  eyebrowColour: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  hotkeys?: Hotkey[];
}) {
  return (
    <Shell role="director" hotkeys={hotkeys}>
      <Breadcrumb crumbs={crumbs} />
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: eyebrowColour }}>
          {eyebrow}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <div className="text-sm text-slate-600 mt-1 max-w-3xl">{intro}</div>
      </div>
      {children}
    </Shell>
  );
}

/** Hub tile that links to a service detail page. */
export function ServiceTile({
  to, initials, name, tagline, meta, bullets, colour,
}: {
  to: string;
  initials: string;
  name: string;
  tagline: string;
  meta: string;
  bullets: string[];
  colour: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-6 transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white text-sm font-bold"
              style={{ background: colour }}>{initials}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${colour}15`, color: colour }}>{meta}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{name}</h2>
      <p className="text-xs text-slate-600 mb-3">{tagline}</p>
      <div className="text-xs text-slate-500 space-y-0.5">
        {bullets.map((b) => <div key={b}>• {b}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: colour }}>
        Open &nbsp;→
      </div>
    </Link>
  );
}

export interface Phase {
  step: string;
  label: string;
  activities: string[];
  deliverable: string;
  duration?: string;
  gate?: string;
}

export interface RaciRow {
  role: string;
  cells: string[];
}

/** Service detail page shell. Use this for any productised service page. */
export function ServiceDetail({
  crumbs, name, tagline, badge, colour, initials,
  facts, phases, raciHeaders, raciRows, tooling, definitionOfDone, pricingNotes,
  engagePreset, hotkeys = COMMON_HOTKEYS,
}: {
  crumbs: Crumb[];
  name: string;
  tagline: string;
  badge: string;
  colour: string;
  initials: string;
  facts: { label: string; value: string }[];
  phases: Phase[];
  raciHeaders: string[];
  raciRows: RaciRow[];
  tooling: string;
  definitionOfDone: string;
  pricingNotes: string;
  engagePreset?: ServicePreset; // optional - omit to hide engage CTA
  hotkeys?: Hotkey[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Shell role="director" hotkeys={hotkeys}>
      <Breadcrumb crumbs={crumbs} />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${colour}33`, background: `${colour}08` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: colour }}>{initials}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${colour}20`, color: colour }}>{badge}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-600 mt-1">{tagline}</p>
          </div>
        </div>
      </div>

      {/* Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{f.label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Phases */}
      <div className="max-w-6xl mb-6">
        <Card title="Workflow — phases, activities, gates">
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {phases.map((p, idx) => (
              <li key={p.step} className="ml-6">
                <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                      style={{ background: colour }}>{idx + 1}</span>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h4 className="text-base font-bold text-slate-900">{p.label}</h4>
                  {p.duration ? <span className="text-xs font-mono text-slate-500">{p.duration}</span> : null}
                </div>
                <ul className="text-sm text-slate-700 list-disc ml-5 space-y-0.5 mb-2">
                  {p.activities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">Deliverable:</span> {p.deliverable}
                </div>
                {p.gate ? (
                  <div className="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded"
                       style={{ background: `${colour}15`, color: colour }}>
                    ────── GATE: {p.gate} ──────
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* RACI + Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 max-w-6xl">
        <Card title="RACI — Responsible · Accountable · Consulted · Informed">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-2 py-2 font-semibold">Role</th>
                  {raciHeaders.map((h) => (
                    <th key={h} className="px-2 py-2 font-semibold text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raciRows.map((r) => (
                  <tr key={r.role} className="border-t border-slate-100">
                    <td className="px-2 py-1.5 font-medium">{r.role}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className="px-2 py-1.5 text-center font-mono">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Pricing + Definition of Done">
          <div className="text-sm text-slate-700 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Pricing</div>
              <p>{pricingNotes}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Definition of Done</div>
              <p>{definitionOfDone}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tooling */}
      <div className="max-w-6xl mb-6">
        <Card title="Standard tooling stack">
          <p className="text-sm text-slate-700">{tooling}</p>
        </Card>
      </div>

      {/* Engage CTA */}
      {engagePreset ? (
        <div className="max-w-6xl">
          <div className="rounded-xl border-2 p-5 flex items-center justify-between gap-4"
               style={{ borderColor: `${colour}55`, background: `${colour}05` }}>
            <div className="text-sm" style={{ color: colour }}>
              <span className="font-semibold">Engage this service →</span>{' '}
              Submit a request and our team will scope, contract and schedule kick-off.
            </div>
            <button type="button" onClick={() => setOpen(true)}
                    className="px-5 py-2 rounded-lg text-white font-semibold text-sm shrink-0"
                    style={{ background: colour }}>
              Engage
            </button>
          </div>
          <EngagementIntakeModal isOpen={open} onClose={() => setOpen(false)} preset={engagePreset} />
        </div>
      ) : null}
    </Shell>
  );
}
