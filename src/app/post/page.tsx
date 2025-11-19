import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import JobForm from '@/components/jobform';

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-1">
            Find skilled workers in minutes. No signup required.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <JobForm />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Tips for getting workers fast:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about what needs to be done</li>
            <li>• Select accurate skills to match the right workers</li>
            <li>• Offer competitive pay for your area</li>
            <li>• Respond quickly when workers accept</li>
          </ul>
        </div>
      </div>
    </div>
  );
}