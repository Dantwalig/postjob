import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import type { Job } from '@/types';
import StatusBadge from './statusbadge';
import SkillBadge from './skillbadge';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/job/${job.id}`}>
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="mb-2">
                <StatusBadge status={job.status} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.duration} {job.durationType}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="w-4 h-4" />
              {job.pay}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.slice(0, 3).map(skill => (
              <SkillBadge key={skill} skill={skill} />
            ))}
            {job.skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-gray-600">
              {job.acceptedBy.length}/{job.workersNeeded} workers accepted
            </span>
            <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}