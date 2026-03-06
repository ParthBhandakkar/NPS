import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  HeartPulse,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { Card, Badge, Spinner } from '../../components/ui';
import api from '../../lib/api';

interface VideoData {
  videoId: string;
  url: string;
  expiresAt: string;
  report: {
    id: string;
    fileName: string;
    patientName: string;
    language: string;
    explanation: {
      whatIsHappening: string;
      whyItMatters: string;
      whatToDo: string;
      analogy: string;
      audioScript: string;
    } | null;
    extractedData: {
      conditions: string[];
      medications: string[];
      labResults: { test: string; value: string; normalRange: string; status: string }[];
    } | null;
    processingTime: number | null;
  };
}

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get(`/videos/${id}/url`)
      .then((r) => {
        setData(r.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load video');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-surface-600">{error || 'Video not found'}</p>
        <Link to="/patient" className="text-primary-600 text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { report } = data;
  const explanation = report.explanation;
  const extracted = report.extractedData;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/patient"
          className="w-9 h-9 rounded-lg border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-surface-900">Video Explanation</h1>
          <p className="text-sm text-surface-500">{report.fileName}</p>
        </div>
      </div>

      {/* Video Player Mock */}
      <Card className="!p-0 overflow-hidden">
        <div className="relative aspect-video bg-surface-900 flex items-center justify-center">
          {/* Simulated video poster */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 to-surface-900/80" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors cursor-pointer">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
            <p className="text-white font-semibold text-lg">Medical Report Explanation</p>
            <p className="text-white/60 text-sm mt-1">
              Personalised for {report.patientName} • {report.language}
            </p>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/20 rounded-full">
                <div className="w-0 h-full bg-primary-400 rounded-full" />
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs">0:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video meta bar */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-surface-100 bg-surface-50/50">
          <div className="flex items-center gap-1.5 text-sm text-surface-500">
            <Globe className="w-3.5 h-3.5" />
            {report.language}
          </div>
          {report.processingTime && (
            <div className="flex items-center gap-1.5 text-sm text-surface-500">
              <Clock className="w-3.5 h-3.5" />
              Generated in {report.processingTime}s
            </div>
          )}
        </div>
      </Card>

      {/* Explanation Sections */}
      {explanation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'What is Happening',
              text: explanation.whatIsHappening,
              icon: AlertCircle,
              bg: 'bg-blue-50',
              border: 'border-blue-200',
              iconColor: 'text-blue-600',
              textColor: 'text-blue-800',
            },
            {
              title: 'Why It Matters',
              text: explanation.whyItMatters,
              icon: HeartPulse,
              bg: 'bg-amber-50',
              border: 'border-amber-200',
              iconColor: 'text-amber-600',
              textColor: 'text-amber-800',
            },
            {
              title: 'What To Do',
              text: explanation.whatToDo,
              icon: CheckCircle,
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              iconColor: 'text-emerald-600',
              textColor: 'text-emerald-800',
            },
            {
              title: 'Simple Analogy',
              text: explanation.analogy,
              icon: MessageSquare,
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              iconColor: 'text-purple-600',
              textColor: 'text-purple-800',
            },
          ].map((section) => (
            <div
              key={section.title}
              className={`p-4 rounded-xl border ${section.bg} ${section.border}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <section.icon className={`w-4 h-4 ${section.iconColor}`} />
                <h3 className={`text-sm font-semibold ${section.textColor}`}>{section.title}</h3>
              </div>
              <p className={`text-sm ${section.textColor} opacity-80 leading-relaxed`}>
                {section.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Lab Results */}
      {extracted && extracted.labResults.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-surface-900 mb-4">Your Test Results</h2>
          <div className="space-y-3">
            {extracted.labResults.map((lr, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-100"
              >
                <div>
                  <p className="text-sm font-medium text-surface-800">{lr.test}</p>
                  <p className="text-xs text-surface-400 mt-0.5">Normal: {lr.normalRange}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900">{lr.value}</p>
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
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
