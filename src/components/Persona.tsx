'use client';

import type { Persona } from '../types/council';
import { motion } from 'framer-motion';

export interface CouncilPersonaProps {
  persona: Persona;
  index: number;
  colors: string[];
}

export default function CouncilPersona({ persona, index, colors }: CouncilPersonaProps) {
  const primaryColor = colors[index % 3];
  const secondaryColor = colors[(index + 1) % 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative group h-full"
    >
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"
        style={{ backgroundColor: primaryColor, opacity: 0.3 }}
      />

      <div className="relative bg-white border-2 border-mistral-dark p-6 text-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 h-full flex flex-col">
        <div
          className="w-14 h-14 mx-auto flex items-center justify-center mb-4 border-2 border-mistral-dark shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="text-xl font-black text-white">{persona.name[0]}</span>
        </div>

        <h3 className="text-lg font-black text-mistral-dark mb-2 uppercase tracking-wide shrink-0">
          {persona.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed grow">{persona.description}</p>

        <div className="absolute top-2 right-2 flex gap-0.5">
          <span className="w-1 h-1" style={{ backgroundColor: primaryColor }} />
          <span className="w-1 h-1" style={{ backgroundColor: secondaryColor }} />
        </div>
      </div>
    </motion.div>
  );
}
