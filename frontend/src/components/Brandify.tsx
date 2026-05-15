import { Fragment, ReactNode } from 'react';

const NAME = 'NoteMD';

/**
 * Wrap any string that may contain "NoteMD" — the brand name will be
 * rendered with the brand colors (grey "Note" + green "MD"), inheriting
 * the parent's font weight and size. Pass `dark` for use on dark
 * backgrounds (lighter grey + lighter green).
 */
export default function Brandify({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  if (typeof children !== 'string' || !children.includes(NAME)) {
    return <>{children}</>;
  }
  const parts = children.split(NAME);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <BrandWord dark={dark} />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export function BrandWord({ dark = false }: { dark?: boolean }) {
  const note = dark ? 'text-ink-100' : 'text-ink-700';
  const md = dark ? 'text-brand-300' : 'text-brand-600';
  return (
    <span className="whitespace-nowrap">
      <span className={note}>Note</span>
      <span className={md}>MD</span>
    </span>
  );
}
