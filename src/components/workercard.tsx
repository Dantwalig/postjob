import type { Worker } from '@/types';
import TrustBadge from './trustbadge';
import { CheckCircle } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="font-medium text-gray-900">{worker.name}</span>
          {worker.badges.map((badge) => (
            <TrustBadge key={badge} type={badge} />
          ))}
        </div>
        <p className="text-sm text-gray-600">{worker.phone}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {worker.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}