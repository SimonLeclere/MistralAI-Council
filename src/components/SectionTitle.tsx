import clsx from 'clsx';

export type DividerColor = 'orange' | 'yellow';

export interface DividerProps {
  text: string;
  color: DividerColor;
  className?: string;
}

const COLOR = {
  orange: {
    dot: 'bg-mistral-orange',
  },
  yellow: {
    dot: 'bg-mistral-yellow',
  },
} as const;

export default function SectionTitle({ text, color, className }: DividerProps) {
  const styles = COLOR[color];

  return (
    <div className={clsx('flex items-center gap-4 text-gray-400', className)}>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={clsx('w-2 h-2', styles.dot)} />
        ))}
      </div>

      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-current">{text}</h2>

      <div className="flex-1 h-0.5 bg-current/30" />
    </div>
  );
}
