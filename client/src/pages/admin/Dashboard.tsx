import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Video,
  Activity,
  ArrowUpRight,
  Clock,
  Globe,
  BarChart3,
} from 'lucide-react';
import { Card, StatsCard, StatusBadge, Spinner } from '../../components/ui';
import { useAuth } from '../../context/useAuth';
import api from '../../lib/api';

interface AdminStats {
  totalPatients: number;
  totalReports: number;
  videosGenerated: number;
  processingNow: number;
  avgProcessingTime: number;
  languageBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  recentActivity: {
    id: string;
    action: string;
    userName: string;
    target: string;
    timestamp: string;
  }[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then((r) => {
      setStats(r.data);
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

  if (!stats) return null;

  const actionLabels: Record<string, string> = {
    REPORT_UPLOADED: 'Uploaded report',
    EXTRACTION_COMPLETE: 'Extraction done',
    VIDEO_GENERATED: 'Video generated',
    VIDEO_ACCESSED: 'Video viewed',
    PATIENT_REGISTERED: 'Patient registered',
    REPORT_DELETED: 'Report deleted',
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Welcome back, {user?.name?.split(' ').pop()}
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Here&apos;s what&apos;s happening with your patients today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          subtitle="Registered users"
          icon={Users}
          color="indigo"
        />
        <StatsCard
          title="Total Reports"
          value={stats.totalReports}
          subtitle="All uploaded reports"
          icon={FileText}
          color="cyan"
        />
        <StatsCard
          title="Videos Generated"
          value={stats.videosGenerated}
          subtitle="Successfully processed"
          icon={Video}
          color="emerald"
        />
        <StatsCard
          title="Processing Now"
          value={stats.processingNow}
          subtitle={`Avg ${stats.avgProcessingTime}s`}
          icon={Activity}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="xl:col-span-2" padding={false}>
          <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
            <h2 className="text-base font-semibold text-surface-900">Recent Activity</h2>
            <Link
              to="/admin/audit"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100">
            {stats.recentActivity.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-surface-50/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-surface-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-surface-800 truncate">
                    <span className="font-medium">{log.userName}</span>{' '}
                    <span className="text-surface-500">
                      {actionLabels[log.action] ?? log.action}
                    </span>
                  </p>
                  <p className="text-xs text-surface-400 truncate">{log.target}</p>
                </div>
                <time className="text-xs text-surface-400 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Language Breakdown */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-surface-500" />
              <h3 className="text-sm font-semibold text-surface-900">Languages</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(stats.languageBreakdown).map(([lang, count]) => {
                const pct = Math.round((count / stats.totalReports) * 100);
                return (
                  <div key={lang}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-700 font-medium">{lang}</span>
                      <span className="text-surface-400">{count}</span>
                    </div>
                    <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-surface-500" />
              <h3 className="text-sm font-semibold text-surface-900">Report Status</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span className="text-sm font-semibold text-surface-700">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/admin/upload"
                className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-800 group-hover:text-primary-700">
                    Upload Report
                  </p>
                  <p className="text-xs text-surface-400">Process a new medical report</p>
                </div>
              </Link>
              <Link
                to="/admin/patients"
                className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-800 group-hover:text-primary-700">
                    View Patients
                  </p>
                  <p className="text-xs text-surface-400">Manage patient records</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
