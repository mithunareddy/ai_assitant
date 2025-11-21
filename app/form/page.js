'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Heart,
  User,
  Scale,
  Ruler,
  Droplet,
  AlertCircle,
  Utensils,
  Pill,
  FileText
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Health Status', icon: Heart },
  { id: 3, title: 'Diet & Lifestyle', icon: Utensils },
  { id: 4, title: 'Medical History', icon: FileText },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function MedicalForm() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    bloodType: '',
    currentComplications: '',
    breakfastDetails: '',
    lunchDetails: '',
    dinnerDetails: '',
    medications: '',
    allergies: '',
    chronicConditions: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            data: e.target.result,
            size: file.size
          };
          setUploadedImages(prev => [...prev, imageData]);
        };
        reader.onerror = (e) => {
          console.error('Error reading file:', file.name, e);
          alert(`Failed to read image file: ${file.name}. Please try again.`);
        };
        reader.onabort = () => {
          console.warn('File reading aborted:', file.name);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender && formData.weight && formData.height;
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // Submit form data
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          uploadedImages: uploadedImages.map(img => ({
            name: img.name,
            data: img.data,
            size: img.size
          }))
        }),
      });

      if (response.status === 503) {
        alert('Database is temporarily unavailable. Please try again in a moment.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Create conversation and redirect to chat
      const conversationResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: result.formId
        }),
      });

      if (conversationResponse.status === 503) {
        alert('Database is temporarily unavailable. Please try again in a moment.');
        setLoading(false);
        return;
      }

      if (!conversationResponse.ok) {
        throw new Error(`Server error: ${conversationResponse.status}`);
      }

      const conversationResult = await conversationResponse.json();
      router.push(`/chat/${conversationResult.conversationId}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="form-input"
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select gender</option>
                  {GENDERS.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight *
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 70 kg or 154 lbs"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height *
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 5'8&quot; or 173 cm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Health Status</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Health Complications or Concerns
              </label>
              <textarea
                value={formData.currentComplications}
                onChange={(e) => handleInputChange('currentComplications', e.target.value)}
                className="form-input h-32 resize-none"
                placeholder="Describe any current health issues, symptoms, or concerns you're experiencing..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Include symptoms, pain levels, duration, and any recent changes in your health
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chronic Conditions
              </label>
              <textarea
                value={formData.chronicConditions}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="List any ongoing medical conditions (diabetes, hypertension, asthma, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="List food allergies, drug allergies, environmental allergies, etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Diet & Lifestyle</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typical Breakfast
              </label>
              <textarea
                value={formData.breakfastDetails}
                onChange={(e) => handleInputChange('breakfastDetails', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="Describe what you typically eat for breakfast, including portion sizes and frequency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typical Lunch
              </label>
              <textarea
                value={formData.lunchDetails}
                onChange={(e) => handleInputChange('lunchDetails', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="Describe your usual lunch meals, including ingredients and preparation methods"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typical Dinner
              </label>
              <textarea
                value={formData.dinnerDetails}
                onChange={(e) => handleInputChange('dinnerDetails', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="Describe your dinner habits, including timing, portion sizes, and food choices"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical History & Documents</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications & Supplements
              </label>
              <textarea
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                className="form-input h-32 resize-none"
                placeholder="List all medications, dosages, frequency, and any supplements you're taking..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Include prescription drugs, over-the-counter medications, vitamins, and herbal supplements
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Documents & Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload medical reports, test results, or relevant images
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-outline cursor-pointer inline-block"
                >
                  Choose Files
                </label>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="image-preview h-32">
                        <img src={image.data} alt={image.name} />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="remove-btn"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2">
                          <p className="truncate">{image.name}</p>
                          <p>{formatFileSize(image.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MedAssist</span>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {STEPS.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive ? 'border-primary-600 bg-primary-600 text-white' : 
                      isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                      'border-gray-300 bg-white text-gray-400'}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {step.id < STEPS.length && (
                    <div className={`
                      ml-4 w-16 h-0.5 transition-colors
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="card">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <div>
              {currentStep < STEPS.length ? (
                <button
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !validateCurrentStep()}
                  className="btn-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Assessment</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Privacy & Security</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your medical information is encrypted and secure. This data is used solely 
                  to provide you with personalized health recommendations and is never shared 
                  with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}