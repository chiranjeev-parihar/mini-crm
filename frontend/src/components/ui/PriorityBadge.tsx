import { TaskPriority } from '../../types/task';

interface PriorityBadgeProps {
  priority: TaskPriority | string;
}

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  LOW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Low',
  },
  MEDIUM: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Medium',
  },
  HIGH: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    label: 'High',
  },
  URGENT: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Urgent',
  },
};

/**
 * Displays a color-coded priority badge.
 *  - Low    → Green
 *  - Medium → Blue
 *  - High   → Orange
 *  - Urgent → Red
 */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority?.toUpperCase()] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: priority ?? 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
