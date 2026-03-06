import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Trash2, Eye, FileText, Plus } from 'lucide-react';
import {
  Card,
  PageHeader,
  StatusBadge,
  EmptyState,
  Spinner,
  TableWrapper,
  Th,
  Td,
} from '../../components/ui';
import api from '../../lib/api';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  patientName: string;
  fileName: string;
  status: string;
  language: string;
  literacyLevel: string;
  uploadedAt: string;
  fileSize: number;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchReports = () => {
    api.get('/reports').then((r) => {
      setReports(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;
    try {
      await api.delete(`/reports/${id}`);
      toast.success('Report deleted');
      fetchReports();
    } catch {
      toast.error('Failed to delete report');
    }
  };

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.fileName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['ALL', ...new Set(reports.map((r) => r.status))];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reports"
        description={`${reports.length} total medical reports`}
        action={
          <Link
            to="/admin/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Upload Report
          </Link>
        }
      />

      <Card padding={false}>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by patient or file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-300 bg-surface-50 text-sm placeholder:text-surface-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                }`}
              >
                {s === 'ALL' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reports found"
            description={search || statusFilter !== 'ALL' ? 'Try changing your filters.' : 'Upload your first report to get started.'}
          />
        ) : (
          <TableWrapper>
            <thead>
              <tr>
                <Th>Patient</Th>
                <Th>File</Th>
                <Th>Status</Th>
                <Th>Language</Th>
                <Th>Size</Th>
                <Th>Uploaded</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/reports/${r.id}`)}
                >
                  <Td>
                    <span className="font-medium text-surface-800">{r.patientName}</span>
                  </Td>
                  <Td>
                    <span className="text-surface-600 truncate max-w-[200px] block">{r.fileName}</span>
                  </Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>{r.language}</Td>
                  <Td>{formatSize(r.fileSize)}</Td>
                  <Td>
                    {new Date(r.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/admin/reports/${r.id}`}
                        className="p-2 rounded-md text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 rounded-md text-surface-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}
      </Card>
    </div>
  );
}
