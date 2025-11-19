import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  return (
    <div className="bg-amber-500 text-white px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      You're offline. Showing cached jobs. Connect to accept jobs.
    </div>
  );
}