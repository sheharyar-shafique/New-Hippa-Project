import { cn } from '../lib/utils';

export default function Logo({
  className,
  withWordmark = true,
  size = 32,
}: {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Outlined medical cross */}
        <path
          d="M 40 14 L 60 14 A 4 4 0 0 1 64 18 L 64 36 L 82 36 A 4 4 0 0 1 86 40 L 86 60 A 4 4 0 0 1 82 64 L 64 64 L 64 82 A 4 4 0 0 1 60 86 L 40 86 A 4 4 0 0 1 36 82 L 36 64 L 18 64 A 4 4 0 0 1 14 60 L 14 40 A 4 4 0 0 1 18 36 L 36 36 L 36 18 A 4 4 0 0 1 40 14 Z"
          stroke="#22c55e"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Pen — diagonal across the cross */}
        <g transform="translate(50 50) rotate(40)">
          <rect x="-4.5" y="-26" width="9" height="44" rx="1.5" fill="#9CA3AF" />
          <rect x="-4.5" y="-15" width="9" height="4" fill="#6B7280" />
          <rect x="-4.5" y="-26" width="9" height="5" fill="#6B7280" />
          <polygon points="-4.5,18 4.5,18 0,28" fill="#4B5563" />
          <polygon points="-1.5,24 1.5,24 0,28" fill="#FFFFFF" />
        </g>
      </svg>
      {withWordmark && (
        <span className="font-extrabold leading-none text-[19px] tracking-[-0.035em] flex items-baseline">
          <span className="text-ink-700">Note</span>
          <span className="text-brand-600 ml-[1px]">MD</span>
        </span>
      )}
    </div>
  );
}
