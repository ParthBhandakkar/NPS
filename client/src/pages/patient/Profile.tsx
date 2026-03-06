import { useEffect, useState } from 'react';
import { User, Globe, BookOpen, Save, Loader2 } from 'lucide-react';
import { Card, PageHeader, Spinner } from '../../components/ui';
import { useAuth } from '../../context/useAuth';
import api from '../../lib/api';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  age: number | null;
  language: string;
  literacyLevel: string;
  createdAt: string;
}

export default function PatientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: '',
    language: 'English',
    literacyLevel: 'Basic',
  });

  useEffect(() => {
    if (!user) return;
    api
      .get(`/patients/${user.id}`)
      .then((r) => {
        setProfile(r.data);
        setForm({
          name: r.data.name || '',
          age: r.data.age?.toString() || '',
          language: r.data.language || 'English',
          literacyLevel: r.data.literacyLevel || 'Basic',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        age: form.age ? parseInt(form.age) : undefined,
        language: form.language,
        literacyLevel: form.literacyLevel,
      };
      const { data } = await api.post(`/patients/${user.id}/profile`, payload);
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : null;
      toast.error(msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all';

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Profile" description="Manage your personal information and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mb-4">
            {profile?.name?.charAt(0) ?? '?'}
          </div>
          <h3 className="text-lg font-semibold text-surface-900">{profile?.name}</h3>
          <p className="text-sm text-surface-500 mb-4">{profile?.email}</p>

          <div className="w-full space-y-3 pt-4 border-t border-surface-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Language</span>
              <span className="font-medium text-surface-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-surface-400" />
                {profile?.language}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Literacy</span>
              <span className="font-medium text-surface-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-surface-400" />
                {profile?.literacyLevel}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Age</span>
              <span className="font-medium text-surface-800">{profile?.age ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Joined</span>
              <span className="font-medium text-surface-800">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-surface-900 mb-5">Edit Profile</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <User className="w-4 h-4 text-surface-400" />
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 45"
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <Globe className="w-4 h-4 text-surface-400" />
                Preferred Language
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className={inputClass}
              >
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map(
                  (lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ),
                )}
              </select>
            </div>

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
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
