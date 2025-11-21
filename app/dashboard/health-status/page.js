'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Activity, ArrowLeft, Heart, Calendar } from 'lucide-react';

export default function HealthStatusPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="btn-secondary inline-flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Health Status Overview</h1>
          </div>
          <p className="text-gray-600">
            This page will summarize your latest health information from submitted forms and conversations. We\u2019ll show personalized insights, trends, and when to seek care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Current Summary</h3>
            </div>
            <p className="text-sm text-gray-600">
              No data yet. Start a new consultation to populate your health status.
            </p>
            <button
              onClick={() => router.push('/form')}
              className="btn-primary mt-4"
            >
              Start New Consultation
            </button>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <p className="text-sm text-gray-600">
              We\u2019ll display your recent conversations and health updates here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}