// src/lib/cache.ts

import type { Job } from '@/types';

const CACHE_KEY = 'postjob_cache';
const CACHE_TIMESTAMP_KEY = 'postjob_cache_timestamp';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Save jobs to localStorage for offline access
 */
export function cacheJobs(jobs: Job[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(jobs));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache jobs:', error);
  }
}

/**
 * Retrieve cached jobs
 */
export function getCachedJobs(): Job[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    // Check if cache is expired
    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) {
      clearCache();
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to retrieve cached jobs:', error);
    return null;
  }
}

/**
 * Clear cache
 */
export function clearCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

/**
 * Check if currently offline
 */
export function isOffline(): boolean {
  if (typeof window === 'undefined') return false;
  return !navigator.onLine;
}

/**
 * Setup online/offline event listeners
 */
export function setupOfflineDetection(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}