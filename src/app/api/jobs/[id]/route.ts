import { NextRequest, NextResponse } from 'next/server';
import { getJobs, saveJobs } from '../../../../lib/db';
import { determineJobStatus } from '@/lib/status';
import type { Job } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobs = await getJobs();
    let job = jobs.find((j: Job) => j.id === params.id);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Update status
    job = {
      ...job,
      status: determineJobStatus(job),
      views: job.views + 1
    };

    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const jobs = await getJobs();
    const jobIndex = jobs.findIndex((j: Job) => j.id === params.id);

    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...body,
      updatedAt: new Date()
    };

    await saveJobs(jobs);

    return NextResponse.json({
      success: true,
      data: jobs[jobIndex],
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}