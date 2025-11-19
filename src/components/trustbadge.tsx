import type { BadgeType } from '@/types';
import { getBadgeInfo } from '@/lib/badges';

interface TrustBadgeProps {
  type: BadgeType;
}

export default function TrustBadge({ type }: TrustBadgeProps) {
  const badge = getBadgeInfo(type);

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium text-${badge.color}-600`}>
      <span>{badge.icon}</span>
      {badge.label}
    </span>
  );
}