import { Briefcase } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-xl border">
      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-gray-600">Try adjusting your filters or check back later</p>
    </div>
  );
}