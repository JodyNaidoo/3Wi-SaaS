/**
 * /cc/calendar — Master Calendar (month grid + list + filters + iCal export)
 * Cross-function view: every output, deadline, deliverable across all 3Wi units.
 */
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
const UNITS = [
  'knockout-marketing','affinity-accounting','intelligent-capital',
  'maintenance-co','hr-payroll','skills-centre','wellies','ibs-sales','three-wi-pty',
];
const EVENT_TYPES = ['deliverable','deadline','meeting','milestone','training','campaign_launch','content_publish','recurring','other'];

type Ev = {
  id: string;
  title: string;
  type: string;
  status: string;
  providerUnitSlug?: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  description?: string;
  location?: string;
  url?: string;
  customer?: { id: string; displayName: string };
};

export default function MasterCalendar() {
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('');
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Ev | null>(null);

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd   = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);

  async function reload() {
    setLoading(true);
    const params: any = { from: monthStart.toISOString(), to: monthEnd.toISOString() };
    if (unit) params.unit = unit;
    if (type) params.type = type;
    const { data } = await api.get('/calendar', { params });
    setEvents(data);
    setLoading(false);
  }
  useEffect(() => { reload(); }, [cursor.getTime(), unit, type]);

  // Build month grid (6 rows × 7 cols, Mon-first)
  const grid = useMemo(() => {
    const firstDow = (monthStart.getDay() + 6) % 7; // Mon = 0
    const start = new Date(monthStart);
    start.setDate(start.getDate() - firstDow);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i); days.push(d);
    }
    return days;
  }, [cursor.getTime()]);

  function eventsOn(date: Date) {
    const k = date.toISOString().slice(0, 10);
    return events.filter(e => e.startAt.slice(0, 10) === k);
  }
  function shiftMonth(delta: number) {
    setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }
  function downloadIcs() {
    const t = localStorage.getItem('token') ?? '';
    const url = `/api/calendar/_export/ics?token=${encodeURIComponent(t)}`;
    window.open(url, '_blank');
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, margin: 0 }}>Master Calendar</h1>
          <div style={{ color: '#666', fontSize: 13 }}>Cross-function outputs · deliverables · deadlines · meetings</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={downloadIcs} style={btnGhost}>Export .ics</button>
          <button onClick={() => setShowCreate(true)} style={btnGreen}>+ New Event</button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => shiftMonth(-1)} style={btnBrown}>‹</button>
        <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, margin: '0 8px', minWidth: 220 }}>
          {cursor.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => shiftMonth(1)}  style={btnBrown}>›</button>
        <button onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} style={btnGhost}>Today</button>

        <div style={{ marginLeft: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Select label="Unit" value={unit} onChange={setUnit} options={UNITS} />
          <Select label="Type" value={type} onChange={setType} options={EVENT_TYPES} />
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => setView('month')} style={tabStyle(view === 'month')}>Month</button>
          <button onClick={() => setView('list')}  style={tabStyle(view === 'list')}>List</button>
        </div>
      </div>

      {loading && <div>Loading…</div>}

      {!loading && view === 'month' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: HEMPIRE.brown, color: 'white' }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{ padding: 6, fontSize: 11, textAlign: 'center' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #eee', borderTop: 'none' }}>
            {grid.map((d, i) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = d.toDateString() === new Date().toDateString();
              const dayEvents = eventsOn(d);
              return (
                <div key={i} style={{
                  minHeight: 110, padding: 4, borderRight: '1px solid #eee', borderBottom: '1px solid #eee',
                  background: !inMonth ? '#fafafa' : isToday ? 'rgba(253,243,28,0.1)' : 'white',
                }}>
                  <div style={{ fontSize: 11, color: !inMonth ? '#bbb' : isToday ? HEMPIRE.brown : '#666', fontWeight: isToday ? 700 : 400 }}>
                    {d.getDate()}
                  </div>
                  {dayEvents.slice(0, 4).map(e => (
                    <button key={e.id} onClick={() => setSelected(e)} style={eventChip(e.type)}>
                      {e.title}
                    </button>
                  ))}
                  {dayEvents.length > 4 && <div style={{ fontSize: 10, color: '#666', padding: 2 }}>+{dayEvents.length - 4} more</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && view === 'list' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
              <Th>When</Th><Th>Title</Th><Th>Type</Th><Th>Unit</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && <tr><td colSpan={5} style={{ padding: 16, color: '#666' }}>No events this month.</td></tr>}
            {events.map(e => (
              <tr key={e.id} onClick={() => setSelected(e)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                <Td>{new Date(e.startAt).toLocaleString('en-ZA', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</Td>
                <Td>{e.title}</Td>
                <Td><span style={typePill(e.type)}>{e.type.replace(/_/g, ' ')}</span></Td>
                <Td>{e.providerUnitSlug ?? '—'}</Td>
                <Td>{e.status}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* LEGEND */}
      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: '#666' }}>
        {EVENT_TYPES.map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: typeColor(t), display: 'inline-block', borderRadius: 2 }} />{t.replace(/_/g, ' ')}
          </span>
        ))}
      </div>

      {selected && <EventModal ev={selected} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); reload(); }} />}
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); reload(); }} />}
    </div>
  );
}

function CreateEventModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({
    title: '', type: 'deliverable', providerUnitSlug: '',
    startAt: new Date().toISOString().slice(0, 16),
    endAt: '', allDay: false,
    isRecurring: false, recurringRule: '',
    description: '', location: '', url: '',
  });
  const [busy, setBusy] = useState(false);
  async function submit(e: any) {
    e.preventDefault(); setBusy(true);
    try {
      const payload: any = { ...form, startAt: new Date(form.startAt).toISOString() };
      if (form.endAt)   payload.endAt = new Date(form.endAt).toISOString();
      if (!form.isRecurring) { delete payload.recurringRule; delete payload.recurringUntil; }
      if (!payload.url) delete payload.url;
      Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k]; });
      await api.post('/calendar', payload);
      onSaved();
    } finally { setBusy(false); }
  }
  return (
    <div style={modalBackdrop}>
      <form onSubmit={submit} style={modalCard}>
        <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, marginTop: 0 }}>New Event</h2>
        <Row label="Title *"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></Row>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Row label="Type">
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="Provider unit">
            <select value={form.providerUnitSlug} onChange={e => setForm({ ...form, providerUnitSlug: e.target.value })} style={inp}>
              <option value="">— none —</option>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </Row>
          <Row label="Start *"><input type="datetime-local" required value={form.startAt} onChange={e => setForm({ ...form, startAt: e.target.value })} style={inp} /></Row>
          <Row label="End">    <input type="datetime-local" value={form.endAt} onChange={e => setForm({ ...form, endAt: e.target.value })} style={inp} /></Row>
        </div>
        <Row label=""><label style={{ fontSize: 13 }}><input type="checkbox" checked={form.isRecurring} onChange={e => setForm({ ...form, isRecurring: e.target.checked })} /> Recurring (RFC 5545 RRULE)</label></Row>
        {form.isRecurring && <Row label="RRULE">
          <input value={form.recurringRule} onChange={e => setForm({ ...form, recurringRule: e.target.value })}
            placeholder="FREQ=MONTHLY;BYMONTHDAY=5" style={inp} />
        </Row>}
        <Row label="Location"><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inp} /></Row>
        <Row label="URL">     <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://…" style={inp} /></Row>
        <Row label="Notes">   <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 60 }} /></Row>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
          <button type="submit" disabled={busy} style={btnGreen}>{busy ? 'Saving…' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}

function EventModal({ ev, onClose, onChanged }: { ev: Ev; onClose: () => void; onChanged: () => void }) {
  async function setStatus(status: string) {
    await api.patch(`/calendar/${ev.id}`, { status });
    onChanged();
  }
  async function del() {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/calendar/${ev.id}`);
    onChanged();
  }
  return (
    <div style={modalBackdrop}>
      <div style={modalCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, marginTop: 0 }}>{ev.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
          <span style={typePill(ev.type)}>{ev.type.replace(/_/g, ' ')}</span>
          <span style={{ marginLeft: 8 }}>{ev.providerUnitSlug ?? '—'}</span>
          <span style={{ marginLeft: 8 }}>Status: <strong>{ev.status}</strong></span>
        </div>
        <Pair k="When" v={new Date(ev.startAt).toLocaleString('en-ZA')} />
        {ev.endAt && <Pair k="Until" v={new Date(ev.endAt).toLocaleString('en-ZA')} />}
        {ev.location && <Pair k="Location" v={ev.location} />}
        {ev.url && <Pair k="Link" v={<a href={ev.url} target="_blank" rel="noreferrer" style={{ color: HEMPIRE.green }}>{ev.url}</a>} />}
        {ev.customer && <Pair k="Customer" v={ev.customer.displayName} />}
        {ev.description && <div style={{ marginTop: 8, fontSize: 14, whiteSpace: 'pre-wrap' }}>{ev.description}</div>}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          {ev.status !== 'in_progress' && <button onClick={() => setStatus('in_progress')} style={btnBrown}>Start</button>}
          {ev.status !== 'completed'   && <button onClick={() => setStatus('completed')}   style={btnGreen}>Complete</button>}
          {ev.status !== 'cancelled'   && <button onClick={() => setStatus('cancelled')}   style={btnGhost}>Cancel</button>}
          <div style={{ flex: 1 }} />
          <button onClick={del} style={{ ...btnGhost, color: '#b00020', borderColor: '#b00020' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ color: '#666' }}>{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: 3, fontSize: 13 }}>
        <option value="">All</option>
        {options.map((o: string) => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
      </select>
    </label>
  );
}

function typeColor(t: string) {
  return ({
    deliverable:     '#3F1101',
    deadline:        '#b00020',
    meeting:         '#0d47a1',
    milestone:       '#015807',
    training:        '#6a1b9a',
    campaign_launch: '#ff6f00',
    content_publish: '#00838f',
    recurring:       '#5d4037',
    other:           '#9e9e9e',
  } as any)[t] ?? '#9e9e9e';
}
function eventChip(t: string): React.CSSProperties {
  return {
    display: 'block', width: '100%', textAlign: 'left',
    background: typeColor(t), color: 'white',
    fontSize: 10, padding: '2px 4px', marginTop: 2,
    border: 'none', borderRadius: 2, cursor: 'pointer',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  };
}
function typePill(t: string): React.CSSProperties {
  return { background: typeColor(t), color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 11 };
}
const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px', background: active ? HEMPIRE.brown : 'transparent',
  color: active ? 'white' : HEMPIRE.brown, border: `1px solid ${HEMPIRE.brown}`,
  cursor: 'pointer', fontFamily: 'Roboto', fontSize: 13,
});
const Th = ({ children }: any) => <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children }: any) => <td style={{ padding: '8px 12px', fontSize: 14 }}>{children}</td>;
const btnBrown: React.CSSProperties = { padding: '6px 12px', background: HEMPIRE.brown, color: 'white', border: 'none', borderRadius: 3, fontSize: 13, cursor: 'pointer' };
const btnGreen: React.CSSProperties = { ...btnBrown, background: HEMPIRE.green };
const btnGhost: React.CSSProperties = { ...btnBrown, background: 'transparent', color: HEMPIRE.brown, border: `1px solid ${HEMPIRE.brown}` };
const modalBackdrop: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalCard: React.CSSProperties = { background: 'white', padding: 24, borderRadius: 6, width: 520, maxHeight: '90vh', overflowY: 'auto' };
const Row = ({ label, children }: any) => (<div style={{ marginBottom: 10 }}><label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</label>{children}</div>);
const Pair = ({ k, v }: any) => (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px dashed #eee' }}><span style={{ color: '#666' }}>{k}</span><span>{v}</span></div>);
const inp: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: 3, fontSize: 14, boxSizing: 'border-box' };
