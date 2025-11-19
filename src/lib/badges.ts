// src/lib/badges.ts

import type { BadgeType, Worker } from '@/types';

interface WorkerStats {
  jobsCompleted: number;
  responseRate: number;
  avgResponseTime: number;
  reliability: number;
}

/**
 * Auto-generate badges based on worker performance
 */
export function generateBadges(stats: WorkerStats): BadgeType[] {
  const badges: BadgeType[] = [];
  
  // Reliable badge: 80%+ reliability, 5+ jobs
  if (stats.reliability >= 80 && stats.jobsCompleted >= 5) {
    badges.push('reliable');
  }
  
  // Skilled badge: 20+ jobs completed
  if (stats.jobsCompleted >= 20) {
    badges.push('skilled');
  }
  
  // Fast responder: < 10 min avg response, 90%+ response rate
  if (stats.avgResponseTime < 10 && stats.responseRate >= 90) {
    badges.push('fast');
  }
  
  // Verified badge: 50+ jobs completed, 95%+ reliability
  if (stats.jobsCompleted >= 50 && stats.reliability >= 95) {
    badges.push('verified');
  }
  
  return badges;
}

/**
 * Get badge display information
 */
export function getBadgeInfo(badge: BadgeType) {
  const badgeMap = {
    reliable: {
      icon: '✅',
      label: 'Reliable',
      color: 'green',
      description: 'Consistently completes jobs well'
    },
    skilled: {
      icon: '⭐',
      label: 'Skilled',
      color: 'amber',
      description: 'Highly experienced worker'
    },
    fast: {
      icon: '⚡',
      label: 'Fast Responder',
      color: 'purple',
      description: 'Responds quickly to job offers'
    },
    verified: {
      icon: '🎯',
      label: 'Verified Pro',
      color: 'blue',
      description: 'Top-tier trusted worker'
    }
  };
  
  return badgeMap[badge];
}

/**
 * Calculate worker trust score (0-100)
 */
export function calculateTrustScore(worker: Worker): number {
  let score = 0;
  
  // Base score from reliability
  score += worker.stats.reliability * 0.4;
  
  // Response rate contribution
  score += worker.stats.responseRate * 0.3;
  
  // Experience contribution (capped at 30 points)
  const experienceScore = Math.min(worker.stats.jobsCompleted * 3, 30);
  score += experienceScore;
  
  return Math.round(score);
}