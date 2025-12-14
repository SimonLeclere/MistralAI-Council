'use client';

import ScrollReveal from './ScrollReveal';

export interface CouncilSynthesisProps {
  synthesis: string;
}

export default function CouncilSynthesis({ synthesis }: CouncilSynthesisProps) {
  return (
    <ScrollReveal direction="up" className="relative mt-12">
      <div className="relative">
        <div className="absolute inset-0 bg-mistral-yellow translate-x-2 translate-y-2" />
        <div className="absolute inset-0 bg-mistral-orange translate-x-1 translate-y-1" />

        <div className="relative bg-white border-2 border-mistral-dark p-8">
          <div className="absolute top-3 left-3 flex gap-1">
            <span className="w-2 h-2 bg-mistral-orange" />
            <span className="w-2 h-2 bg-mistral-yellow" />
            <span className="w-2 h-2 bg-mistral-orange" />
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1">
            <span className="w-2 h-2 bg-mistral-orange" />
            <span className="w-2 h-2 bg-mistral-yellow" />
            <span className="w-2 h-2 bg-mistral-orange" />
          </div>

          <p className="text-lg text-mistral-dark leading-relaxed font-medium pt-4">{synthesis}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
