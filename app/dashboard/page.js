'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Heart, 
  Plus, 
  Calendar, 
  MessageSquare, 
  User, 
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchConversations();
    }
  }, [isLoaded, user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewConsultation = () => {
    router.push('/form');
  };

  const handleContinueConversation = (conversationId) => {
    router.push(`/chat/${conversationId}`);
  };

  const handleViewHealthStatus = () => {
    router.push('/dashboard/health-status');
  };

  const handleManageAppointments = () => {
    router.push('/dashboard/appointments');
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MedAssist</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user.firstName || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            How can I help you with your health today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartNewConsultation}>
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Consultation</h3>
                <p className="text-sm text-gray-600">Start a new health assessment</p>
              </div>
            </div>
          </div>

          {/* <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewHealthStatus}>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Health Status</h3>
                <p className="text-sm text-gray-600">View your health overview</p>
              </div>
            </div>
          </div> */}

          {/* <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={handleManageAppointments}>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-600">Manage your schedule</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conversation History */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Recent Conversations</span>
                </h2>
                <button 
                  onClick={handleStartNewConsultation}
                  className="btn-primary text-sm py-2 px-4"
                >
                  New Chat
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-20"></div>
                    </div>
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleContinueConversation(conversation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {conversation.title || `Consultation - ${conversation.medicalForm?.name || 'Health Assessment'}`}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(conversation.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(conversation.updatedAt), 'h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start your first health consultation to get personalized AI recommendations
                  </p>
                  <button 
                    onClick={handleStartNewConsultation}
                    className="btn-primary"
                  >
                    Start Your First Consultation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Tips */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Health Tips</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💧 Remember to drink at least 8 glasses of water today
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    🚶‍♂️ Take a 10-minute walk to boost your energy
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">
                    😴 Aim for 7-9 hours of quality sleep tonight
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Your Health Journey</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Consultations</span>
                  <span className="font-semibold text-gray-900">{conversations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Created</span>
                  <span className="font-semibold text-gray-900">
                    {format(new Date(user.createdAt), 'MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Health Score</span>
                  <span className="font-semibold text-green-600">Good</span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Emergency</h3>
              <p className="text-sm text-red-700 mb-3">
                For medical emergencies, call 911 or go to your nearest emergency room
              </p>
              <div className="text-sm text-red-600">
                <p>• Poison Control: 1-800-222-1222</p>
                <p>• Crisis Hotline: 988</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}