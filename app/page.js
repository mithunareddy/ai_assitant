'use client';

import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Brain, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg p-2">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <span className="text-xl font-bold text-white">MedAssist</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <button className="text-white hover:text-gray-200 font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-2 px-6 rounded-lg transition-all duration-200">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Your Personal
            <span className="block text-yellow-300">AI Medical Assistant</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Get personalized health guidance, track your medical information, 
            and receive AI-powered recommendations 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Start Your Health Journey</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200">
                Try AI Chat
              </button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Comprehensive Health Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our AI-powered platform designed 
              to support your health journey every step of the way
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-red-100 rounded-lg p-3 w-fit mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Personalized Care</h3>
              <p className="text-gray-600">
                Get tailored health recommendations based on your unique medical history, 
                lifestyle, and current health goals
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Leverage advanced AI to analyze symptoms, understand conditions, 
                and receive evidence-based health guidance
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is encrypted and protected with enterprise-grade 
                security measures and privacy controls
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
                <Stethoscope className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Medical Tracking</h3>
              <p className="text-gray-600">
                Comprehensive tracking of symptoms, medications, appointments, 
                and health metrics in one centralized platform
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-100 rounded-lg p-3 w-fit mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Availability</h3>
              <p className="text-gray-600">
                Access your AI health assistant anytime, anywhere for immediate 
                support and guidance when you need it most
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Family Support</h3>
              <p className="text-gray-600">
                Manage health information for your entire family with shared access 
                and coordinated care management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to better health management</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600">
                  Fill out your comprehensive medical history and current health information
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Chat with AI Assistant</h3>
                <p className="text-gray-600">
                  Describe your symptoms and get personalized health recommendations
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Track & Improve</h3>
                <p className="text-gray-600">
                  Monitor your progress and receive ongoing guidance for better health outcomes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Take Control of Your Health Journey
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Instant Symptom Analysis</p>
                      <p className="text-gray-600">Get immediate insights about your symptoms</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Medication Management</p>
                      <p className="text-gray-600">Track prescriptions and get timely reminders</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Health Education</p>
                      <p className="text-gray-600">Learn about your conditions and treatment options</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <SignUpButton mode="modal">
                    <button className="bg-primary-600 text-white hover:bg-primary-700 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center space-x-2">
                      <span>Start Your Free Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </SignUpButton>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                    <p className="text-gray-600">AI Availability</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                    <p className="text-gray-600">Privacy Protected</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                    <p className="text-gray-600">Health Conditions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">10k+</div>
                    <p className="text-gray-600">Satisfied Users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Health Management?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who have already improved their health outcomes 
            with our AI-powered medical assistant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200">
                Try AI Assistant
              </button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-red-600 rounded-lg p-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MedAssist</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted AI-powered medical assistant for better health outcomes
            </p>
            <p className="text-sm text-gray-500">
              © 2024 MedAssist. All rights reserved. Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}