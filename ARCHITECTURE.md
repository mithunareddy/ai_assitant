# 🏗️ Medical Assistant AI - Architecture & Pipeline Overview

## 📊 High-Level System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   👤 User       │    │  🔐 Clerk Auth  │    │  🤖 Gemini AI  │
│   Interface     │◄──►│   Service       │    │    Service      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       ▲
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 Next.js Application                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Frontend      │  │   API Routes    │  │   Middleware    │ │
│  │   (React)       │◄─┤   (/api/*)      │◄─┤   (Clerk)       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  🗄️ PostgreSQL Database │
                   │      (Neon DB)          │
                   │  ┌─────────────────────┐│
                   │  │ • users             ││
                   │  │ • medical_forms     ││
                   │  │ • conversations     ││
                   │  │ • messages          ││
                   │  └─────────────────────┘│
                   └─────────────────────────┘
```

## 🔄 Data Flow Pipeline

### 1. 🚀 User Authentication Flow
```
User → Sign In/Up → Clerk Auth → JWT Token → Middleware → Protected Routes
```

### 2. 📋 Medical Form Submission Flow
```
Form Input → Validation → /api/forms → Database (medical_forms) → Form ID → Redirect to Chat
```

### 3. 💬 Chat Conversation Flow
```
User Message → /api/chat → Gemini AI → AI Response → Database (messages) → UI Update
```

### 4. 🖼️ Image Upload Flow
```
Image Files → /api/upload → Base64 Conversion → Database Storage → Gemini Vision API
```

## 📁 Component Connection Map

### **Frontend Components (React)**
```
app/
├── page.js (Landing) ──────────► Clerk Sign In/Up Components
├── dashboard/page.js ──────────► /api/conversations (GET)
├── form/page.js ───────────────► /api/forms (POST)
└── chat/[id]/page.js ──────────► /api/conversations/[id] (GET)
                              └─► /api/chat (POST)

components/
├── FormInput.js ───────────────► Used in form/page.js
├── ChatMessage.js ─────────────► Used in chat/page.js
├── LoadingSpinner.js ──────────► Used across all pages
└── ImageUpload.js ─────────────► Used in form + chat
```

### **API Routes (Backend)**
```
/api/
├── forms/route.js ─────────────► Creates medical_forms record
├── conversations/
│   ├── route.js ───────────────► Manages conversations (GET/POST)
│   └── [id]/route.js ──────────► Fetches specific conversation + messages
├── chat/route.js ──────────────► Handles AI interaction + message storage
└── upload/route.js ────────────► Processes image uploads
```

## 🗄️ Database Schema Relationships

```sql
users (Clerk ID)
├── id (primary key from Clerk)
├── email, firstName, lastName
└── createdAt, updatedAt

medical_forms
├── id (UUID primary key)
├── userId (foreign key → users.id) ──────┐
├── name, age, gender, weight, height     │
├── health data (complications, meds...)  │
└── uploadedImages (JSON array)           │
                                          │
conversations                             │
├── id (UUID primary key)                 │
├── userId (foreign key → users.id) ◄─────┘
├── formId (foreign key → medical_forms.id) ◄──┐
└── title, createdAt, updatedAt                │
                                               │
messages                                       │
├── id (UUID primary key)                      │
├── conversationId (foreign key → conversations.id) ◄─┘
├── role ('user' | 'assistant')
├── content (text)
├── images (JSON array)
└── createdAt
```

## 🔌 External Service Integrations

### **1. 🔐 Clerk Authentication**
```
Configuration: middleware.js
Usage: All protected routes
API Keys: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Flow: User auth → JWT → API validation → Database access
```

### **2. 🗄️ Neon DB (PostgreSQL)**
```
Configuration: lib/db.js
ORM: Drizzle ORM (lib/schema.js)
Connection: DATABASE_URL environment variable
Usage: All data persistence operations
```

### **3. 🤖 Google Gemini AI**
```
Configuration: lib/gemini.js
API Key: GEMINI_API_KEY
Model: gemini-1.5-flash
Features: Text + Vision (image analysis)
System Prompt: lib/system-prompt.js (comprehensive medical guidelines)
```

## 🌊 Request Flow Examples

### **Example 1: New User Registration**
```
1. User clicks "Sign Up" → Clerk modal opens
2. User completes registration → Clerk creates account
3. Clerk redirects to /dashboard → middleware validates JWT
4. Dashboard loads → fetches conversations (empty for new user)
5. User clicks "New Consultation" → redirects to /form
```

### **Example 2: Medical Form Submission**
```
1. User fills multi-step form → FormInput components collect data
2. Form validation → client-side checks
3. Submit button → POST /api/forms
4. API creates medical_forms record → returns formId
5. API creates conversation record → returns conversationId
6. Redirect to /chat/[conversationId]
```

### **Example 3: AI Chat Interaction**
```
1. User types message + uploads image → chat interface
2. POST /api/chat with { conversationId, message, images }
3. API fetches conversation + medical form data
4. API calls Gemini AI with system prompt + medical context
5. AI processes text + images → returns medical advice
6. API saves user message + AI response to messages table
7. Frontend displays new messages → auto-scroll to bottom
```

## 🔒 Security Pipeline

### **Authentication Flow**
```
Request → Clerk Middleware → JWT Validation → User ID → API Access
```

### **Data Protection**
```
1. All API routes protected by auth() from Clerk
2. Database queries filtered by userId
3. Medical data encrypted in transit (HTTPS)
4. Environment variables for sensitive keys
5. Input validation on all forms
```

## 📱 Component State Management

### **Form State (form/page.js)**
```
formData ──► Multi-step form state
currentStep ──► Progress tracking
uploadedImages ──► Image collection
loading ──► Submit state management
```

### **Chat State (chat/[id]/page.js)**
```
conversation ──► Current conversation data
messages ──► Message history array
newMessage ──► User input state
newImages ──► Image upload queue
sidebarOpen ──► Mobile UI state
```

### **Dashboard State (dashboard/page.js)**
```
conversations ──► User's chat history
loading ──► Data fetch state
user ──► Clerk user information
```

## 🎯 API Endpoint Details

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/api/forms` | POST | Submit medical form | Form data + images | Form ID |
| `/api/conversations` | GET | Get user conversations | User ID (from auth) | Conversation list |
| `/api/conversations` | POST | Create new conversation | Form ID | Conversation ID |
| `/api/conversations/[id]` | GET | Get conversation details | Conversation ID | Messages + form data |
| `/api/chat` | POST | Send message to AI | Message + images | AI response |
| `/api/upload` | POST | Upload files | File data | Base64 URLs |

## 🚀 Development Workflow

### **Local Development**
```
1. npm run dev → Start Next.js server
2. Database migrations → npm run db:migrate
3. Environment setup → .env.local configuration
4. Hot reload → Automatic code updates
```

### **Production Deployment**
```
1. Build → npm run build
2. Environment variables → Production keys
3. Database → Production PostgreSQL
4. Deploy → Vercel/Netlify/Custom hosting
```

This architecture ensures a robust, scalable medical AI application with clear separation of concerns, secure authentication, reliable data persistence, and intelligent AI integration.