import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { NOTES, PATIENTS } from '../lib/mockData';
import { formatDate, initials, relTime } from '../lib/utils';
import StatusPill from '../components/StatusPill';

export default function Patients() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Patients
          </h1>
          <p className="text-ink-600 mt-1">
            {PATIENTS.length} active patients · {NOTES.length} recent notes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary"><Filter className="w-4 h-4" /> Filters</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add patient</button>
        </div>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9 bg-ink-50 border-transparent focus:bg-white" placeholder="Search by name, MRN, or condition…" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Patient</th>
                <th className="text-left font-semibold px-5 py-3">MRN</th>
                <th className="text-left font-semibold px-5 py-3">Active conditions</th>
                <th className="text-left font-semibold px-5 py-3">Last visit</th>
                <th className="text-right font-semibold px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70">
              {PATIENTS.map((p) => {
                const lastNote = NOTES.find((n) => n.patientId === p.id);
                return (
                  <tr key={p.id} className="hover:bg-ink-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                          {initials(p.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900">{p.name}</p>
                          <p className="text-xs text-ink-500">{p.age} · {p.sex === 'F' ? 'Female' : 'Male'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-600">{p.mrn}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {p.conditions.map((c) => (
                          <span key={c} className="pill bg-ink-100 text-ink-700">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-700">
                      <p>{formatDate(p.lastVisit)}</p>
                      <p className="text-xs text-ink-500">{relTime(p.lastVisit)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {lastNote ? (
                        <Link to={`/app/notes/${lastNote.id}`} className="btn-secondary inline-flex">
                          Latest note
                        </Link>
                      ) : (
                        <StatusPill label="No notes" variant="draft" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
