// src/components/FilterBar.tsx

import { Filter } from 'lucide-react';
import type { JobFilter, DurationType } from '@/types';

interface FilterBarProps {
  filter: JobFilter;
  onChange: (filter: JobFilter) => void;
}

export default function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
      <Filter className="w-5 h-5" />
      Filters
    </button>
  );
}