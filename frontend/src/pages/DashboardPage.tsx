import { Users, Building2, CalendarClock, CheckSquare, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
}

function StatCard({ label, value, icon, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats: StatCardProps[] = [
    {
      label: 'Total Leads',
      value: 0,
      icon: <Users className="h-6 w-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Customers',
      value: 0,
      icon: <Building2 className="h-6 w-6" />,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: "Today's Follow-ups",
      value: 0,
      icon: <CalendarClock className="h-6 w-6" />,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Pending Tasks',
      value: 0,
      icon: <CheckSquare className="h-6 w-6" />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here&apos;s an overview of your CRM.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Empty state */}
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Inbox className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-slate-700">
          No data yet
        </h3>
        <p className="max-w-sm text-sm text-slate-500">
          Start by adding your first lead. Your dashboard stats and activity
          will appear here once you get going.
        </p>
        <button className="btn-primary mt-6">Add your first lead</button>
      </div>
    </div>
  );
}
