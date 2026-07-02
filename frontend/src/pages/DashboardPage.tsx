import { Users, Building2, CalendarClock, CheckSquare, Clock, Calendar, AlertCircle, ArrowRight, ListTodo, Eye } from 'lucide-react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../services/api';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | string;
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

const getDashboardData = async () => {
  const result = await get<{ data: any }>('/dashboard');
  return result.data;
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (isError || !data) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { stats, todaysSchedule, todaysTasks } = data;

  const statCards: StatCardProps[] = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: <Users className="h-6 w-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Customers',
      value: stats.activeCustomers,
      icon: <Building2 className="h-6 w-6" />,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: <CheckSquare className="h-6 w-6" />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Tasks Due Today',
      value: stats.tasksDueToday,
      icon: <CalendarClock className="h-6 w-6" />,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Overdue Tasks',
      value: stats.overdueTasksCount,
      icon: <AlertCircle className="h-6 w-6" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: "Today's Follow-ups",
      value: stats.todaysFollowUps,
      icon: <Calendar className="h-6 w-6" />,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Upcoming Follow-ups',
      value: stats.upcomingFollowUps,
      icon: <Clock className="h-6 w-6" />,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Missed Follow-ups',
      value: stats.missedFollowUps,
      icon: <AlertCircle className="h-6 w-6" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ];

  const formatGreeting = (user: any) => {
    if (user?.name) return `Welcome back, ${user.name}!`;
    if (user?.email === 'admin@minicrm.com') return 'Welcome back, Admin!';
    return 'Welcome back!';
  };

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          {formatGreeting(data.user)} Here&apos;s an overview of your CRM.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Today's Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all tasks <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {todaysTasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
              <CheckSquare className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">No tasks due today</p>
              <p className="text-xs text-slate-500 mt-1">Great job!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todaysTasks?.map((task: any) => (
                <div key={task.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <ListTodo className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        {task.lead ? (
                          <Link to={`/leads/${task.leadId}`} className="hover:text-blue-600 hover:underline">
                            Lead: {task.lead.fullName}
                          </Link>
                        ) : task.assignedUser ? (
                          <span>Assignee: {task.assignedUser.name}</span>
                        ) : 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/tasks/${task.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="card h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/leads/new" className="flex items-center w-full p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 mr-3">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">Add New Lead</span>
            </Link>
            <Link to="/tasks/new" className="flex items-center w-full p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600 mr-3">
                <ListTodo className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">Create Task</span>
            </Link>
            <Link to="/followups/new" className="flex items-center w-full p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">Schedule Follow-up</span>
            </Link>
          </div>
        </div>

        {/* Today's Schedule (Follow-ups) */}
        <div className="lg:col-span-3 card mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Today's Schedule (Follow-ups)</h2>
            <Link to="/followups" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {todaysSchedule?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
              <CalendarClock className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">No follow-ups today</p>
              <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todaysSchedule?.map((schedule: any) => (
                <div key={schedule.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {schedule.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        {schedule.followUpTime || 'No specific time'} &bull; 
                        <Link to={`/leads/${schedule.leadId}`} className="hover:text-blue-600 hover:underline">
                          {schedule.lead.fullName}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/followups/${schedule.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-md"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
