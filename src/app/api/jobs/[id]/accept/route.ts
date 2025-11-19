import { NextRequest, NextResponse } from 'next/server';
import { getJobs, saveJobs, getWorkers, saveWorkers } from '@/lib/db';
import { generateBadges } from '@/lib/badges';
import type { Worker } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const jobs = await getJobs();
    const jobIndex = jobs.findIndex(j => j.id === params.id);

    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const job = jobs[jobIndex];

    // Check if job is already filled
    if (job.acceptedBy.length >= job.workersNeeded) {
      return NextResponse.json(
        { success: false, error: 'Job is already filled' },
        { status: 400 }
      );
    }

    // Get or create worker
    let workers = await getWorkers();
    let worker = workers.find(w => w.phone === body.worker.phone);

    if (!worker) {
      // Create new worker
      worker = {
        id: `worker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: body.worker.name,
        phone: body.worker.phone,
        skills: body.worker.skills,
        location: body.worker.location,
        badges: generateBadges({
          jobsCompleted: 0,
          responseRate: 100,
          avgResponseTime: 5,
          reliability: 100
        }),
        stats: {
          jobsCompleted: 0,
          responseRate: 100,
          avgResponseTime: 5,
          reliability: 100
        },
        acceptedJobs: [],
        createdAt: new Date()
      };
      workers.push(worker);
    }

    // Check if worker already accepted this job
    if (job.acceptedBy.includes(worker.id)) {
      return NextResponse.json(
        { success: false, error: 'You have already accepted this job' },
        { status: 400 }
      );
    }

    // Accept job
    job.acceptedBy.push(worker.id);
    job.updatedAt = new Date();
    worker.acceptedJobs.push(job.id);

    // Update job status
    if (job.acceptedBy.length === job.workersNeeded) {
      job.status = 'filled';
    }

    await saveJobs(jobs);
    await saveWorkers(workers);

    return NextResponse.json({
      success: true,
      data: { job, worker },
      message: 'Job accepted successfully!'
    });
  } catch (error) {
    console.error('Error accepting job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept job' },
      { status: 500 }
    );
  }
}