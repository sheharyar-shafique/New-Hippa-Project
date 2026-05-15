import { useState } from 'react';
import { cn } from '../lib/utils';

/**
 * NoteMD logo.
 *
 *   • If `public/logo.png` exists → renders the official image.
 *   • Otherwise → falls back to the styled "Note" (grey) + "MD" (green) wordmark
 *     so the brand still reads correctly until the image file is uploaded.
 */
export default function Logo({
  className,
  size = 28,
  dark = false,
}: {
  className?: string;
  size?: number;
  /** Use lighter colors for dark backgrounds in the fallback wordmark. */
  dark?: boolean;
  /** Kept for backwards compatibility — the logo image already includes the wordmark. */
  withWordmark?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    const note = dark ? 'text-ink-100' : 'text-ink-700';
    const md = dark ? 'text-brand-300' : 'text-brand-600';
    return (
      <span
        className={cn(
          'inline-flex items-baseline font-extrabold tracking-[-0.035em] select-none',
          className
        )}
        style={{ fontSize: Math.round(size * 0.72), lineHeight: 1 }}
        aria-label="NoteMD"
      >
        <span className={note}>Note</span>
        <span className={md}>MD</span>
      </span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="NoteMD"
      onError={() => setImgError(true)}
      style={{ height: size, width: 'auto' }}
      className={cn('inline-block select-none', className)}
      draggable={false}
    />
  );
}
