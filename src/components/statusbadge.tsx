// src/components/StatusBadge.tsx

import React from 'react';
import { Zap, Star, TrendingUp } from 'lucide-react';
import type { JobStatus } from '@/types';

interface StatusBadgeProps {
  status: JobStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    hot: {
      icon: Zap,
      label: 'HOT',
      className: 'bg-red-500 text-white'
    },
    new: {
      icon: Star,
      label: 'NEW',
      className: 'bg-green-500 text-white'
    },
    filling: {
      icon: TrendingUp,
      label: 'FILLING FAST',
      className: 'bg-amber-500 text-white'
    },
    filled: {
      icon: Star,
      label: 'FILLED',
      className: 'bg-gray-500 text-white'
    },
    cancelled: {
      icon: Star,
      label: 'CANCELLED',
      className: 'bg-gray-400 text-white'
    }
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}