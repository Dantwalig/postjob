import { NextRequest, NextResponse } from 'next/server';
import { getJobs, getWorkers } from '@/lib/db';
import { calculateMatchScore } from '@/lib/matcher';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workerId = searchParams.get('workerId');
    const phone = searchParams.get('phone');

    if (!workerId && !phone) {
      return NextResponse.json(
        { success: false, error: 'Worker ID or phone required' },
        { status: 400 }
      );
    }

    const workers = await getWorkers();
    const worker = workerId 
      ? workers.find(w => w.id === workerId)
      : workers.find(w => w.phone === phone);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      );
    }

    const jobs = await getJobs();
    const activeJobs = jobs.filter(
      j => j.status !== 'filled' && 
      j.status !== 'cancelled' &&
      !j.acceptedBy.includes(worker.id)
    );

    // Calculate match scores
    const matches = activeJobs.map(job => ({
      job,
      score: calculateMatchScore(worker, job),
      reasons: getMatchReasons(worker, job)
    }));

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    // Return top 5 matches
    const topMatches = matches.slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        worker,
        matches: topMatches
      }
    });
  } catch (error) {
    console.error('Error calculating matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate matches' },
      { status: 500 }
    );
  }
}

function getMatchReasons(worker: any, job: any): string[] {
  const reasons: string[] = [];
  
  const skillMatch = job.skills.filter((s: any) => worker.skills.includes(s));
  if (skillMatch.length > 0) {
    reasons.push(`Skills match: ${skillMatch.join(', ')}`);
  }
  
  if (worker.location === job.location) {
    reasons.push('Same location');
  }
  
  if (worker.stats.reliability > 80) {
    reasons.push('High reliability score');
  }
  
  if (worker.badges.includes('fast')) {
    reasons.push('Fast responder');
  }
  
  return reasons;
}