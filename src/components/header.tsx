// src/components/Header.tsx

import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900">PostJob</h1>
          </Link>
          <div className="flex gap-2">
            <Link
              href="/post"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Post Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}