import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Globe, BookOpen, User, CheckCircle } from 'lucide-react';
import { Card, PageHeader, Spinner } from '../../components/ui';
import api from '../../lib/api';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Patient {
  id: string;
  name: string;
  language: string;
  literacyLevel: string;
}

export default function UploadReport() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patientId: '',
    fileName: '',
    language: 'English',
    literacyLevel: 'Basic',
  });

  useEffect(() => {
    api.get('/patients')
      .then((r) => {
        setPatients(r.data);
        if (r.data.length > 0) {
          const p = r.data[0];
          setForm((f) => ({
            ...f,
            patientId: p.id,
            language: p.language || 'English',
            literacyLevel: p.literacyLevel || 'Basic',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePatientChange = (pid: string) => {
    const p = patients.find((x) => x.id === pid);
    setForm({
      ...form,
      patientId: pid,
      language: p?.language || form.language,
      literacyLevel: p?.literacyLevel || form.literacyLevel,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.fileName) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/reports/upload', form);
      toast.success('Report uploaded! Processing started.');
      navigate(`/admin/reports/${data.id}`);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : null;
      toast.error(msg || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const selectClass =
    'w-full px-4 py-2.5 rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all';
  const inputClass = selectClass;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Upload Report"
        description="Upload a medical report to generate a video explanation for your patient."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <User className="w-4 h-4 text-surface-400" />
                Select Patient
              </label>
              <select
                value={form.patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className={selectClass}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* File Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <FileText className="w-4 h-4 text-surface-400" />
                Report File Name
              </label>
              <input
                type="text"
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="e.g. blood_test_report.pdf"
                className={inputClass}
                required
              />
              <p className="text-xs text-surface-400 mt-1">
                In production, this would be a file upload. Enter a filename for the demo.
              </p>
            </div>

            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <Globe className="w-4 h-4 text-surface-400" />
                Target Language
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className={selectClass}
              >
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map(
                  (lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ),
                )}
              </select>
            </div>

            {/* Literacy Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <BookOpen className="w-4 h-4 text-surface-400" />
                Literacy Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Basic', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({ ...form, literacyLevel: level })}
                    className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                      form.literacyLevel === level
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-200 text-surface-500 hover:border-surface-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload &amp; Process Report
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-5">
          <Card className="!bg-primary-50 !border-primary-200">
            <h3 className="text-sm font-semibold text-primary-900 mb-3">How it works</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Upload a medical report (PDF)' },
                { step: '2', text: 'AWS Textract extracts clinical data' },
                { step: '3', text: 'Amazon Bedrock generates explanation' },
                { step: '4', text: 'Amazon Polly creates audio narration' },
                { step: '5', text: 'Video is assembled and delivered' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </span>
                  <p className="text-sm text-primary-800">{s.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-surface-800 mb-3">Supported Features</h3>
            <div className="space-y-2">
              {[
                'Multi-language support',
                'Adaptive literacy levels',
                'Clinical entity extraction',
                'HIPAA-compliant processing',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-surface-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
