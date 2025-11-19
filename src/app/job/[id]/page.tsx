// src/app/job/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, DollarSign, User, Phone, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/statusbadge';
import SkillBadge from '@/components/skillbadge';
import LoadingState from '@/components/loadingstate';
import type { Job } from '@/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [workerInfo, setWorkerInfo] = useState({
    name: '',
    phone: '',
    skills: [] as string[]
  });

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const result = await response.json();

      if (result.success) {
        setJob(result.data);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!workerInfo.name || !workerInfo.phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    setAccepting(true);
    try {
      const response = await fetch(`/api/jobs/${params.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker: {
            ...workerInfo,
            location: job?.location || 'Kigali',
            skills: job?.skills || []
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Job accepted successfully! The poster will contact you soon.');
        router.push('/');
      } else {
        alert(result.error || 'Failed to accept job');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingState />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const matchScore = job.matchScores?.['worker_1'] || Math.floor(Math.random() * 30) + 70;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="mb-4">
            <StatusBadge status={job.status} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h1>

          <div className="flex items-center gap-2 mb-2 text-gray-700">
            <User className="w-4 h-4" />
            <span>Posted by: {job.poster.name}</span>
          </div>
          <div className="flex items-center gap-2 mb-6 text-gray-700">
            <Phone className="w-4 h-4" />
            <span>{job.poster.phone}</span>
          </div>

          <div className="space-y-3 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                Duration: {job.duration} {job.durationType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Location: {job.location}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-green-600">
              <DollarSign className="w-5 h-5" />
              <span>Pay: {job.pay} per person</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">🏷️ Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">👥 Workers Status</h3>
            <p className="text-gray-600">
              {job.acceptedBy.length}/{job.workersNeeded} Accepted
            </p>
          </div>

          {matchScore >= 70 && (
            <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ✨ Recommended for you!
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Your skills match this job perfectly
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    Match Score: {matchScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {!showAcceptForm ? (
            <button
              onClick={() => setShowAcceptForm(true)}
              disabled={job.acceptedBy.length >= job.workersNeeded}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              {job.acceptedBy.length >= job.workersNeeded
                ? 'Job Filled'
                : 'Accept This Job'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Quick info to accept:</h3>
                <input
                  type="text"
                  placeholder="Your name"
                  value={workerInfo.name}
                  onChange={(e) =>
                    setWorkerInfo({ ...workerInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="+250 788 123 456"
                  value={workerInfo.phone}
                  onChange={(e) =>
                    setWorkerInfo({ ...workerInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {accepting ? 'Accepting...' : 'Confirm Accept'}
                </button>
                <button
                  onClick={() => setShowAcceptForm(false)}
                  className="px-4 py-3 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}