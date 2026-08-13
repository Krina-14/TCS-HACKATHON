import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ChatBubbleProps {
  className?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  avatar?: string;
  isTyping?: boolean;
  children?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  className = '',
  sender,
  text,
  timestamp,
  avatar,
  isTyping = false,
  children,
}) => {
  const isUser = sender === 'user';

  const containerStyles = isUser 
    ? 'justify-end' 
    : 'justify-start';

  const bubbleStyles = isUser
    ? 'bg-primary text-white rounded-l-xl rounded-tr-xl'
    : 'bg-bg-card border-l-4 border-l-accent-ai border border-border text-text-primary rounded-r-xl rounded-tl-xl dark:bg-slate-800 dark:text-white dark:border-slate-700';

  return (
    <div className={`flex items-start gap-3 w-full ${containerStyles} ${className}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center flex-shrink-0 text-accent-ai dark:text-accent-ai-glow">
          {avatar ? (
            <img src={avatar} alt="AI Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <Sparkles className="w-4.5 h-4.5" />
          )}
        </div>
      )}

      {/* Bubble Message */}
      <div className="max-w-[75%] flex flex-col">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-4 py-3 text-sm shadow-sm leading-relaxed ${bubbleStyles}`}
        >
          {isTyping ? (
            <div className="flex items-center gap-1 py-1 px-2">
              <span className="w-2.5 h-2.5 bg-accent-ai rounded-full dot-bounce-1" />
              <span className="w-2.5 h-2.5 bg-accent-ai rounded-full dot-bounce-2" />
              <span className="w-2.5 h-2.5 bg-accent-ai rounded-full dot-bounce-3" />
            </div>
          ) : (
            <div>
              <p>{text}</p>
              {children && <div className="mt-3">{children}</div>}
            </div>
          )}
        </motion.div>
        
        {/* Timestamp */}
        <span className={`text-[10px] text-text-muted mt-1 px-1 font-mono ${isUser ? 'self-end' : 'self-start'}`}>
          {timestamp}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
          ME
        </div>
      )}
    </div>
  );
};
