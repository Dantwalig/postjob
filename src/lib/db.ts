// src/lib/db.ts

import type { Job, Worker } from '@/types';
import jobsData from '@/db/jobs.json';
import workersData from '@/db/workers.json';

// In-memory storage (simulates database)
let jobs: Job[] = jobsData as Job[];
let workers: Worker[] = workersData as Worker[];

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
  jobs = jobsData as Job[];
  workers = workersData as Worker[];
}

// ---

// ## 10. 📱 USER FLOWS

// ### Flow 1: Job Poster Journey
// ```
// ┌─────────────────────────────────────────────────────────┐
// │                    JOB POSTER FLOW                      │
// └─────────────────────────────────────────────────────────┘

// 1. Landing on Homepage
//    │
//    ├─> Sees "Post Job" CTA
//    │
//    └─> Clicks "Post Job"

// 2. Job Creation Form (/post)
//    │
//    ├─> Fills in job details:
//    │   • Title
//    │   • Description
//    │   • # of workers
//    │   • Duration (hours/days/weeks)
//    │   • Skills needed
//    │   • Location
//    │   • Pay
//    │   • Contact (phone + name)
//    │
//    └─> Clicks "Post Job & Find Workers"

// 3. AI Matching (Background)
//    │
//    ├─> System calculates match scores
//    │   for all workers
//    │
//    ├─> Job assigned "NEW" status
//    │
//    └─> Job appears in worker feed

// 4. Redirects to Dashboard (/dashboard?jobId=xxx)
//    │
//    ├─> Shows posted job
//    │
//    ├─> Shows "0/3 workers accepted"
//    │
//    └─> Shows message: "We're showing this
//        to 12 matched workers nearby"

// 5. Workers Accept Job
//    │
//    ├─> Real-time updates on dashboard
//    │
//    ├─> Shows worker profiles with badges
//    │
//    ├─> Shows worker contact info
//    │
//    └─> Job status changes to "FILLING FAST"

// 6. Job Filled
//    │
//    ├─> Poster clicks "Mark as Filled"
//    │
//    ├─> Job status → "FILLED"
//    │
//    ├─> Job removed from worker feed
//    │
//    └─> Poster can post another job
// ```

// ### Flow 2: Worker Journey
// ```
// ┌─────────────────────────────────────────────────────────┐
// │                    WORKER FLOW                          │
// └─────────────────────────────────────────────────────────┘

// 1. Landing on Homepage (/)
//    │
//    ├─> Sees job feed with status badges
//    │   • 🔥 HOT
//    │   • ✨ NEW
//    │   • ⚡ FILLING FAST
//    │
//    ├─> Can use search bar
//    │
//    └─> Can apply filters

// 2. Browses Jobs
//    │
//    ├─> Sees job cards with:
//    │   • Title
//    │   • Duration, location, pay
//    │   • Skills required
//    │   • Workers accepted (2/3)
//    │
//    └─> Clicks "View Details"

// 3. Job Detail Page (/job/[id])
//    │
//    ├─> Sees full description
//    │
//    ├─> Sees poster contact
//    │
//    ├─> Sees AI match recommendation:
//    │   "✨ Recommended for you!"
//    │   "Match Score: 92%"
//    │
//    └─> Decides to accept

// 4. Accept Job (One Tap)
//    │
//    ├─> Clicks "Accept This Job"
//    │
//    ├─> Modal appears for quick info:
//    │   • Name
//    │   • Phone
//    │   • Skills (pre-selected)
//    │
//    └─> Confirms acceptance

// 5. Job Accepted
//    │
//    ├─> Success message shown
//    │
//    ├─> Worker added to poster's dashboard
//    │
//    ├─> Job counter updates (3/3)
//    │
//    └─> Worker can view accepted jobs

// 6. Offline Experience
//    │
//    ├─> Worker goes offline
//    │
//    ├─> Banner: "📡 You're offline"
//    │
//    ├─> Can still browse cached jobs
//    │
//    └─> Cannot accept until online
// ```

// ### Flow 3: AI Matching Process
// ```
// ┌─────────────────────────────────────────────────────────┐
// │                  AI MATCHING FLOW                       │
// └─────────────────────────────────────────────────────────┘

// 1. New Job Created
//    │
//    └─> Trigger: POST /api/jobs

// 2. Fetch All Workers
//    │
//    └─> GET workers from database

// 3. Calculate Match Scores (for each worker)
//    │
//    ├─> Skill Match (40 points)
//    │   • Compare job.skills vs worker.skills
//    │   • Full match = 40, partial = proportional
//    │
//    ├─> Location Match (20 points)
//    │   • Exact match = 20
//    │   • Same city = 10
//    │   • Different = 0
//    │
//    ├─> Reliability (15 points)
//    │   • Based on worker.stats.reliability
//    │
//    ├─> Response Rate (10 points)
//    │   • Based on worker.stats.responseRate
//    │
//    ├─> Experience (10 points)
//    │   • Based on jobsCompleted
//    │
//    └─> Badge Bonus (5 points)
//        • More badges = higher score

// 4. Store Match Scores
//    │
//    ├─> job.matchScores = { worker1: 92, worker2: 78, ... }
//    │
//    └─> Save to database

// 5. Sort Workers by Score
//    │
//    ├─> Top matches shown first
//    │
//    └─> Used for "Recommended for you" badge

// 6. Display to Workers
//    │
//    ├─> Job appears in feed
//    │
//    ├─> High-match workers see:
//    │   "✨ Recommended for you! Match: 92%"
//    │
//    └─> Low-match workers see normal view
// ```

// ### Component Interaction Diagram
// ```
// ┌────────────────────────────────────────────────────────┐
// │                  COMPONENT TREE                        │
// └────────────────────────────────────────────────────────┘

// App Layout (layout.tsx)
// │
// ├─> Header
// │   ├─> Logo
// │   ├─> Post Job Button
// │   └─> Menu
// │
// ├─> Home Page (page.tsx)
// │   ├─> FilterBar
// │   │   ├─> Search Input
// │   │   └─> Filter Dropdown
// │   │
// │   ├─> OfflineIndicator (conditional)
// │   │
// │   └─> Job Feed
// │       ├─> JobCard (repeated)
// │       │   ├─> StatusBadge
// │       │   ├─> SkillBadge (repeated)
// │       │   └─> Job Stats
// │       │
// │       ├─> LoadingState (when loading)
// │       └─> EmptyState (when no jobs)
// │
// ├─> Post Job Page (/post/page.tsx)
// │   ├─> Back Button
// │   └─> JobForm
// │       ├─> Text Inputs
// │       ├─> Number Inputs
// │       ├─> Radio Groups
// │       ├─> Checkbox Groups
// │       └─> Submit Button
// │
// ├─> Job Detail Page (/job/[id]/page.tsx)
// │   ├─> Back Button
// │   ├─> Job Header
// │   │   ├─> StatusBadge
// │   │   └─> Title
// │   ├─> Job Details
// │   │   ├─> Poster Info
// │   │   ├─> Duration/Location/Pay
// │   │   ├─> Description
// │   │   └─> Skills (SkillBadge repeated)
// │   ├─> Match Recommendation Box
// │   └─> Accept Button
// │
// └─> Dashboard Page (/dashboard/page.tsx)
//     ├─> Back Button
//     ├─> Active Jobs List
//     │   └─> Job Card (expanded)
//     │       ├─> StatusBadge
//     │       ├─> Worker List
//     │       │   └─> WorkerCard (repeated)
//     │       │       ├─> Name
//     │       │       ├─> TrustBadge (repeated)
//     │       │       └─> Contact
//     │       └─> Actions (Mark Filled, Edit)
//     │
//     └─> Post Another Job Button