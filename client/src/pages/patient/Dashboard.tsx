import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Play,
  Clock,
  Video,
  ArrowRight,
} from 'lucide-react';
import { Card, StatsCard, StatusBadge, EmptyState, Spinner } from '../../components/ui';
import { useAuth } from '../../context/useAuth';
import api from '../../lib/api';

interface Report {
  id: string;
  patientName: string;
  fileName: string;
  status: string;
  language: string;
  uploadedAt: string;
  videoId: string | null;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports').then((r) => {
      setReports(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const ready = reports.filter((r) => r.status === 'READY');
  const processing = reports.filter((r) => !['READY', 'FAILED'].includes(r.status));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Hello, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Your medical reports and video explanations are shown below.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="My Reports"
          value={reports.length}
          subtitle="Total uploaded"
          icon={FileText}
          color="indigo"
        />
        <StatsCard
          title="Videos Ready"
          value={ready.length}
          subtitle="Available to watch"
          icon={Video}
          color="emerald"
        />
        <StatsCard
          title="Processing"
          value={processing.length}
          subtitle="Being generated"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Reports List */}
      <Card padding={false}>
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <h2 className="text-base font-semibold text-surface-900">My Reports</h2>
        </div>

        {reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reports yet"
            description="Your doctor will upload reports for you. Check back soon."
          />
        ) : (
          <div className="divide-y divide-surface-100">
            {reports.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-surface-50/50 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.status === 'READY'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-surface-100 text-surface-500'
                  }`}
                >
                  {r.status === 'READY' ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{r.fileName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-surface-400">
                      {new Date(r.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-surface-300">•</span>
                    <span className="text-xs text-surface-400">{r.language}</span>
                  </div>
                </div>

                {/* Status + Action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={r.status} />
                  {r.status === 'READY' && r.videoId && (
                    <Link
                      to={`/patient/videos/${r.videoId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
                    >
                      Watch <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
