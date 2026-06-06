import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Stepper } from './_Stepper';

interface UserRow { phone: string; fullName: string; role: string; district?: string; }

export function Step5Users() {
  const [centres, setCentres] = useState<string[]>(['director','farmer','technical']);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [csvImporting, setCsvImporting] = useState(false);
  const nav = useNavigate();

  function toggleCentre(c: string) {
    setCentres((arr) => arr.includes(c) ? arr.filter(x => x !== c) : [...arr, c]);
  }
  function addRow(role: string) {
    setUsers((u) => [...u, { phone: '', fullName: '', role }]);
  }
  async function csv(file: File) {
    setCsvImporting(true);
    try {
      const text = await file.text();
      const rows = text.split(/\r?\n/).filter(Boolean).slice(1);
      const parsed = rows.map((r) => {
        const [phone, fullName, district, role = 'farmer'] = r.split(',');
        return { phone, fullName, district, role };
      });
      setUsers((u) => [...u, ...parsed]);
    } finally { setCsvImporting(false); }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Stepper current={5} />
      <Card title="Step 5 of 6 — User groups & users">
        <h3 className="text-sm font-semibold mb-2">Activate command centres</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {['director','psc','farmer','technical','offtaker'].map((c) => (
            <button key={c} type="button"
              className={`px-3 py-1.5 rounded text-sm capitalize ${centres.includes(c) ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
              onClick={() => toggleCentre(c)}>{c}</button>
          ))}
        </div>

        <h3 className="text-sm font-semibold mb-2">Users</h3>
        <div className="flex justify-end mb-2">
          <label className="text-xs cursor-pointer text-slate-600 hover:underline">
            {csvImporting ? 'Importing…' : 'Import CSV (phone,fullName,district,role)'}
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && csv(e.target.files[0])} />
          </label>
        </div>
        {users.map((u, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-3"><Input value={u.phone} onChange={(e) => setUsers((arr) => arr.map((x, idx) => idx === i ? { ...x, phone: e.target.value } : x))} placeholder="0712345678" /></div>
            <div className="col-span-4"><Input value={u.fullName} onChange={(e) => setUsers((arr) => arr.map((x, idx) => idx === i ? { ...x, fullName: e.target.value } : x))} placeholder="Full name" /></div>
            <div className="col-span-3"><Input value={u.district ?? ''} onChange={(e) => setUsers((arr) => arr.map((x, idx) => idx === i ? { ...x, district: e.target.value } : x))} placeholder="District" /></div>
            <div className="col-span-2 text-xs self-center">{u.role}</div>
          </div>
        ))}
        <div className="flex gap-2 mt-2 flex-wrap">
          {centres.map((c) => (
            <Button key={c} variant="secondary" type="button" onClick={() => addRow(c)}>+ Add {c}</Button>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="secondary" onClick={() => nav('/onboarding/4')}>Back</Button>
          <Button onClick={() => nav('/onboarding/6')}>Continue</Button>
        </div>
      </Card>
    </div>
  );
}
