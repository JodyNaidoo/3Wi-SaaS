/**
 * ECRDA Sub-Hub.
 *
 * Reached from the PSC Hub via the "ECRDA" tile.
 * Lists each ECRDA stakeholder in the Sunshines Project ecosystem
 * + the existing live closure dashboard (/cc/ecrda).
 *
 * Org chart (per Jody):
 *
 *   Mr Simpiwe Somdyala  (ECRDA CEO)
 *     │
 *   Mr Quvile  (Programme Head — 150 ha / R 9m FY target)
 *     │
 *   Dr Sunshine Blouw  (Programme Manager — Sunshines operational lead)
 *     │
 *     ├── Luvo QongQo  (Agronomist)
 *     └── Solly Vuso  (GIS Specialist)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC  ›  PSC  ›  ECRDA
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',         href: '/cc/director' },
  { key: 'F6',  label: 'Growers',              href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',        href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',       href: '/cc/authorisations' },
  { key: 'E',   label: 'ECRDA closure',        href: '/cc/ecrda' },
];

/* ──────────────────────────────────────────────────────────────────
 *  ECRDA HUB — tile grid
 * ────────────────────────────────────────────────────────────────── */
export function EcrdaHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb current="ECRDA" />

      {/* Header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#015807] mb-1">
          PSC · Active funder
        </div>
        <h1 className="text-3xl font-bold text-slate-900">ECRDA — Eastern Cape Rural Development Agency</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Sunshines Project Part 1 funder · R 3 200 000 envelope · 46 growers. Each tile is a personal workspace
          for a named ECRDA stakeholder. The closure dashboard is the read-only POP &amp; payment-status view.
        </p>
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <PersonTile
          slug="somdyala"
          initials="SS"
          name="Mr Simpiwe Somdyala"
          role="ECRDA CEO"
          tags={['Board-level oversight', 'Programme accountability']}
          accent="#1F4D2C"
          badge="CEO"
        />
        <PersonTile
          slug="quvile"
          initials="MQ"
          name="Mr Quvile"
          role="Programme Head — Hemp & Industrial Crops"
          tags={['FY target: 150 ha · R 9m', 'Direct line to Dr Blouw']}
          accent="#015807"
          badge="Programme Head"
        />
        <PersonTile
          slug="blouw"
          initials="SB"
          name="Dr Sunshine Blouw"
          role="Programme Manager — Sunshines operational lead"
          tags={['46 P1 growers', '48.92 funded ha · R 536 589.80']}
          accent="#2D7A3E"
          badge="Sunshines PM"
        />
        <PersonTile
          slug="qongqo"
          initials="LQ"
          name="Luvo QongQo"
          role="Agronomist — reports to Dr Blouw"
          tags={['Crop health & cultivation', 'Per-grower agronomy notes']}
          accent="#4F7942"
          badge="Agronomist"
        />
        <PersonTile
          slug="vuso"
          initials="SV"
          name="Solly Vuso"
          role="GIS Specialist — reports to Dr Blouw"
          tags={['Plot mapping · GPS verification', 'Hectare reconciliation']}
          accent="#8B5A2B"
          badge="GIS"
        />

        {/* Closure dashboard tile (existing /cc/ecrda) */}
        <Link
          to="/cc/ecrda"
          className="group block rounded-xl border-2 border-[#015807]/40 hover:border-[#015807] bg-gradient-to-br from-[#015807]/5 to-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807] text-white text-sm font-bold">
              POP
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">Live</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Closure Dashboard</h2>
          <p className="text-xs text-slate-600 mb-3">
            Read-only POP &amp; payment status. Banking details are <span className="font-semibold">never</span> displayed here.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Per-grower payment progress</div>
            <div>• POP downloads via signed URL</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#015807] group-hover:underline">Open closure dashboard &nbsp;→</div>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 max-w-6xl">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → IBS Consulting → Hempire EC → PSC → <span className="font-semibold text-[#015807]">ECRDA</span> → [Somdyala | Quvile | Blouw | QongQo | Vuso | Closure]
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable tile for a person
 * ────────────────────────────────────────────────────────────────── */
function PersonTile({
  slug, initials, name, role, tags, accent, badge,
}: {
  slug: string;
  initials: string;
  name: string;
  role: string;
  tags: string[];
  accent: string;
  badge: string;
}) {
  return (
    <Link
      to={`/tenants/ibs/consulting/hempire-ec/psc/ecrda/${slug}`}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-6 transition-all"
      style={{ borderColor: undefined }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white text-sm font-bold"
          style={{ background: accent }}
        >
          {initials}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${accent}15`, color: accent }}
        >
          {badge}
        </span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{name}</h2>
      <p className="text-xs text-slate-600 mb-3">{role}</p>
      <div className="text-xs text-slate-500 space-y-0.5">
        {tags.map((t) => <div key={t}>• {t}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: accent }}>
        Open workspace &nbsp;→
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Shared breadcrumb
 * ────────────────────────────────────────────────────────────────── */
function Breadcrumb({ current, person }: { current: string; person?: string }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      <Link to="/cc/director" className="hover:underline">3Wi</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/consulting" className="hover:underline">IBS Consulting</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/consulting/hempire-ec" className="hover:underline">Hempire EC</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/consulting/hempire-ec/psc" className="hover:underline">PSC</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      {person
        ? <>
            <Link to="/tenants/ibs/consulting/hempire-ec/psc/ecrda" className="hover:underline">ECRDA</Link>
            <span className="mx-1.5 text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">{person}</span>
          </>
        : <span className="text-slate-900 font-semibold">{current}</span>}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable workspace shell for a person page
 * ────────────────────────────────────────────────────────────────── */
function PersonWorkspace({
  name, role, reportsTo, contact, accent, badge, initials, breadcrumbName,
  kpis, sections, footerNotes,
}: {
  name: string;
  role: string;
  reportsTo?: string;
  contact?: { email?: string; phone?: string };
  accent: string;
  badge: string;
  initials: string;
  breadcrumbName: string;
  kpis: { label: string; value: ReactNode; sub?: string }[];
  sections: { title: string; children: ReactNode }[];
  footerNotes?: ReactNode;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb current="ECRDA" person={breadcrumbName} />

      {/* Person header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${accent}33`, background: `${accent}08` }}>
        <div className="flex items-start gap-5">
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
            style={{ background: accent }}
          >
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${accent}20`, color: accent }}>
                {badge}
              </span>
              {reportsTo
                ? <span className="text-xs text-slate-500">Reports to: <span className="font-medium">{reportsTo}</span></span>
                : null}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-600 mt-1">{role}</p>
            {contact
              ? <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {contact.email ? <span>✉ <span className="font-mono">{contact.email}</span></span> : null}
                  {contact.phone ? <span>☎ <span className="font-mono">{contact.phone}</span></span> : null}
                </div>
              : null}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      {kpis.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{k.label}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{k.value}</div>
              {k.sub ? <div className="text-xs text-slate-500 mt-0.5">{k.sub}</div> : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* Workspace sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
        {sections.map((s) => (
          <Card key={s.title} title={s.title}>{s.children}</Card>
        ))}
      </div>

      {/* Optional footer */}
      {footerNotes
        ? <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 max-w-6xl">{footerNotes}</div>
        : null}
    </Shell>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Helper: action link
 * ────────────────────────────────────────────────────────────────── */
function ActionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="block px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-sm">
      {children}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Mr Simpiwe Somdyala — ECRDA CEO
 * ══════════════════════════════════════════════════════════════════ */
export function SomdyalaPage() {
  return (
    <PersonWorkspace
      name="Mr Simpiwe Somdyala"
      role="Chief Executive Officer — ECRDA"
      reportsTo="ECRDA Board"
      accent="#1F4D2C"
      badge="CEO"
      initials="SS"
      breadcrumbName="Somdyala"
      kpis={[
        { label: 'P1 Envelope', value: 'R 3.2 m', sub: 'Sunshines Seedlings Cohort' },
        { label: 'Allocated',   value: 'R 536 590', sub: '16.8% of envelope' },
        { label: 'Growers',     value: '46',     sub: 'Eastern Cape, 6 districts' },
        { label: 'Programme',   value: 'Hemp',   sub: 'FY target 150 ha / R 9m' },
      ]}
      sections={[
        {
          title: 'Executive surfaces',
          children: (
            <div className="space-y-2">
              <ActionLink to="/cc/director">All-entity director dashboard</ActionLink>
              <ActionLink to="/cc/psc">PSC working dashboard (Part 1 budget)</ActionLink>
              <ActionLink to="/cc/ecrda">Live POP &amp; payment status</ActionLink>
            </div>
          ),
        },
        {
          title: 'Board-pack ready exports',
          children: (
            <div className="space-y-2 text-sm text-slate-700">
              <p>Quarterly PSC pack — auto-generated PDF/DOCX with KPIs, district maps, risk register and photos.</p>
              <p className="text-xs text-slate-500 italic">Generator stub — wire to <code>/api/reports/psc-pack</code> when ready.</p>
            </div>
          ),
        },
        {
          title: 'Programme accountability',
          children: (
            <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
              <li>P1 Sunshines Seedlings Cohort — R 3,2m envelope, 16.8% allocated</li>
              <li>Mr Quvile is accountable for FY target (150 ha / R 9m)</li>
              <li>Dr Blouw is the operational programme manager</li>
            </ul>
          ),
        },
        {
          title: 'Outstanding board items',
          children: (
            <p className="text-sm text-slate-500 italic">No open items. Wire to <code>/api/risks?level=board</code> when ready.</p>
          ),
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Mr Quvile — Programme Head
 * ══════════════════════════════════════════════════════════════════ */
export function QuvilePage() {
  return (
    <PersonWorkspace
      name="Mr Quvile"
      role="Programme Head — Hemp & Industrial Crops"
      reportsTo="Mr Simpiwe Somdyala (CEO)"
      accent="#015807"
      badge="Programme Head"
      initials="MQ"
      breadcrumbName="Quvile"
      kpis={[
        { label: 'FY Hectare Target', value: '150 ha',  sub: 'Across all programmes' },
        { label: 'FY Budget',         value: 'R 9.0m',  sub: 'Total disbursement authority' },
        { label: 'Sunshines P1',      value: '48.92 ha',sub: '32.6% of FY target' },
        { label: 'Sunshines P1 Spend',value: 'R 536 590',sub: '6.0% of FY budget' },
      ]}
      sections={[
        {
          title: 'Programme portfolio',
          children: (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Sunshines P1 (Seedlings) — 46 growers, 48.92 ha</span><span className="font-mono text-emerald-700">Live</span></div>
              <div className="flex justify-between"><span>Sunshines P2 (DSBD Seed Cohort)</span><span className="font-mono text-amber-700">Planning</span></div>
              <div className="flex justify-between"><span>FY balance — additional cohorts TBC</span><span className="font-mono text-slate-500">~101 ha to land</span></div>
            </div>
          ),
        },
        {
          title: 'Operational surfaces',
          children: (
            <div className="space-y-2">
              <ActionLink to="/cc/psc">PSC working dashboard</ActionLink>
              <ActionLink to="/cc/growers">Growers register (all programmes)</ActionLink>
              <ActionLink to="/cc/authorisations">Authorisations queue</ActionLink>
              <ActionLink to="/cc/ecrda">POP dashboard</ActionLink>
            </div>
          ),
        },
        {
          title: 'FY target progress',
          children: (
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Hectares landed</span><span className="font-mono">48.92 / 150 ha · 32.6%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#015807]" style={{ width: '32.6%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Budget committed</span><span className="font-mono">R 0.54m / R 9.0m · 6.0%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#015807]" style={{ width: '6.0%' }} />
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">Headline: hectares ahead of spend curve — Sunshines is the most capital-efficient cohort to date.</p>
            </div>
          ),
        },
        {
          title: 'Direct reports',
          children: (
            <div className="space-y-2">
              <ActionLink to="/tenants/ibs/consulting/hempire-ec/psc/ecrda/blouw">Dr Sunshine Blouw — Sunshines PM</ActionLink>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Dr Sunshine Blouw — Sunshines Programme Manager
 * ══════════════════════════════════════════════════════════════════ */
export function BlouwPage() {
  return (
    <PersonWorkspace
      name="Dr Sunshine Blouw"
      role="Programme Manager — Sunshines (operational lead)"
      reportsTo="Mr Quvile (Programme Head)"
      accent="#2D7A3E"
      badge="Sunshines PM"
      initials="SB"
      breadcrumbName="Dr Blouw"
      kpis={[
        { label: 'Growers',         value: '46',           sub: '6 districts' },
        { label: 'Funded Ha',       value: '48.92 ha',     sub: 'R 10 968.72 / ha' },
        { label: 'Envelope',        value: 'R 536 589.80', sub: 'Mech + labour' },
        { label: 'Banking Ready',   value: '11 / 46',      sub: 'R 194 146.35 ready' },
      ]}
      sections={[
        {
          title: 'Operational surfaces',
          children: (
            <div className="space-y-2">
              <ActionLink to="/cc/growers">Growers register</ActionLink>
              <ActionLink to="/cc/verifications">Verifications queue</ActionLink>
              <ActionLink to="/cc/authorisations">Authorisations queue</ActionLink>
              <ActionLink to="/payments/loader">Payment loader</ActionLink>
            </div>
          ),
        },
        {
          title: 'Per-district breakdown (P1)',
          children: (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">District</th><th className="text-right">Growers</th><th className="text-right">Funded Ha</th></tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Amathole</td><td className="text-right font-mono">24</td><td className="text-right font-mono">19.92</td></tr>
                <tr><td className="py-1">Buffalo City</td><td className="text-right font-mono">7</td><td className="text-right font-mono">2.50</td></tr>
                <tr><td className="py-1">Sarah Baartman</td><td className="text-right font-mono">7</td><td className="text-right font-mono">7.30</td></tr>
                <tr><td className="py-1">OR Tambo</td><td className="text-right font-mono">3</td><td className="text-right font-mono">2.10</td></tr>
                <tr><td className="py-1">Joe Gqabi</td><td className="text-right font-mono">3</td><td className="text-right font-mono">12.40</td></tr>
                <tr><td className="py-1">Chris Hani</td><td className="text-right font-mono">2</td><td className="text-right font-mono">4.70</td></tr>
                <tr className="border-t border-slate-200 font-semibold"><td className="py-1">TOTAL</td><td className="text-right font-mono">46</td><td className="text-right font-mono">48.92</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          title: 'Team',
          children: (
            <div className="space-y-2">
              <ActionLink to="/tenants/ibs/consulting/hempire-ec/psc/ecrda/qongqo">Luvo QongQo — Agronomist</ActionLink>
              <ActionLink to="/tenants/ibs/consulting/hempire-ec/psc/ecrda/vuso">Solly Vuso — GIS Specialist</ActionLink>
            </div>
          ),
        },
        {
          title: 'Outstanding banking (35 growers)',
          children: (
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-rose-700">R 342 443.45</span> blocked on banking collection.
              See the <Link to="/cc/growers" className="underline text-[#2D7A3E]">growers register</Link> or the latest
              disbursement schedule Excel for the request list per coordinator.
            </p>
          ),
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Luvo QongQo — Agronomist
 * ══════════════════════════════════════════════════════════════════ */
export function QongqoPage() {
  return (
    <PersonWorkspace
      name="Luvo QongQo"
      role="Agronomist — Sunshines Programme"
      reportsTo="Dr Sunshine Blouw"
      accent="#4F7942"
      badge="Agronomist"
      initials="LQ"
      breadcrumbName="QongQo"
      kpis={[
        { label: 'Growers',          value: '46',     sub: 'Active P1 cohort' },
        { label: 'Districts covered',value: '6',      sub: 'Site visit catchment' },
        { label: 'Seedlings planted',value: 'TBC',    sub: 'Aggregate across cohort' },
        { label: 'Outliers flagged', value: 'TBC',    sub: 'Crop-health concerns' },
      ]}
      sections={[
        {
          title: 'Field surfaces',
          children: (
            <div className="space-y-2">
              <ActionLink to="/cc/growers">Growers register (agronomy view)</ActionLink>
              <ActionLink to="/cc/verifications">Verifications — confirm cultivation</ActionLink>
            </div>
          ),
        },
        {
          title: 'Agronomy responsibilities',
          children: (
            <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
              <li>Crop establishment monitoring (seedling survival, transplant shock)</li>
              <li>Pest &amp; disease scouting and recommendations</li>
              <li>Nutrient management — soil tests, fertiliser scheduling</li>
              <li>Harvest readiness — CBD %, moisture, milling spec (Appendix A)</li>
              <li>Outlier escalation to Dr Blouw + GIS verification with Solly Vuso</li>
            </ul>
          ),
        },
        {
          title: 'Cohort programme split',
          children: (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Programme</th><th className="text-right">Growers</th></tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Commercial Trial</td><td className="text-right font-mono">~30</td></tr>
                <tr><td className="py-1">Medigrow</td><td className="text-right font-mono">~16</td></tr>
                <tr className="border-t border-slate-200 font-semibold"><td className="py-1">TOTAL</td><td className="text-right font-mono">46</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          title: 'Reports up',
          children: (
            <div className="space-y-2">
              <ActionLink to="/tenants/ibs/consulting/hempire-ec/psc/ecrda/blouw">Dr Sunshine Blouw — Sunshines PM</ActionLink>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Solly Vuso — GIS Specialist
 * ══════════════════════════════════════════════════════════════════ */
export function VusoPage() {
  return (
    <PersonWorkspace
      name="Solly Vuso"
      role="GIS Specialist — Sunshines Programme"
      reportsTo="Dr Sunshine Blouw"
      accent="#8B5A2B"
      badge="GIS"
      initials="SV"
      breadcrumbName="Vuso"
      kpis={[
        { label: 'Plots Mapped',      value: 'TBC',     sub: 'GPS-tagged polygons' },
        { label: 'Mapped Ha',         value: '48.92 ha',sub: 'Matches funded ha' },
        { label: 'Theoretical Ha',    value: '48.92 ha',sub: 'Per-grower from MASTER LIST' },
        { label: 'Districts',         value: '6',       sub: 'Coverage area' },
      ]}
      sections={[
        {
          title: 'GIS surfaces',
          children: (
            <div className="space-y-2">
              <ActionLink to="/cc/growers">Growers register (with GPS + Ha)</ActionLink>
              <ActionLink to="/cc/verifications">Verifications — confirm plot boundaries</ActionLink>
            </div>
          ),
        },
        {
          title: 'GIS responsibilities',
          children: (
            <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
              <li>GPS-log each plot boundary on site visits</li>
              <li>Reconcile <em>planned Ha</em> vs <em>mapped Ha</em> vs <em>theoretical Ha</em></li>
              <li>Maintain district shapefiles + grower point layers</li>
              <li>Produce district maps for the quarterly PSC pack</li>
              <li>Flag boundary disputes / PTO inconsistencies to Dr Blouw</li>
            </ul>
          ),
        },
        {
          title: 'Hectare reconciliation snapshot',
          children: (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Metric</th><th className="text-right">Ha</th></tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Planned</td><td className="text-right font-mono">48.92</td></tr>
                <tr><td className="py-1">Mapped (GPS)</td><td className="text-right font-mono">48.92</td></tr>
                <tr><td className="py-1">Theoretical (MASTER LIST)</td><td className="text-right font-mono">48.92</td></tr>
                <tr><td className="py-1">Funded</td><td className="text-right font-mono">48.92</td></tr>
                <tr className="border-t border-slate-200"><td className="py-1 text-xs text-slate-500 italic">Variance</td><td className="text-right font-mono">0.00 ha</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          title: 'Reports up',
          children: (
            <div className="space-y-2">
              <ActionLink to="/tenants/ibs/consulting/hempire-ec/psc/ecrda/blouw">Dr Sunshine Blouw — Sunshines PM</ActionLink>
            </div>
          ),
        },
      ]}
    />
  );
}
