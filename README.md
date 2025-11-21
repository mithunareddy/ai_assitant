# MedAssist - AI Medical Assistant Web Application

A comprehensive, production-ready medical assistant AI web application built with Next.js 14, React 18, and Google Gemini AI. This application provides personalized health guidance and recommendations through an intelligent chat interface.

## 🏥 Features

### 🔐 **Authentication & Security**
- Secure user authentication with Clerk
- Protected routes and API endpoints
- User session management
- Privacy-focused design

### 📋 **Comprehensive Medical Forms**
- Multi-step form with progress tracking
- Personal information collection (age, gender, weight, height, blood type)
- Health status assessment (current complications, chronic conditions)
- Diet and lifestyle information
- Medical history and medications
- Image upload for medical documents
- Form validation and error handling

### 🤖 **AI-Powered Health Assistant**
- Google Gemini 2.5 Flash AI integration
- Personalized health recommendations
- Medical image analysis capability
- Context-aware conversations
- Emergency situation detection
- Professional medical disclaimer

### 💬 **Interactive Chat Interface**
- Real-time chat with AI assistant
- Message history persistence
- Image sharing in conversations
- Mobile-responsive design
- Typing indicators and loading states

### 📊 **Dashboard & Management**
- User dashboard with health overview
- Conversation history
- Quick access to new consultations
- Health tips and reminders

### 🎨 **Modern UI/UX**
- Beautiful, responsive design with Tailwind CSS
- Dark/light mode support
- Mobile-first approach
- Smooth animations and transitions
- Accessibility features

## 🛠 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, JavaScript
- **Styling**: Tailwind CSS with custom medical theme
- **Authentication**: Clerk
- **Database**: PostgreSQL with Neon DB
- **ORM**: Drizzle ORM
- **AI**: Google Gemini 2.5 Flash API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we recommend Neon DB for easy setup)
- Clerk account for authentication
- Google AI Studio account for Gemini API

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd medical-assistant-ai
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database Configuration
DATABASE_URL="your-neon-db-connection-string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Database Setup

Generate and run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 📁 Project Structure

```
medical-assistant-ai/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI chat endpoint
│   │   ├── conversations/        # Conversation management
│   │   ├── forms/                # Medical form submission
│   │   └── upload/               # File upload handling
│   ├── chat/[conversationId]/    # Chat interface
│   ├── dashboard/                # User dashboard
│   ├── form/                     # Medical form
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Landing page
├── components/                   # Reusable UI components
│   ├── Button.js                 # Custom button component
│   ├── ChatMessage.js            # Chat message display
│   ├── FormInput.js              # Form input component
│   ├── FormTextarea.js           # Form textarea component
│   ├── ImageUpload.js            # Image upload component
│   └── LoadingSpinner.js         # Loading indicators
├── lib/                          # Utility libraries
│   ├── db.js                     # Database connection
│   ├── gemini.js                 # Google Gemini AI integration
│   ├── medical-utils.js          # Medical-specific utilities
│   ├── schema.js                 # Drizzle database schema
│   ├── system-prompt.js          # AI system prompt
│   └── utils.js                  # General utilities
├── public/                       # Static assets
├── middleware.js                 # Clerk authentication middleware
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── drizzle.config.js            # Drizzle ORM configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Configuration Guide

### Database Setup (Neon DB)

1. Go to [Neon DB](https://neon.tech) and create an account
2. Create a new project and database
3. Copy the connection string to your `.env.local` file
4. Run migrations: `npm run db:migrate`

### Clerk Authentication Setup

1. Go to [Clerk](https://clerk.com) and create an account
2. Create a new application
3. Copy the publishable and secret keys to your `.env.local` file
4. Configure redirect URLs in Clerk dashboard:
   - Sign-in URL: `http://localhost:3000/sign-in`
   - Sign-up URL: `http://localhost:3000/sign-up`
   - After sign-in: `http://localhost:3000/dashboard`
   - After sign-up: `http://localhost:3000/dashboard`

### Google Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create or select a project
3. Generate an API key for Gemini
4. Add the API key to your `.env.local` file

## 🎯 Usage Guide

### For Users

1. **Sign Up/Sign In**: Create an account or sign in using Clerk authentication
2. **Complete Medical Form**: Fill out the comprehensive medical assessment form
3. **Start Chat**: Get initial AI analysis and continue with health questions
4. **Dashboard**: View conversation history and start new consultations

### For Developers

#### Adding New Features

1. **New Page**: Add pages in the `app/` directory following Next.js App Router conventions
2. **New Component**: Create reusable components in the `components/` directory
3. **New API Route**: Add API endpoints in the `app/api/` directory
4. **Database Changes**: Update schema in `lib/schema.js` and run migrations

#### Customizing the AI

1. **System Prompt**: Modify `lib/system-prompt.js` to change AI behavior
2. **Response Generation**: Update `lib/gemini.js` for custom AI interactions
3. **Medical Logic**: Add medical utilities in `lib/medical-utils.js`

## 🔒 Security & Privacy

### Data Protection
- All user data is encrypted in transit and at rest
- Medical information is handled according to privacy best practices
- Images are processed securely and not stored permanently
- Regular security updates and monitoring

### Medical Disclaimer
This application provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with bottom navigation

## 🚀 Deployment

### Production Deployment

1. **Database**: Set up production PostgreSQL database (Neon DB recommended)
2. **Environment**: Update environment variables for production
3. **Build**: Run `npm run build` to create production build
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred hosting platform

### Environment Variables for Production

```env
DATABASE_URL="your-production-db-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-production-clerk-key"
CLERK_SECRET_KEY="your-production-clerk-secret"
GEMINI_API_KEY="your-production-gemini-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Run migrations: `npm run db:migrate`

2. **Clerk Authentication Issues**
   - Verify API keys are correct
   - Check redirect URLs in Clerk dashboard
   - Ensure middleware is properly configured

3. **Gemini AI Not Responding**
   - Verify GEMINI_API_KEY is valid
   - Check API quotas and limits
   - Review network connectivity

4. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors (though project uses JavaScript)

## 📊 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Database query optimization
- Caching strategies for API responses
- Minification and compression in production

## 🧪 Testing

```bash
# Run tests (if test suite is added)
npm test

# Run linting
npm run lint

# Type checking (if TypeScript is added)
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful medical AI capabilities
- **Clerk** for seamless authentication
- **Neon DB** for reliable PostgreSQL hosting
- **Tailwind CSS** for beautiful, responsive design
- **Next.js** for the excellent React framework

## 🆘 Support

For support, email support@medassist.com or join our Discord community.

---

**Built with ❤️ for better healthcare accessibility**