import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Globe, Calendar } from 'lucide-react';
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

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number | null;
  language: string;
  literacyLevel: string;
  createdAt: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/patients').then((r) => {
      setPatients(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  const literacyColor: Record<string, 'default' | 'success' | 'info' | 'warning'> = {
    Basic: 'warning',
    Intermediate: 'info',
    Advanced: 'success',
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Patients"
        description={`${patients.length} registered patients`}
      />

      <Card padding={false}>
        {/* Search */}
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-300 bg-surface-50 text-sm placeholder:text-surface-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No patients found"
            description={search ? 'Try a different search term.' : 'No patients have registered yet.'}
          />
        ) : (
          <TableWrapper>
            <thead>
              <tr>
                <Th>Patient</Th>
                <Th>Email</Th>
                <Th>Age</Th>
                <Th>Language</Th>
                <Th>Literacy Level</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-50/50 transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-medium text-surface-800">{p.name}</span>
                    </div>
                  </Td>
                  <Td>{p.email}</Td>
                  <Td>{p.age ?? '—'}</Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-surface-400" />
                      {p.language}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={literacyColor[p.literacyLevel] ?? 'default'}>
                      {p.literacyLevel}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5 text-surface-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(p.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
