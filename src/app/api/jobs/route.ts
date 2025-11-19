// src/app/api/jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getJobs, saveJobs } from '@/lib/db';
import { determineJobStatus } from '@/lib/status';
import type { Job, JobFilter, JobStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skillsParam = searchParams.get('skills');
    const durationTypeParam = searchParams.get('durationType');
    const searchQuery = searchParams.get('search');

    let jobs = await getJobs();

    // Update statuses dynamically
    jobs = jobs.map(job => ({
      ...job,
      status: determineJobStatus(job)
    }));

    // Filter by skills
    if (skillsParam) {
      const skills = skillsParam.split(',');
      jobs = jobs.filter(job =>
        skills.some(skill => job.skills.includes(skill as any))
      );
    }

    // Filter by duration type
    if (durationTypeParam) {
      jobs = jobs.filter(job => job.durationType === durationTypeParam);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    // Only show non-filled jobs
    jobs = jobs.filter(job => job.status !== 'filled' && job.status !== 'cancelled');

    // Sort: hot first, then new, then by created date
    jobs.sort((a, b) => {
      const statusOrder: Record<JobStatus, number> = { 
        hot: 0, 
        new: 1, 
        filling: 2, 
        filled: 3, 
        cancelled: 4 
      };
      
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobs = await getJobs();

    const newJob: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title,
      description: body.description,
      status: 'new',
      workersNeeded: body.workersNeeded,
      duration: body.duration,
      durationType: body.durationType,
      location: body.location,
      pay: body.pay,
      skills: body.skills,
      poster: body.poster,
      acceptedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    };

    jobs.push(newJob);
    await saveJobs(jobs);

    // Trigger AI matching in background (simulated)
    // In production, this would be async
    const { calculateMatchScores } = await import('@/lib/matcher');
    const matchScores = await calculateMatchScores(newJob);
    
    newJob.matchScores = matchScores;
    await saveJobs(jobs);

    return NextResponse.json({
      success: true,
      data: newJob,
      message: 'Job posted successfully!'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}