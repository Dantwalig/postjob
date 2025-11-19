'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobPostRequest, SkillTag, DurationType } from '@/types';

const SKILL_OPTIONS: SkillTag[] = [
  'physical-labor',
  'packaging',
  'plumbing',
  'electrical',
  'teaching',
  'handicraft',
  'cooking',
  'cleaning',
  'driving',
  'construction',
  'tutoring'
];

export default function JobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<JobPostRequest>({
    title: '',
    description: '',
    workersNeeded: 1,
    duration: 4,
    durationType: 'hours',
    location: 'Kigali',
    pay: '',
    skills: [],
    poster: {
      name: '',
      phone: ''
    }
  });

  const handleSkillToggle = (skill: SkillTag) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/dashboard?jobId=${result.data.id}`);
      } else {
        setError(result.error || 'Failed to post job');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Need 3 people for packaging"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what needs to be done..."
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How many workers?
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, workersNeeded: Math.max(1, prev.workersNeeded - 1) }))}
            className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={formData.workersNeeded}
            onChange={e => setFormData({ ...formData, workersNeeded: parseInt(e.target.value) || 1 })}
            className="w-20 text-center px-4 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, workersNeeded: prev.workersNeeded + 1 }))}
            className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <div className="flex gap-4 mb-3">
          {(['hours', 'days', 'weeks'] as DurationType[]).map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="durationType"
                checked={formData.durationType === type}
                onChange={() => setFormData({ ...formData, durationType: type })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
        <input
          type="number"
          min="1"
          value={formData.duration}
          onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
          className="w-24 px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills needed
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SKILL_OPTIONS.map(skill => (
            <label key={skill} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => handleSkillToggle(skill)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="capitalize">{skill.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pay (per person)
        </label>
        <input
          type="text"
          required
          value={formData.pay}
          onChange={e => setFormData({ ...formData, pay: e.target.value })}
          placeholder="e.g., 5,000 RWF"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Contact
        </label>
        <input
          type="tel"
          required
          value={formData.poster.phone}
          onChange={e => setFormData({ ...formData, poster: { ...formData.poster, phone: e.target.value } })}
          placeholder="+250 788 123 456"
          className="w-full px-4 py-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          required
          value={formData.poster.name}
          onChange={e => setFormData({ ...formData, poster: { ...formData.poster, name: e.target.value } })}
          placeholder="Your name"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Posting...' : 'Post Job & Find Workers'}
      </button>
    </form>
  );
}