'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  X, 
  Heart,
  Menu,
  User,
  Bot,
  Paperclip,
  Image as ImageIcon,
  Calendar,
  Weight,
  Ruler,
  Droplet,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const conversationId = params.conversationId;

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    // Auto-generate initial assessment if conversation is empty
    if (conversation && messages.length === 0 && !sending) {
      generateInitialAssessment();
    }
  }, [conversation, messages.length, sending, generateInitialAssessment]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateInitialAssessment = async () => {
    if (sending || messages.length > 0) return;

    setSending(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: '', // Empty message triggers initial assessment
        }),
      });

      if (response.status === 503) {
        console.error('Database temporarily unavailable');
        alert('Database is temporarily unavailable. Please try again in a moment.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI initial assessment to messages
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: data.response,
        images: [],
        createdAt: new Date().toISOString(),
      };
      setMessages([aiMessage]);

    } catch (error) {
      console.error('Error generating initial assessment:', error);
      // Silently fail, user can manually trigger by sending a message
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            data: e.target.result,
          };
          setNewImages(prev => [...prev, imageData]);
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
    });
  };

  const removeNewImage = (imageId) => {
    setNewImages(prev => prev.filter(img => img.id !== imageId));
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && newImages.length === 0) || sending) return;

    const messageText = newMessage.trim();
    const messageImages = [...newImages];
    
    // Clear input
    setNewMessage('');
    setNewImages([]);
    setSending(true);

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      images: messageImages.map(img => img.data),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: messageText,
          images: messageImages.map(img => img.data),
        }),
      });

      if (response.status === 503) {
        console.error('Database temporarily unavailable');
        setMessages(prev => prev.slice(0, -1));
        alert('The database is temporarily unavailable. Please try again in a moment.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        images: [],
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMedicalInfo = (form) => {
    if (!form) return null;

    return (
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{form.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{form.age} years</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{form.gender}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Weight className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{form.weight}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{form.height}</span>
            </div>
            {form.bloodType && (
              <div className="flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Blood Type:</span>
                <span className="font-medium">{form.bloodType}</span>
              </div>
            )}
          </div>
        </div>

        {form.currentComplications && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Issues</h4>
            <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {form.currentComplications}
            </p>
          </div>
        )}

        {form.chronicConditions && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Chronic Conditions</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {form.chronicConditions}
            </p>
          </div>
        )}

        {form.medications && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Medications</h4>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              {form.medications}
            </p>
          </div>
        )}

        {form.allergies && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Known Allergies</h4>
            <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
              {form.allergies}
            </p>
          </div>
        )}

        <details className="border border-gray-200 rounded-lg">
          <summary className="cursor-pointer p-3 hover:bg-gray-50 font-medium text-gray-900">
            Diet Information
          </summary>
          <div className="p-3 border-t border-gray-200 space-y-3">
            {form.breakfastDetails && (
              <div>
                <h5 className="font-medium text-gray-700">Breakfast</h5>
                <p className="text-sm text-gray-600">{form.breakfastDetails}</p>
              </div>
            )}
            {form.lunchDetails && (
              <div>
                <h5 className="font-medium text-gray-700">Lunch</h5>
                <p className="text-sm text-gray-600">{form.lunchDetails}</p>
              </div>
            )}
            {form.dinnerDetails && (
              <div>
                <h5 className="font-medium text-gray-700">Dinner</h5>
                <p className="text-sm text-gray-600">{form.dinnerDetails}</p>
              </div>
            )}
          </div>
        </details>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversation not found</h1>
          <p className="text-gray-600 mb-4">The conversation you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Heart className="h-8 w-8 text-primary-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">MedAssist</span>
                <p className="text-sm text-gray-500">
                  Consultation with {conversation.medicalForm?.name || 'Patient'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="hidden lg:flex btn-secondary text-sm py-2 px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto custom-scrollbar
          fixed lg:static inset-y-0 z-40 lg:z-0
        `}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Medical Profile</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Started {format(new Date(conversation.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="p-4">
            {formatMedicalInfo(conversation.medicalForm)}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to your health consultation
                </h3>
                <p className="text-gray-600 mb-4">
                  I'm analyzing your medical information now. Feel free to ask me any questions 
                  about your health, symptoms, or recommendations.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`
                flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
              `}>
                <div className={`
                  max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2
                  ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}
                `}>
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${message.role === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'}
                  `}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`
                    rounded-2xl px-4 py-3 message-enter
                    ${message.role === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-900'}
                  `}>
                    {message.images && message.images.length > 0 && (
                      <div className="mb-3 grid grid-cols-2 gap-2">
                        {message.images.map((image, idx) => (
                          <img 
                            key={idx} 
                            src={image} 
                            alt="Uploaded" 
                            className="rounded-lg max-w-full h-32 object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`
                      text-xs mt-2 opacity-70
                      ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}
                    `}>
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            {newImages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {newImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img 
                      src={image.data} 
                      alt={image.name} 
                      className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removeNewImage(image.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health, symptoms, or any concerns..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={sending}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="chat-image-upload"
                  disabled={sending}
                />
                <label
                  htmlFor="chat-image-upload"
                  className={`
                    p-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors
                    ${sending ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <ImageIcon className="h-5 w-5" />
                </label>
                
                <button
                  onClick={sendMessage}
                  disabled={sending || (!newMessage.trim() && newImages.length === 0)}
                  className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Remember: This AI assistant provides general health guidance and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}