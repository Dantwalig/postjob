export type JobStatus = 'new' | 'hot' | 'filling' | 'filled' | 'cancelled';

export type DurationType = 'hours' | 'days' | 'weeks';

export type SkillTag = 
  | 'physical-labor'
  | 'packaging'
  | 'plumbing'
  | 'electrical'
  | 'teaching'
  | 'handicraft'
  | 'cooking'
  | 'cleaning'
  | 'driving'
  | 'construction'
  | 'tutoring'
  | 'emergency';

export type BadgeType = 'reliable' | 'skilled' | 'fast' | 'verified';

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  workersNeeded: number;
  duration: number;
  durationType: DurationType;
  location: string;
  pay: string;
  skills: SkillTag[];
  poster: {
    name: string;
    phone: string;
  };
  acceptedBy: string[]; // Worker IDs
  createdAt: Date;
  updatedAt: Date;
  views: number;
  matchScores?: Record<string, number>; // workerId -> score
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  skills: SkillTag[];
  location: string;
  badges: BadgeType[];
  stats: {
    jobsCompleted: number;
    responseRate: number; // 0-100
    avgResponseTime: number; // minutes
    reliability: number; // 0-100
  };
  acceptedJobs: string[]; // Job IDs
  createdAt: Date;
}

export interface MatchResult {
  workerId: string;
  worker: Worker;
  score: number;
  reasons: string[];
}

export interface JobFilter {
  skills?: SkillTag[];
  durationType?: DurationType;
  status?: JobStatus[];
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface JobPostRequest {
  title: string;
  description: string;
  workersNeeded: number;
  duration: number;
  durationType: DurationType;
  location: string;
  pay: string;
  skills: SkillTag[];
  poster: {
    name: string;
    phone: string;
  };
}

export interface AcceptJobRequest {
  jobId: string;
  worker: {
    name: string;
    phone: string;
    skills: SkillTag[];
    location: string;
  };
}