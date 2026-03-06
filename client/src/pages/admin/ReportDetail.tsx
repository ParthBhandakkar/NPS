import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  Lightbulb,
  HeartPulse,
  MessageSquare,
} from 'lucide-react';
import { Card, StatusBadge, Spinner, Badge } from '../../components/ui';
import api from '../../lib/api';

interface LabResult {
  test: string;
  value: string;
  normalRange: string;
  status: string;
}

interface ExtractedData {
  conditions: string[];
  medications: string[];
  labResults: LabResult[];
}

interface Explanation {
  whatIsHappening: string;
  whyItMatters: string;
  whatToDo: string;
  analogy: string;
  audioScript: string;
}

interface ReportDetail {
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: string;
  language: string;
  literacyLevel: string;
  extractedData: ExtractedData | null;
  explanation: Explanation | null;
  videoId: string | null;
  processingTime: number | null;
}

interface JobStatus {
  status: string;
  progress: number;
  steps: { name: string; completed: boolean; active: boolean; pending: boolean }[];
}

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/reports/${id}`),
      api.get(`/jobs/${id}/status`).catch(() => null),
    ]).then(([rRes, jRes]) => {
      setReport(rRes.data);
      if (jRes) setJob(jRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // Poll if still processing
  useEffect(() => {
    if (!id || !report || report.status === 'READY' || report.status === 'FAILED') return;
    const interval = setInterval(async () => {
      try {
        const [rRes, jRes] = await Promise.all([
          api.get(`/reports/${id}`),
          api.get(`/jobs/${id}/status`),
        ]);
        setReport(rRes.data);
        setJob(jRes.data);
        if (rRes.data.status === 'READY' || rRes.data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, report?.status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-500">Report not found.</p>
        <Link to="/admin/reports" className="text-primary-600 text-sm mt-2 inline-block">
          Back to Reports
        </Link>
      </div>
    );
  }

  const stepIcons: Record<string, React.ReactNode> = {
    QUEUED: '⏳',
    EXTRACTING: '📄',
    ANALYZING: '🔬',
    GENERATING: '✨',
    ASSEMBLING: '🎬',
    READY: '✅',
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/reports"
          className="w-9 h-9 rounded-lg border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-surface-900">{report.fileName}</h1>
          <p className="text-sm text-surface-500">Report Details</p>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: User, label: 'Patient', value: report.patientName },
          { icon: Globe, label: 'Language', value: report.language },
          { icon: BookOpen, label: 'Literacy', value: report.literacyLevel },
          { icon: Clock, label: 'Processing', value: report.processingTime ? `${report.processingTime}s` : '—' },
        ].map((item) => (
          <Card key={item.label} className="!p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <item.icon className="w-3.5 h-3.5 text-surface-400" />
              <span className="text-xs font-medium text-surface-400">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-surface-800 truncate">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Pipeline Status */}
      {job && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-surface-900">Processing Pipeline</h2>
            <StatusBadge status={report.status} />
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-surface-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {job.steps.map((step) => (
              <div
                key={step.name}
                className={`text-center p-3 rounded-lg ${
                  step.completed
                    ? 'bg-emerald-50 border border-emerald-200'
                    : step.active
                    ? 'bg-primary-50 border-2 border-primary-300'
                    : 'bg-surface-50 border border-surface-200'
                }`}
              >
                <div className="text-xl mb-1">{stepIcons[step.name] ?? '⬜'}</div>
                <p
                  className={`text-xs font-semibold ${
                    step.completed
                      ? 'text-emerald-700'
                      : step.active
                      ? 'text-primary-700'
                      : 'text-surface-400'
                  }`}
                >
                  {step.name}
                </p>
                {step.completed && <CheckCircle className="w-3 h-3 text-emerald-500 mx-auto mt-1" />}
                {step.active && (
                  <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Extracted Data */}
      {report.extractedData && (
        <Card>
          <h2 className="text-base font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-primary-500" />
            Extracted Clinical Data
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase mb-2">Conditions</p>
              <div className="flex flex-wrap gap-1.5">
                {report.extractedData.conditions.map((c, i) => (
                  <Badge key={i} variant="warning">{c}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase mb-2">Medications</p>
              <div className="flex flex-wrap gap-1.5">
                {report.extractedData.medications.length > 0 ? (
                  report.extractedData.medications.map((m, i) => (
                    <Badge key={i} variant="info">{m}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-surface-400 italic">None prescribed</span>
                )}
              </div>
            </div>
          </div>

          {/* Lab Results Table */}
          <p className="text-xs font-semibold text-surface-400 uppercase mb-2">Lab Results</p>
          <div className="border border-surface-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500">Test</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500">Value</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500">Normal Range</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {report.extractedData.labResults.map((lr, i) => (
                  <tr key={i} className="hover:bg-surface-50/50">
                    <td className="px-4 py-2.5 text-sm font-medium text-surface-800">{lr.test}</td>
                    <td className="px-4 py-2.5 text-sm text-surface-700">{lr.value}</td>
                    <td className="px-4 py-2.5 text-sm text-surface-500">{lr.normalRange}</td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={
                          lr.status === 'Normal'
                            ? 'success'
                            : lr.status === 'High' || lr.status === 'Low'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {lr.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* AI Explanation */}
      {report.explanation && (
        <Card>
          <h2 className="text-base font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            AI-Generated Explanation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'What is Happening', text: report.explanation.whatIsHappening, icon: AlertCircle, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { title: 'Why It Matters', text: report.explanation.whyItMatters, icon: HeartPulse, color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { title: 'What To Do', text: report.explanation.whatToDo, icon: CheckCircle, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { title: 'Simple Analogy', text: report.explanation.analogy, icon: MessageSquare, color: 'bg-purple-50 border-purple-200 text-purple-700' },
            ].map((section) => (
              <div
                key={section.title}
                className={`p-4 rounded-lg border ${section.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="w-4 h-4" />
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Video Link */}
      {report.videoId && report.status === 'READY' && (
        <Card className="!bg-gradient-to-r from-primary-50 to-accent-50 !border-primary-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-surface-900">Video Explanation Ready</h3>
              <p className="text-sm text-surface-500">
                The patient video has been generated in {report.language}.
              </p>
            </div>
            <Link
              to={`/patient/videos/${report.videoId}`}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
            >
              Watch Video
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
