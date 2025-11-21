import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export default function ChatMessage({ message, className = '' }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={clsx(
      'flex',
      isUser ? 'justify-end' : 'justify-start',
      className
    )}>
      <div className={clsx(
        'max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2',
        isUser && 'flex-row-reverse space-x-reverse'
      )}>
        {/* Avatar */}
        <div className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-600'
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        {/* Message Content */}
        <div className={clsx(
          'rounded-2xl px-4 py-3 message-enter',
          isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        )}>
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {message.images.map((image, idx) => (
                <img 
                  key={idx} 
                  src={typeof image === 'string' ? image : image.data} 
                  alt={`Message attachment ${idx + 1}`} 
                  className="rounded-lg max-w-full h-32 object-cover"
                />
              ))}
            </div>
          )}
          
          {/* Text Content */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Timestamp */}
          <p className={clsx(
            'text-xs mt-2 opacity-70',
            isUser ? 'text-primary-100' : 'text-gray-500'
          )}>
            {format(new Date(message.createdAt), 'h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
}