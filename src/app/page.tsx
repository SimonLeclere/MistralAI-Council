'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

import ChatInput from '@/components/ChatInput';
import CouncilView from '@/components/CouncilView';
import DitheredBackground from '@/components/DitheredBackground';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [gradientTargetY, setGradientTargetY] = useState(0);
  const [textYPosition, setTextYPosition] = useState(0);

  // When data is loaded, scroll so that the user's question is at the top of the screen
  // Also, adjust gradient target position to just below the text so the text is readable
  useEffect(() => {
    if (data && textYPosition > 0) {
      window.scrollTo({
        top: textYPosition - 60,
        behavior: 'smooth'
      });
      
      const textHeight = 7 * 4 * 2;
      setGradientTargetY(textYPosition + textHeight + 80);
    }
  }, [data, textYPosition]);

  // Update text position on mount and resize
  useEffect(() => {
    const updateTextPosition = () => {
      setTextYPosition(window.innerHeight * 0.65);
    };
    
    updateTextPosition();
    window.addEventListener('resize', updateTextPosition);
    return () => window.removeEventListener('resize', updateTextPosition);
  }, []);

  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    setError('');
    setData(null);
    setCurrentTopic(topic);
    setGradientTargetY(0);

    try {
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to summon the council');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('The Council is silent. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-mistral-dark font-sans selection:bg-mistral-yellow/30 overflow-x-hidden">
      <DitheredBackground 
        isLoading={isLoading} 
        revealText={currentTopic}
        textYPosition={textYPosition}
        gradientTargetY={gradientTargetY}
      />
      
      {/* Header section */}
      <div className="relative h-[50vh] flex flex-col items-center justify-center text-white z-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ 
            textShadow: '4px 4px 0 rgba(0,0,0,0.2)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          The Council of Wisdom
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-center px-4 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Summon a council of historical and fictional minds to debate your questions.
        </motion.p>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4" style={{ paddingBottom: data ? '5rem' : '0' }}>
        
        <motion.div 
          className="max-w-2xl mx-auto"
          style={{ marginBottom: data ? '4rem' : '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <ChatInput onSubmit={handleTopicSubmit} isLoading={isLoading} />
          {error && (
            <motion.div 
              className="bg-red-50 text-red-600 border-2 border-red-200 p-4 mt-4 text-center text-sm font-bold"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {data && <CouncilView key="content" data={data} />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {data && (
        <footer className="text-center py-12 mt-20 border-t-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium tracking-wide flex items-center justify-center gap-1">
            Built with
            <Heart className="w-4 h-4 text-red-500 inline-block" aria-hidden="true" />
            using Next.js & Mistral AI
          </p>
          <div className="mt-4 flex items-center justify-center gap-1">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1"
                style={{ 
                  backgroundColor: i % 3 === 0 ? '#F05822' : i % 3 === 1 ? '#FDB913' : '#ddd'
                }}
              />
            ))}
          </div>
        </footer>
        )}
      </div>
    </main>
  );
}
