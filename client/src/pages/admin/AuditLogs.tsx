import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Filter } from 'lucide-react';
import {
  Card,
  PageHeader,
  Badge,
  EmptyState,
  Spinner,
  TableWrapper,
  Th,
  Td,
} from '../../components/ui';
import api from '../../lib/api';

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  target: string;
  timestamp: string;
  ip: string;
}

const actionConfig: Record<string, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger' }> = {
  REPORT_UPLOADED:     { label: 'Report Uploaded',     variant: 'info' },
  EXTRACTION_COMPLETE: { label: 'Extraction Complete', variant: 'success' },
  VIDEO_GENERATED:     { label: 'Video Generated',     variant: 'success' },
  VIDEO_ACCESSED:      { label: 'Video Accessed',      variant: 'default' },
  PATIENT_REGISTERED:  { label: 'Patient Registered',  variant: 'info' },
  REPORT_DELETED:      { label: 'Report Deleted',      variant: 'danger' },
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    api.get('/admin/audit-logs').then((r) => {
      setLogs(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const actions = ['ALL', ...new Set(logs.map((l) => l.action))];

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Audit Logs"
        description="HIPAA-compliant compliance audit trail"
      />

      <Card padding={false}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by user or target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-300 bg-surface-50 text-sm placeholder:text-surface-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-surface-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-sm border border-surface-300 rounded-lg px-3 py-2 bg-surface-50 text-surface-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a === 'ALL' ? 'All Actions' : (actionConfig[a]?.label ?? a)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No audit logs found"
            description="Adjust your filters or check back later."
          />
        ) : (
          <TableWrapper>
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>Action</Th>
                <Th>User</Th>
                <Th>Target</Th>
                <Th>IP Address</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.map((log) => {
                const cfg = actionConfig[log.action] ?? { label: log.action, variant: 'default' as const };
                return (
                  <tr key={log.id} className="hover:bg-surface-50/50 transition-colors">
                    <Td>
                      <div className="text-surface-800 font-medium">
                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-surface-400">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </Td>
                    <Td>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </Td>
                    <Td>
                      <span className="font-medium text-surface-800">{log.userName}</span>
                    </Td>
                    <Td>
                      <span className="text-surface-600 truncate max-w-[200px] block">
                        {log.target}
                      </span>
                    </Td>
                    <Td>
                      <code className="text-xs bg-surface-100 px-2 py-0.5 rounded text-surface-500">
                        {log.ip}
                      </code>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrapper>
        )}
      </Card>
    </div>
  );
}
