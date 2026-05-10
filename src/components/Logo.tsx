import { cn } from '../lib/utils';

/**
 * Renders the NoteMD logo from /public/logo.png (or /logo.svg).
 *
 * Drop the official logo file at:
 *   public/logo.png  (preferred: transparent background)
 *
 * `size` controls the rendered HEIGHT in px; width auto-scales.
 */
export default function Logo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
  /** Kept for backwards compatibility — the logo file already includes the wordmark, so this is ignored. */
  withWordmark?: boolean;
}) {
  return (
    <img
      src="/logo.png"
      alt="NoteMD"
      style={{ height: size, width: 'auto' }}
      className={cn('inline-block select-none', className)}
      draggable={false}
    />
  );
}
