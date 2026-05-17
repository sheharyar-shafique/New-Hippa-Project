import { cn } from '../lib/utils';

/**
 * NoteMD logo — green medical cross with pen icon + "NoteMD" wordmark.
 * Rendered as inline SVG so it works everywhere without external assets.
 */
export default function Logo({
  className,
  size = 28,
  dark = false,
}: {
  className?: string;
  size?: number;
  /** Use lighter colors for dark backgrounds. */
  dark?: boolean;
  /** Kept for backwards compatibility. */
  withWordmark?: boolean;
}) {
  const noteColor = dark ? '#e5e7eb' : '#374151';
  const mdColor = dark ? '#6ee7a0' : '#22c55e';
  const iconColor = '#22c55e';
  const penColor = dark ? '#e5e7eb' : '#374151';
  const h = size;
  const w = Math.round(h * 5.2);

  return (
    <svg
      viewBox="0 0 260 50"
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block select-none', className)}
      aria-label="NoteMD"
      role="img"
    >
      {/* Medical cross icon */}
      <g transform="translate(2, 5)">
        {/* Cross shape */}
        <path
          d="M14 0h12a2 2 0 012 2v12h12a2 2 0 012 2v12a2 2 0 01-2 2H28v12a2 2 0 01-2 2H14a2 2 0 01-2-2V30H0a2 2 0 01-2-2V16a2 2 0 012-2h12V2a2 2 0 012-2z"
          fill={iconColor}
          opacity="0.9"
          rx="3"
        />
        {/* Pen/pencil icon inside the cross */}
        <g transform="translate(12, 8)" stroke={dark ? '#1a1a1a' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M15.5 3.5L20 8l-12 12H4v-4L15.5 3.5z" />
          <path d="M13 6l4 4" />
        </g>
      </g>

      {/* "Note" text */}
      <text
        x="52"
        y="37"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="36"
        fontWeight="800"
        fill={noteColor}
        letterSpacing="-1"
      >
        Note
      </text>

      {/* "MD" text in green */}
      <text
        x="164"
        y="37"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="36"
        fontWeight="800"
        fill={mdColor}
        letterSpacing="-1"
      >
        MD
      </text>
    </svg>
  );
}
