// src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/statusbadge';
import WorkerCard from '@/components/workercard';
import type { Job, Worker } from '@/types';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, workersRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/workers')
      ]);

      const jobsData = await jobsRes.json();
      const workersData = await workersRes.json();

      if (jobsData.success) {
        setJobs(jobsData.data.filter((j: Job) => j.status !== 'filled'));
      }

      if (workersData.success) {
        setWorkers(workersData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkFilled = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'filled' })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error marking job as filled:', error);
    }
  };

  const getWorkerDetails = (workerId: string) => {
    return workers.find((w) => w.id === workerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your posted jobs and workers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Jobs ({jobs.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-600 mb-4">No active jobs yet</p>
            <Link
              href="/post"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Workers accepted: {job.acceptedBy.length}/{job.workersNeeded}
                </p>

                {job.acceptedBy.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {job.acceptedBy.map((workerId) => {
                      const worker = getWorkerDetails(workerId);
                      return worker ? (
                        <WorkerCard key={worker.id} worker={worker} />
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                    No workers yet. We're showing this to matched workers nearby.
                  </p>
                )}

                {job.acceptedBy.length < job.workersNeeded && (
                  <p className="text-gray-600 mb-4">
                    Waiting for {job.workersNeeded - job.acceptedBy.length} more worker(s)...
                  </p>
                )}

                <div className="flex gap-2">
                  {job.acceptedBy.length >= job.workersNeeded && (
                    <button
                      onClick={() => handleMarkFilled(job.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Mark as Filled
                    </button>
                  )}
                  <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition">
                    Cancel Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/post"
          className="block w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
        >
          + Post Another Job
        </Link>
      </div>
    </div>
  );
}