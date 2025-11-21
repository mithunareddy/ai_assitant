# Medical Assistant AI

## Project Overview

This is a comprehensive medical assistant AI web application built with modern web technologies. The application allows users to input their medical information and receive AI-powered health guidance and recommendations.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Run database migrations: `npm run db:migrate`
5. Start the development server: `npm run dev`

## Required Environment Variables

- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication public key
- `CLERK_SECRET_KEY`: Clerk authentication secret key
- `GEMINI_API_KEY`: Google Gemini AI API key

## Features

- User authentication with Clerk
- Comprehensive medical form collection
- AI-powered health recommendations
- Real-time chat interface
- Image upload and analysis
- Responsive design
- Medical conversation history

## Tech Stack

- Next.js 14 with App Router
- React 18
- Tailwind CSS
- Clerk Authentication
- Drizzle ORM with PostgreSQL
- Google Gemini AI
- Lucide React Icons

## Important Medical Disclaimer

This application is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.