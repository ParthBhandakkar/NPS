import { type ReactNode } from 'react';
import {
  AlertCircle,
  type LucideIcon,
  Loader2,
  FolderOpen,
} from 'lucide-react';

/* ────────────────────────────────────────────
   Card
   ──────────────────────────────────────────── */
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}
export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-surface-200 card-shadow ${
        padding ? 'p-5 sm:p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   Stats Card — left color accent strip
   ──────────────────────────────────────────── */
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  indigo:  { bg: 'bg-primary-50',  text: 'text-primary-700',  border: 'border-l-primary-500',  iconBg: 'bg-primary-100' },
  cyan:    { bg: 'bg-accent-50',   text: 'text-accent-700',   border: 'border-l-accent-500',   iconBg: 'bg-accent-100' },
  emerald: { bg: 'bg-emerald-50',  text: 'text-emerald-700',  border: 'border-l-emerald-500',  iconBg: 'bg-emerald-100' },
  amber:   { bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-l-amber-500',    iconBg: 'bg-amber-100' },
  rose:    { bg: 'bg-rose-50',     text: 'text-rose-700',     border: 'border-l-rose-500',     iconBg: 'bg-rose-100' },
};

export function StatsCard({ title, value, subtitle, icon: Icon, color = 'indigo' }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`stat-card bg-white rounded-xl border border-surface-200 card-shadow border-l-4 ${c.border} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
        </div>
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${c.iconBg} ${c.text} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Badge — status / tag
   ──────────────────────────────────────────── */
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'processing';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default:    'bg-surface-100 text-surface-600',
  success:    'bg-emerald-50 text-emerald-700',
  warning:    'bg-amber-50 text-amber-700',
  danger:     'bg-rose-50 text-rose-700',
  info:       'bg-blue-50 text-blue-700',
  processing: 'bg-primary-50 text-primary-700',
};
const dotStyles: Record<BadgeVariant, string> = {
  default:    'bg-surface-400',
  success:    'bg-emerald-500',
  warning:    'bg-amber-500',
  danger:     'bg-rose-500',
  info:       'bg-blue-500',
  processing: 'bg-primary-500 animate-pulse-dot',
};

export function Badge({ children, variant = 'default', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[variant]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
}

/* ────────────────────────────────────────────
   Status Badge — maps report status to badge
   ──────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  READY:      { label: 'Ready',       variant: 'success' },
  QUEUED:     { label: 'Queued',      variant: 'default' },
  EXTRACTING: { label: 'Extracting',  variant: 'processing' },
  ANALYZING:  { label: 'Analyzing',   variant: 'processing' },
  GENERATING: { label: 'Generating',  variant: 'processing' },
  ASSEMBLING: { label: 'Assembling',  variant: 'processing' },
  FAILED:     { label: 'Failed',      variant: 'danger' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, variant: 'default' as BadgeVariant };
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

/* ────────────────────────────────────────────
   PageHeader
   ──────────────────────────────────────────── */
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        {description && <p className="text-sm text-surface-500 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ────────────────────────────────────────────
   EmptyState
   ──────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = FolderOpen, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-surface-400" />
      </div>
      <h3 className="text-base font-semibold text-surface-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-400 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

/* ────────────────────────────────────────────
   Spinner
   ──────────────────────────────────────────── */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
  return <Loader2 className={`${s} animate-spin text-primary-500`} />;
}

/* ────────────────────────────────────────────
   ErrorAlert
   ──────────────────────────────────────────── */
export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   Table helpers  (use in page components)
   ──────────────────────────────────────────── */
export function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-5 sm:-mx-6">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full">{children}</table>
      </div>
    </div>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-5 sm:px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider bg-surface-50 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-5 sm:px-6 py-4 text-sm text-surface-700 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
