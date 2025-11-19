// src/lib/status.ts

import type { Job, JobStatus } from '@/types';

/**
 * Dynamically determine job status based on real-time data
 * Uses heuristics to categorize jobs as hot, new, filling, etc.
 */
export function determineJobStatus(job: Job): JobStatus {
  // Already filled or cancelled
  if (job.status === 'filled' || job.status === 'cancelled') {
    return job.status;
  }
  
  const now = new Date();
  const createdAt = new Date(job.createdAt);
  const ageInMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
  const ageInHours = ageInMinutes / 60;
  
  const acceptanceRate = job.acceptedBy.length / job.workersNeeded;
  const viewsPerHour = job.views / Math.max(ageInHours, 0.1);
  
  // HOT: High engagement OR short duration OR urgent timeline
  if (
    viewsPerHour > 10 ||
    (job.durationType === 'hours' && job.duration <= 4) ||
    acceptanceRate > 0.5
  ) {
    return 'hot';
  }
  
  // FILLING FAST: Multiple workers accepted
  if (acceptanceRate > 0.3 && job.acceptedBy.length > 0) {
    return 'filling';
  }
  
  // NEW: Posted within last hour
  if (ageInMinutes < 60) {
    return 'new';
  }
  
  // Default to new if nothing else matches
  return 'new';
}

/**
 * Get status display information
 */
export function getStatusInfo(status: JobStatus) {
  const statusMap = {
    hot: {
      label: 'HOT',
      color: 'red',
      description: 'High demand - act fast!',
      urgency: 3
    },
    new: {
      label: 'NEW',
      color: 'green',
      description: 'Just posted',
      urgency: 2
    },
    filling: {
      label: 'FILLING FAST',
      color: 'amber',
      description: 'Workers are accepting',
      urgency: 3
    },
    filled: {
      label: 'FILLED',
      color: 'gray',
      description: 'No longer available',
      urgency: 0
    },
    cancelled: {
      label: 'CANCELLED',
      color: 'gray',
      description: 'Job cancelled',
      urgency: 0
    }
  };
  
  return statusMap[status];
}

/**
 * Calculate urgency score (0-100) for sorting
 */
export function calculateUrgencyScore(job: Job): number {
  let score = 0;
  
  // Status urgency
  const statusInfo = getStatusInfo(job.status);
  score += statusInfo.urgency * 20;
  
  // Duration urgency
  if (job.durationType === 'hours' && job.duration <= 4) {
    score += 30;
  } else if (job.durationType === 'hours') {
    score += 20;
  } else if (job.durationType === 'days' && job.duration <= 1) {
    score += 15;
  }
  
  // Acceptance rate urgency
  const acceptanceRate = job.acceptedBy.length / job.workersNeeded;
  score += acceptanceRate * 30;
  
  return Math.min(score, 100);
}