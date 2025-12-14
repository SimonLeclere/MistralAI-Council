'use client';

import type { DialogueItem, Persona } from '../types/council';
import clsx from 'clsx';

import ScrollReveal from './ScrollReveal';

export interface CouncilMessageProps {
  item: DialogueItem;
  index: number;
  personas: Persona[];
  colors: string[];
}

export default function CouncilMessage({ item, index, personas, colors }: CouncilMessageProps) {
  const speakerIndex = personas.findIndex(p => p.name === item.speaker);
  const color = colors[speakerIndex % 3] || colors[0];
  const isLeft = index % 2 === 0;

  return (
    <ScrollReveal
      direction={isLeft ? 'left' : 'right'}
      className={clsx('flex flex-col max-w-[85%]', isLeft ? 'self-start' : 'self-end ml-auto items-end')}
    >
      <div className={clsx('flex items-center gap-2 mb-1', !isLeft && 'flex-row-reverse')}>
        <div className="flex gap-0.5">
          <span className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
          <span className="w-1.5 h-1.5" style={{ backgroundColor: color, opacity: 0.5 }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {item.speaker}
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 translate-x-1 translate-y-1" style={{ backgroundColor: color, opacity: 0.2 }} />
        <div className={clsx('relative p-4 border-2 border-mistral-dark bg-white')}>
          <p className="leading-relaxed text-mistral-dark">{item.text}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
