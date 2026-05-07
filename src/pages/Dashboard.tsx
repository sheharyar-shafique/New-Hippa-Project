import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  FlaskConical,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { NOTES, PATIENTS } from '../lib/mockData';
import StatusPill from '../components/StatusPill';
import { formatDate, formatDuration, initials, relTime } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const todayNotes = NOTES.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Good morning, Dr. Reyes 👋
          </h1>
          <p className="text-ink-600 mt-1">
            You have <span className="font-semibold text-ink-900">5 visits</span> on your schedule today.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/app/labs')} className="btn-secondary">
            <FlaskConical className="w-4 h-4" /> Analyze a lab
          </button>
          <button onClick={() => navigate('/app/new')} className="btn-primary">
            <Plus className="w-4 h-4" /> New consultation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={FileText}
          label="Notes this week"
          value="42"
          delta="+18% vs last week"
        />
        <Stat
          icon={Clock}
          label="Avg note draft time"
          value="6.4s"
          delta="−1.2s from baseline"
        />
        <Stat
          icon={TrendingUp}
          label="Time saved this week"
          value="4h 28m"
          delta="≈ 36 min/day"
        />
        <Stat
          icon={CheckCircle2}
          label="Notes signed today"
          value={`${todayNotes}`}
          delta="On track"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent notes */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200/70">
            <h2 className="font-semibold text-ink-900">Recent notes</h2>
            <Link to="/app/patients" className="text-sm text-brand-700 font-semibold inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-ink-200/70">
            {NOTES.map((n) => (
              <li key={n.id}>
                <Link
                  to={`/app/notes/${n.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-ink-50/70 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                    {initials(n.patientName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-ink-900 truncate">{n.patientName}</p>
                      <span className="text-xs text-ink-500">· {n.age}{n.sex.toLowerCase()}</span>
                      <StatusPill label={n.status} variant={n.status} />
                    </div>
                    <p className="text-sm text-ink-600 truncate">{n.chiefComplaint}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end text-xs text-ink-500">
                    <span>{relTime(n.createdAt)}</span>
                    <span>{formatDuration(n.durationSec)} · {formatDate(n.createdAt)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions / upcoming */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold text-ink-900">Today&rsquo;s schedule</h2>
            <ul className="mt-4 space-y-3">
              {PATIENTS.slice(0, 4).map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ink-100 text-ink-700 text-xs font-bold flex items-center justify-center">
                    {initials(p.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{p.name}</p>
                    <p className="text-xs text-ink-500 truncate">
                      {p.conditions.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-ink-500">
                    {`${9 + i}:${i % 2 === 0 ? '00' : '30'}`}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-4 btn-secondary w-full">View full schedule</button>
          </div>

          <div className="rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white p-5 shadow-soft">
            <Mic className="w-6 h-6" />
            <p className="mt-3 font-semibold">Start your next visit</p>
            <p className="text-sm text-white/80 mt-1">
              Tap to record. SOAP note drafts in seconds.
            </p>
            <button onClick={() => navigate('/app/new')} className="mt-4 btn bg-white text-brand-700 hover:bg-ink-50 w-full">
              New consultation <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: any;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs text-brand-700 mt-1">{delta}</p>
    </div>
  );
}
