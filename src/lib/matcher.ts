import type { Worker, Job, MatchResult } from '@/types';

/**
 * Calculate match score between a worker and a job (0-100)
 * Uses weighted scoring based on multiple factors
 */
export function calculateMatchScore(worker: Worker, job: Job): number {
  let score = 0;
  let maxScore = 0;

  // Factor 1: Skill Match (40 points)
  maxScore += 40;
  const matchingSkills = job.skills.filter(skill => 
    worker.skills.includes(skill)
  );
  score += (matchingSkills.length / job.skills.length) * 40;

  // Factor 2: Location Match (20 points)
  maxScore += 20;
  if (worker.location.toLowerCase().includes(job.location.toLowerCase()) ||
      job.location.toLowerCase().includes(worker.location.toLowerCase())) {
    score += 20;
  } else {
    // Partial match for same city
    const workerCity = worker.location.split(',')[0].trim();
    const jobCity = job.location.split(',')[0].trim();
    if (workerCity.toLowerCase() === jobCity.toLowerCase()) {
      score += 10;
    }
  }

  // Factor 3: Worker Reliability (15 points)
  maxScore += 15;
  score += (worker.stats.reliability / 100) * 15;

  // Factor 4: Response Rate (10 points)
  maxScore += 10;
  score += (worker.stats.responseRate / 100) * 10;

  // Factor 5: Experience (10 points)
  maxScore += 10;
  const experienceScore = Math.min(worker.stats.jobsCompleted / 10, 1);
  score += experienceScore * 10;

  // Factor 6: Badge Bonus (5 points)
  maxScore += 5;
  score += (worker.badges.length / 4) * 5;

  // Normalize to 0-100
  return Math.round((score / maxScore) * 100);
}

/**
 * Calculate match scores for all workers for a given job
 * Returns a map of workerId -> score
 */
export async function calculateMatchScores(job: Job): Promise<Record<string, number>> {
  const { getWorkers } = await import('./db');
  const workers = await getWorkers();
  
  const scores: Record<string, number> = {};
  
  workers.forEach(worker => {
    scores[worker.id] = calculateMatchScore(worker, job);
  });
  
  return scores;
}

/**
 * Get top N matched workers for a job
 */
export function getTopMatches(
  workers: Worker[],
  job: Job,
  limit: number = 5
): MatchResult[] {
  const matches = workers
    .filter(worker => !job.acceptedBy.includes(worker.id))
    .map(worker => ({
      workerId: worker.id,
      worker,
      score: calculateMatchScore(worker, job),
      reasons: getMatchReasons(worker, job)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return matches;
}

/**
 * Get human-readable reasons for a match
 */
function getMatchReasons(worker: Worker, job: Job): string[] {
  const reasons: string[] = [];
  
  // Skill matches
  const matchingSkills = job.skills.filter(skill => 
    worker.skills.includes(skill)
  );
if (matchingSkills.length > 0) {
    reasons.push(`Skills match: ${matchingSkills.join(', ')}`);
  }
  
  // Location match
  if (worker.location.toLowerCase().includes(job.location.toLowerCase()) ||
      job.location.toLowerCase().includes(worker.location.toLowerCase())) {
    reasons.push('Same location');
  }
  
  // Reliability
  if (worker.stats.reliability > 80) {
    reasons.push('High reliability score');
  }
  
  // Fast responder
  if (worker.badges.includes('fast')) {
    reasons.push('Fast responder');
  }
  
  // Experienced
  if (worker.stats.jobsCompleted > 10) {
    reasons.push(`${worker.stats.jobsCompleted} jobs completed`);
  }
  
  return reasons;
}

/**
 * AI-powered job recommendation engine
 * Analyzes job patterns and suggests optimal matching strategies
 */
export function generateMatchingInsights(job: Job, matches: MatchResult[]) {
  const insights = {
    totalMatches: matches.length,
    avgScore: matches.reduce((sum, m) => sum + m.score, 0) / matches.length,
    topSkills: getTopSkills(matches),
    estimatedFillTime: estimateFillTime(job, matches),
    recommendations: []
  };
  
  // Generate recommendations
  if (insights.avgScore < 50) {
    insights.recommendations.push('Consider broadening skill requirements');
  }
  
  if (matches.length < 5) {
    insights.recommendations.push('Limited worker pool - consider adjusting location or pay');
  }
  
  if (job.workersNeeded > matches.length) {
    insights.recommendations.push('More workers needed than available matches');
  }
  
  return insights;
}

function getTopSkills(matches: MatchResult[]): string[] {
  const skillCounts: Record<string, number> = {};
  
  matches.forEach(match => {
    match.worker.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  
  return Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill);
}

function estimateFillTime(job: Job, matches: MatchResult[]): string {
  if (matches.length === 0) return 'Unknown';
  
  const avgResponseTime = matches.reduce(
    (sum, m) => sum + m.worker.stats.avgResponseTime,
    0
  ) / matches.length;
  
  if (avgResponseTime < 15) return 'Within 1 hour';
  if (avgResponseTime < 60) return 'Within 2 hours';
  if (avgResponseTime < 180) return 'Within 4 hours';
  return 'Within 24 hours';
}