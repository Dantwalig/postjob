'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, WifiOff } from 'lucide-react';
import JobCard from '@/components/jobcard';
import LoadingState from '@/components/loadingstate';
import EmptyState from '@/components/emptystate';
import OfflineIndicator from '@/components/offlineindicator';
import Header from '@/components/header';
import FilterBar from '@/components/filterbar';
import { cacheJobs, getCachedJobs, setupOfflineDetection, isOffline } from '@/lib/cache';
import type { Job, JobFilter } from '@/types';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState<JobFilter>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();

    // Setup offline detection
    const cleanup = setupOfflineDetection(
      () => {
        setOffline(false);
        fetchJobs();
      },
      () => {
        setOffline(true);
        // Load cached jobs
        const cached = getCachedJobs();
        if (cached) {
          setJobs(cached);
        }
      }
    );

    return cleanup;
  }, []);

  const fetchJobs = async () => {
    if (isOffline()) {
      const cached = getCachedJobs();
      if (cached) {
        setJobs(cached);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.skills && filter.skills.length > 0) {
        params.append('skills', filter.skills.join(','));
      }
      if (filter.durationType) {
        params.append('durationType', filter.durationType);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setJobs(result.data);
        cacheJobs(result.data); // Cache for offline use
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback to cached data
      const cached = getCachedJobs();
      if (cached) {
        setJobs(cached);
        setOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {offline && <OfflineIndicator />}

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <FilterBar filter={filter} onChange={setFilter} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <LoadingState />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}