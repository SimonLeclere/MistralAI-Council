'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
      {/* shadow */}
      <div 
        className="absolute inset-0 bg-mistral-dark translate-x-1 translate-y-1 transition-transform"
      />
      
      <motion.div 
        className="relative flex items-center bg-white p-3 border-2 border-mistral-dark"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Pixel decoration */}
        <div className="flex flex-col gap-0.5 mr-3">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-mistral-orange" />
            <span className="w-1.5 h-1.5 bg-mistral-yellow" />
          </div>
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-mistral-yellow" />
            <span className="w-1.5 h-1.5 bg-mistral-orange" />
          </div>
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask the Council a question..."
          className="flex-1 bg-transparent text-mistral-dark placeholder-gray-400 focus:outline-none text-lg py-2 font-medium"
          disabled={isLoading}
        />
        
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-mistral-orange text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          whileHover={{ scale: isLoading || !input.trim() ? 1 : 1.05 }}
          whileTap={{ scale: isLoading || !input.trim() ? 1 : 0.95 }}
        >
          <Send className="w-5 h-5 relative z-10" />
        </motion.button>
      </motion.div>
      
    </form>
  );
}
