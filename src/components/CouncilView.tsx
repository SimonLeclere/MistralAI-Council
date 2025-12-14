'use client';

import { motion } from 'framer-motion';
import type { CouncilData } from '../types/council';

import CouncilMessage from './Message';
import CouncilPersona from './Persona';
import CouncilSynthesis from './Synthesis';
import SectionTitle from './SectionTitle';

interface CouncilViewProps {
  data: CouncilData;
}

const personaColors = ['#F05822', '#FDB913', '#1A1A1A'];

export default function CouncilView({ data }: CouncilViewProps) {
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-12 pt-52"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SectionTitle text="Council Members" color="orange" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.personas.map((persona, idx) => (
          <CouncilPersona key={idx} persona={persona} index={idx} colors={personaColors} />
        ))}
      </div>

      <SectionTitle text="The Discourse" color="yellow" className="pt-8" />

      <div className="space-y-6 min-h-[300px]">
        {data.dialogue.map((item, idx) => (
          <CouncilMessage
            key={idx}
            item={item}
            index={idx}
            personas={data.personas}
            colors={personaColors}
          />
        ))}
      </div>

      <SectionTitle text="The Council's Decree" color="yellow" className="text-mistral-yellow" />

      <CouncilSynthesis synthesis={data.synthesis} />
    </motion.div>
  );
}
