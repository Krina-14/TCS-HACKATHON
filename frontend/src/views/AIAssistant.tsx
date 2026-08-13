import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Mic, X, RefreshCw, AlertTriangle, Layers, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ChatBubble } from '../components/ChatBubble';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

export const AIAssistant: React.FC = () => {
  const { 
    aiChatMessages, 
    addChatMessage, 
    clearChat, 
    voiceModalOpen, 
    setVoiceModalOpen, 
    triggerVoiceQuery,
    isVoiceActive,
    setVoiceActive,
    setView
  } = useStore();

  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, isAiThinking]);

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;
    setIsAiThinking(true);
    addChatMessage(textToSend);
    setInputText('');

    setTimeout(() => {
      setIsAiThinking(false);
    }, 1200);
  };

  const handleMicClick = () => {
    setVoiceModalOpen(true);
    setVoiceActive(true);
    // Simulate speech transcription after 2 seconds
    setTimeout(() => {
      triggerVoiceQuery("Who is free tomorrow at 10 AM?");
    }, 2200);
  };

  const suggestedChips = [
    "Who is free tomorrow at 10 AM?",
    "Why was Prof. Shah selected?",
    "Show IT-A timetable",
    "Show NLP expertise faculty",
  ];

  return (
    <>
      {/* Floating Sparkle/Robot Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-accent-ai to-primary-light text-white flex items-center justify-center shadow-2xl animate-pulse-glow focus:outline-none"
        title="Ask AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </motion.button>

      {/* Chat sliding interface panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary to-accent-ai text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse text-accent-ai-glow" />
                <span className="font-extrabold text-sm tracking-tight">SmartSched AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  className="text-[10px] uppercase font-bold text-white/80 hover:text-white hover:underline focus:outline-none"
                >
                  Clear Chat
                </button>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-bg-primary/30">
              {aiChatMessages.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                >
                  {/* Custom templates inside chat bubbles */}
                  {msg.template === 'faculty-free' && (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 border border-border bg-bg-card rounded-lg flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">AS</div>
                        <div>
                          <p className="text-xs font-bold">Prof. Ananya Shah</p>
                          <p className="text-[9px] text-text-muted">IT Dept • 94% Match suitability</p>
                        </div>
                      </div>
                      <div className="p-2 border border-border bg-bg-card rounded-lg flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">NJ</div>
                        <div>
                          <p className="text-xs font-bold">Prof. Neha Joshi</p>
                          <p className="text-[9px] text-text-muted">CSE Dept • 76% Match suitability</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.template === 'recommendation' && (
                    <button
                      onClick={() => {
                        setChatOpen(false);
                        setView('substitute-matching');
                      }}
                      className="text-[10px] font-bold text-white bg-accent-ai hover:bg-opacity-90 px-3 py-1.5 rounded mt-2 block text-center w-full"
                    >
                      Open Substitute Workflow
                    </button>
                  )}

                  {msg.template === 'timetable-mini' && (
                    <div className="p-2 border border-border bg-bg-card rounded-lg text-[10px] font-bold text-text-secondary mt-2">
                      <p className="border-b border-borderpb-1 mb-1 text-text-primary">Monday IT-A Schedule</p>
                      <ul className="space-y-1">
                        <li>🕒 9:00 - Python (Prof. Shah)</li>
                        <li>🕒 10:00 - DBMS (Prof. Mehta)</li>
                        <li>🕒 11:00 - AI (Prof. Mehta)</li>
                      </ul>
                    </div>
                  )}
                </ChatBubble>
              ))}

              {isAiThinking && (
                <ChatBubble sender="ai" text="" timestamp="Just now" isTyping />
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips suggested queries */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-bg-primary/50 border-t border-border border-dashed scrollbar-none">
              {suggestedChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="text-[10px] font-semibold bg-bg-card border border-border px-2.5 py-1 rounded-full text-text-secondary hover:border-accent-ai hover:text-accent-ai transition-colors focus:outline-none"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-bg-card flex items-center gap-2">
              <button
                onClick={handleMicClick}
                className="p-2 rounded-full text-text-secondary hover:text-accent-ai hover:bg-bg-elevated transition-colors"
                title="Voice Query"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask scheduling AI assistant..."
                className="w-full h-10 border border-border rounded-full px-4 text-xs text-text-primary focus:border-accent-ai focus:ring-accent-ai outline-none bg-transparent"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-light transition-all flex items-center justify-center flex-shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recognition Modal */}
      <Modal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        title={
          <div className="flex items-center gap-1 text-accent-ai">
            <Mic className="w-4 h-4 animate-pulse" /> Voice Query Interface
          </div>
        }
      >
        <div className="text-center py-6">
          {/* Animated sound wave bars */}
          <div className="flex items-end justify-center gap-1 h-14 mb-8 text-accent-ai">
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.1s', height: isVoiceActive ? 'auto' : '4px' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.3s', height: isVoiceActive ? 'auto' : '4px' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.5s', height: isVoiceActive ? 'auto' : '4px' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.2s', height: isVoiceActive ? 'auto' : '4px' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.4s', height: isVoiceActive ? 'auto' : '4px' }} />
          </div>

          <h4 className="font-bold text-sm text-text-primary dark:text-white">
            {isVoiceActive ? 'Listening to speech...' : 'Query Transcribed'}
          </h4>
          
          <div className="max-w-xs mx-auto mt-4 p-3 bg-bg-elevated/40 border border-border-light rounded-xl font-medium text-xs text-text-secondary min-h-[44px] flex items-center justify-center">
            {isVoiceActive ? 'Say "Who is free tomorrow at 10 AM?" or "Find substitute"...' : '"Who is free tomorrow at 10 AM?"'}
          </div>

          <div className="mt-8 flex justify-end gap-2 border-t border-border-light pt-4">
            <Button variant="outline" size="sm" onClick={() => setVoiceModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              size="sm" 
              disabled={isVoiceActive}
              onClick={() => {
                setVoiceModalOpen(false);
                setChatOpen(true);
              }}
            >
              Open AI Chat
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
