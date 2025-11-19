import type { Job, Worker } from '@/types';
import jobsData from '@/db/jobs.json';
import workersData from '@/db/workers.json';

// Helper function to convert JSON dates to Date objects
function parseJobDates(job: any): Job {
  return {
    ...job,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt)
  };
}

function parseWorkerDates(worker: any): Worker {
  return {
    ...worker,
    createdAt: new Date(worker.createdAt)
  };
}

// In-memory storage (simulates database)
let jobs: Job[] = (jobsData as any[]).map(parseJobDates);
let workers: Worker[] = (workersData as any[]).map(parseWorkerDates);

/**
 * Get all jobs
 */
export async function getJobs(): Promise<Job[]> {
  // Simulate async database call
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...jobs];
}

/**
 * Save jobs
 */
export async function saveJobs(newJobs: Job[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  jobs = [...newJobs];
}

/**
 * Get single job
 */
export async function getJobById(id: string): Promise<Job | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return jobs.find(j => j.id === id) || null;
}

/**
 * Get all workers
 */
export async function getWorkers(): Promise<Worker[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...workers];
}

/**
 * Save workers
 */
export async function saveWorkers(newWorkers: Worker[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  workers = [...newWorkers];
}

/**
 * Get single worker
 */
export async function getWorkerById(id: string): Promise<Worker | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return workers.find(w => w.id === id) || null;
}

/**
 * Reset database to initial state (for testing)
 */
export function resetDatabase(): void {
  jobs = (jobsData as any[]).map(parseJobDates);
  workers = (workersData as any[]).map(parseWorkerDates);
}