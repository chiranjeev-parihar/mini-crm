
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  const normalizedStatus = status.toUpperCase().replace(' ', '_');

  switch (normalizedStatus) {
    // Lead
    case 'NEW':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'CONTACTED':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'QUALIFIED':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'PROPOSAL_SENT':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      break;
    case 'NEGOTIATION':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      break;
    case 'WON':
    case 'COMPLETED':
    case 'CONVERTED':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'LOST':
    case 'MISSED':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'PENDING':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'IN_PROGRESS':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'CANCELLED':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  const label = status.replace(/_/g, ' ').toLowerCase();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
}
