import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'MedAssist - AI Medical Assistant',
  description: 'Your personal AI-powered medical assistant for health guidance and recommendations',
  keywords: ['medical', 'ai', 'health', 'assistant', 'healthcare'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased bg-gray-50 min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}